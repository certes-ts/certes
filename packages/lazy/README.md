# @certes/lazy

Type-safe, reusable lazy iteration utilities for TypeScript. A comprehensive collection of curried functions for composable, memory-efficient data processing.

> [!CAUTION]
> ### ⚠️ Active Development & Alpha Status
> This repository is currently undergoing **active development**.
>
> **Until `1.0.0` release:**
> * **Stability:** APIs are subject to breaking changes without prior notice.
> * **Releases:** Current releases (tags/npm packages) are strictly for **testing and integration feedback**.
> * **Production:** Do not use this software in production environments where data integrity or high availability is required.

---

## Installation
```bash
npm install @certes/lazy
```

## Features

- **Lazy evaluation** — Elements are processed one at a time, on demand
- **Reusable iterables** — All iterables can be iterated multiple times
- **Curried API** — Functions are curried for easy composition
- **Type-safe** — Full TypeScript inference throughout pipelines
- **Memory efficient** — Process infinite or large datasets without loading everything into memory
- **Zero dependencies** — Pure TypeScript implementation
- **Composable** — Works seamlessly with `@certes/composition`

## Quick Start

```typescript
import { pipe } from '@certes/composition';
import { range, filter, map, take, collect } from '@certes/lazy';

// Process data lazily through a pipeline
const result = pipe(
  filter((x: number) => x % 2 === 0),
  map((x: number) => x * x),
  take(5),
  collect
)(range(1, 1000));
// [4, 16, 36, 64, 100]

// Iterables are reusable
const evens = filter((x: number) => x % 2 === 0)([1, 2, 3, 4, 5, 6]);

[...evens]; // [2, 4, 6]
[...evens]; // [2, 4, 6]
```

## When to Use Lazy vs Native

### Use Lazy Evaluation When:

#### Early Termination

When you only need a subset of results:

```typescript
// ✅ Lazy: only processes 10 elements
const firstTenEvens = pipe(
  largeArray,
  lazyMap(square),
  lazyFilter(isEven),
  take(10),
  collect
);

// ❌ Native: processes ALL elements before slicing
const firstTenEvens = largeArray
  .map(square)      // Processes all elements
  .filter(isEven)   // Filters all elements
  .slice(0, 10);    // Then takes 10
```

#### Memory-Constrained Environments

Lazy evaluation uses O(1) memory for transformations:

```typescript
// ✅ Lazy: constant memory usage
const processed = pipe(
  hugeDataset,
  lazyMap(transform1),    // No intermediate array
  lazyMap(transform2),    // No intermediate array
  lazyFilter(predicate),  // No intermediate array
  take(1000),
  collect                  // Only final 1000 items in memory
);

// ❌ Native: O(n) memory for each step
const processed = hugeDataset
  .map(transform1)    // Creates array of _n_ items
  .map(transform2)    // Creates another array of _n_ items
  .filter(predicate)  // Creates another array
  .slice(0, 1000);
```

#### Working with Infinite or Unknown-Size Streams

```typescript
// ✅ Lazy: can handle infinite sequences
const fibonacci = iterate(
  ([a, b]: [number, number]) => [b, a + b]
)([0, 1]);

const first100Fibs = pipe(
  fibonacci,
  map(([a]) => a),
  take(100),
  collect
);

// ❌ Native: impossible with infinite sequences
```

#### Complex Pipelines with Selective Processing

When combining multiple operations where most elements get filtered out:

```typescript
// ✅ Lazy: faster for selective processing
const errorLogs = pipe(
  millionLogs,
  lazyFilter(log => log.level === 'ERROR'),  // Only processes until 100 found
  lazyMap(enrichLog),
  take(100),
  collect
);
```

### Use Native Array Methods When:

#### Processing All Elements

When you need every element, native methods are optimized:

```typescript
// ✅ Native: faster for full consumption
const doubled = smallArray.map(x => x * 2);

// ❌ Lazy: overhead without benefit
const doubled = collect(lazyMap(x => x * 2)(smallArray));
```

#### Simple Operations on Small Arrays (<1000 elements)

The overhead of lazy evaluation isn't worth it for small datasets:

```typescript
// ✅ Native: simpler and faster for small arrays
const result = [1, 2, 3, 4, 5]
  .map(x => x * 2)
  .filter(x => x > 5);

// ❌ Lazy: unnecessary complexity
const result = pipe(
  [1, 2, 3, 4, 5],
  lazyMap(x => x * 2),
  lazyFilter(x => x > 5),
  collect
);
```

#### Random Access Needed

When you need index-based access:

```typescript
// ✅ Native: O(1) index access
const processed = array.map(transform);
console.log(processed[500]);  // Instant access

// ❌ Lazy: must iterate to index
const processed = lazyMap(transform)(array);
// No way to access element 500 without iterating
```

### Quick Decision Matrix

| Scenario | Use Lazy? | Performance Gain |
|----------|-----------|------------------|
| Need first N results | ✅ Yes | 100x-10,000x |
| Process until condition | ✅ Yes | 100x-3,000x |
| Large dataset, small output | ✅ Yes | 10x-150x |
| Infinite sequences | ✅ Yes | Only option |
| Memory constraints | ✅ Yes | O(1) vs O(n) |
| Process all elements | ❌ No | 2x-20x slower |
| Small arrays (<1000) | ❌ No | 10x-20x slower |
| Multiple iterations | ❌ No | Recomputes each time |
| Need random access | ❌ No | Not supported |
| Simple single operation | ❌ No | 3x-20x slower |

## API Reference

### Generators

Functions that create iterables from scratch.

| Function | Signature | Description |
|----------|-----------|-------------|
| `generate` | `(i → T) → Iterable<T>` | Infinite iterable from index function |
| `iterate` | `(T → T) → T → Iterable<T>` | Infinite iterable by repeated function application |
| `range` | `(start, end) → Iterable<number>` | Finite range of integers (inclusive) |
| `repeat` | `T → Iterable<T>` | Infinite repetition of a value |
| `replicate` | `n → T → Iterable<T>` | Finite repetition of a value |

```typescript
import { generate, iterate, range, repeat, replicate, take, collect } from '@certes/lazy';

// Generate squares: 0, 1, 4, 9, 16, ...
collect(take(5)(generate((i) => i * i)));
// [0, 1, 4, 9, 16]

// Powers of 2: 1, 2, 4, 8, 16, ...
collect(take(5)(iterate((x: number) => x * 2)(1)));
// [1, 2, 4, 8, 16]

// Range of integers (inclusive)
[...range(1, 5)];
// [1, 2, 3, 4, 5]

// Infinite repetition (use with take)
collect(take(3)(repeat('x')));
// ['x', 'x', 'x']

// Finite repetition
[...replicate(4)(0)];
// [0, 0, 0, 0]
```

### Transformers

Functions that transform iterables lazily, returning new iterables.

| Function | Signature | Description |
|----------|-----------|-------------|
| `chunk` | `n → Iterable<T> → Iterable<T[]>` | Group into fixed-size arrays |
| `concat` | `(...Iterable<T>[]) → Iterable<T> → Iterable<T>` | Append iterables |
| `drop` | `n → Iterable<T> → Iterable<T>` | Skip first n elements |
| `dropWhile` | `(T → boolean) → Iterable<T> → Iterable<T>` | Skip while predicate holds |
| `enumerate` | `Iterable<T> → Iterable<[number, T]>` | Pair elements with indices |
| `filter` | `(T → boolean) → Iterable<T> → Iterable<T>` | Keep elements matching predicate |
| `flatMap` | `(T → Iterable<R>) → Iterable<T> → Iterable<R>` | Map and flatten |
| `flatten` | `Iterable<Iterable<T>> → Iterable<T>` | Flatten one level |
| `interleave` | `Iterable<T> → Iterable<T> → Iterable<T>` | Alternate elements |
| `intersperse` | `T → Iterable<T> → Iterable<T>` | Insert separator between elements |
| `map` | `(T → R) → Iterable<T> → Iterable<R>` | Transform each element |
| `prepend` | `(...Iterable<T>[]) → Iterable<T> → Iterable<T>` | Prepend iterables |
| `scan` | `((A, T) → A, A) → Iterable<T> → Iterable<A>` | Running accumulation |
| `slice` | `(start, end?) → Iterable<T> → Iterable<T>` | Extract a slice |
| `take` | `n → Iterable<T> → Iterable<T>` | Take first n elements |
| `takeWhile` | `(T → boolean) → Iterable<T> → Iterable<T>` | Take while predicate holds |
| `tap` | `(T → void) → Iterable<T> → Iterable<T>` | Side-effect without modification |
| `unique` | `Iterable<T> → Iterable<T>` | Remove duplicates |
| `uniqueBy` | `(T → K) → Iterable<T> → Iterable<T>` | Remove duplicates by key |
| `zip` | `Iterable<U> → Iterable<T> → Iterable<[T, U]>` | Pair elements from two iterables |
| `zipWith` | `(Iterable<U>, (T, U) → R) → Iterable<T> → Iterable<R>` | Combine with function |

```typescript
import { pipe } from '@certes/composition';
import { range, map, filter, chunk, scan, zip, collect } from '@certes/lazy';

// Running sum
collect(scan((acc: number, x: number) => acc + x, 0)(range(1, 5)));
// [1, 3, 6, 10, 15]

// Chunk into pairs
collect(chunk(2)(range(1, 6)));
// [[1, 2], [3, 4], [5, 6]]

// Zip two iterables
collect(zip(['a', 'b', 'c'])([1, 2, 3]));
// [[1, 'a'], [2, 'b'], [3, 'c']]

// Complex pipeline
pipe(
  filter((x: number) => x % 3 === 0),
  map((x: number) => x * 2),
  chunk(5),
  collect
)(range(1, 100));
// [[6, 12, 18, 24, 30], [36, 42, 48, 54, 60], ...]
```

### Terminals

Functions that consume iterables and return concrete values.

| Function | Signature | Description |
|----------|-----------|-------------|
| `collect` | `Iterable<T> → T[]` | Collect into array |
| `takeEager` | `n → Iterable<T> → T[]` | Take and collect |

```typescript
import { range, filter, collect } from '@certes/lazy';

// Collect filtered results
collect(filter((x: number) => x > 3)(range(1, 5)));
// [4, 5]
```

## Composition with `@certes/composition`

All functions are curried and designed to work with `pipe` and `compose`:

```typescript
import { pipe, compose } from '@certes/composition';
import { range, filter, map, scan, take, collect } from '@certes/lazy';

// Using pipe (left-to-right)
const scanOfSquaredEvens = pipe(
  filter((x: number) => x % 2 === 0),
  map((x: number) => x * x),
  scan((acc: number, x: number) => acc + x, 0),
  collect
);

scanOfSquaredEvens(range(1, 10)); // [ 4, 20, 56, 120, 220 ]

const takeThree = take(3);
const mapDouble = map((x: number) => x * 2);

// Using compose (right-to-left)
const firstThreeDoubled = compose(
  collect,
  mapDouble,
  takeThree
);

firstThreeDoubled(range(1, 100)); // [2, 4, 6]
```

## Infinite Iterables

Generators like `repeat`, `iterate`, and `generate` produce infinite iterables. Always use limiting operations like `take` or `takeWhile`:

```typescript
import { iterate, map, take, collect } from '@certes/lazy';

// Fibonacci sequence
const fibs = iterate(
  ([a, b]: [number, number]) => [b, a + b] as [number, number]
)([0, 1]);

collect(take(10)(map(([a]: [number, number]) => a)(fibs)));
// [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
```

## License

MIT

## Contributing

Part of the [@certes](https://github.com/certes-ts/certes) monorepo. See main repository for contribution guidelines.
