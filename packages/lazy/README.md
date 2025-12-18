# @certes/lazy

Type-safe, reusable lazy iteration utilities for TypeScript. A comprehensive collection of curried functions for composable, memory-efficient data processing.

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

## Performance

| Aspect | Characteristic |
|--------|----------------|
| **Evaluation** | Lazy — elements processed on demand |
| **Memory** | O(1) for most operations |
| **Reusability** | All iterables can be iterated multiple times |
| **Short-circuit** | Operations like `take`, `find` stop early |

```typescript
// Only processes 3 elements, not 1 million
const result = pipe(
  filter((x: number) => x % 2 === 0),
  take(3),
  collect
)(range(1, 1_000_000));
// [2, 4, 6]
```

## License

MIT

## Contributing

Part of the [@certes](https://github.com/certes-ts/certes) monorepo. See main repository for contribution guidelines.
