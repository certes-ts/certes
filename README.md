# @certes

A comprehensive collection of type-safe, composable functional programming utilities for TypeScript. Built on principles from combinatory logic, lambda calculus, and category theory.

## Packages

| Package | Description |
|---------|-------------|
| [@certes/combinator](#certescombinator) | Classical combinatory logic primitives (SKI calculus, bird combinators) |
| [@certes/common](#certescommon) | Common utility functions (lookup, noop, once, tap) |
| [@certes/composition](#certescomposition) | Function composition utilities (compose, pipe, curry) |
| [@certes/lazy](#certeslazy) | Reusable lazy iteration primitives |
| [@certes/list](#certeslist) | Curried array operations |
| [@certes/logic](#certeslogic) | Boolean logic operations and predicate combinators |

## Philosophy

**Correctness as a Goal**
APIs designed for type safety with full TypeScript inference, aiming to minimize runtime surprises.

**Performance-Oriented**
Implementations tuned for V8 performance. Manual loops over abstractions where it matters.

**Composability by Design**
Functions are curried to enable point-free programming and pipeline construction.

**Mathematical Foundations**
Based on proven abstractions from combinatory logic, lambda calculus, and functional programming theory.

## Installation

```bash
# Install individual packages
npm install @certes/combinator
npm install @certes/composition
npm install @certes/lazy
npm install @certes/list
npm install @certes/logic

# Or install multiple at once
npm install @certes/combinator @certes/composition @certes/list
```

## Quick Start

### Composition Pipeline

```typescript
import { pipe } from '@certes/composition';
import { filter, map, reduce } from '@certes/list';
import { andFn, notFn } from '@certes/logic';

// Build predicates
const isEven = (x: number) => x % 2 === 0;
const isPositive = (x: number) => x > 0;
const isPositiveOdd = andFn(isPositive)(notFn(isEven));

// Compose operations
const sumOfPositiveOdds = pipe(
  filter(isPositiveOdd),
  map((x: number) => x * x),
  reduce((acc: number, x: number) => acc + x)(0)
);

sumOfPositiveOdds([1, -2, 3, 4, 5, -6, 7]);
// 84 (1² + 3² + 5² + 7² = 1 + 9 + 25 + 49)
```

### Lazy Evaluation

```typescript
import { pipe } from '@certes/composition';
import { range, filter, map, take, collect } from '@certes/lazy';

// Process only what's needed - infinite range, but only 5 results computed
const firstFiveSquaredEvens = pipe(
  filter((x: number) => x % 2 === 0),
  map((x: number) => x * x),
  take(5),
  collect
);

firstFiveSquaredEvens(range(1, Infinity));
// [4, 16, 36, 64, 100]
```

### Combinator Logic

```typescript
import { fork, compose, pipe, flip } from '@certes/combinator';

// Fork: apply one value to two functions, combine results
const stats = fork
  ((sum: number) => (count: number) => ({ sum, count, avg: sum / count }))
  ((nums: number[]) => nums.reduce((a, b) => a + b, 0))
  ((nums: number[]) => nums.length);

stats([10, 20, 30, 40, 50]);
// { sum: 150, count: 5, avg: 30 }

// Compose unary after binary with Blackbird
import { blackbird as compose2 } from '@certes/combinator';
const sortBy = (fn: (x: any) => any) => (arr: any[]) => [...arr].sort((a, b) => {
  const aVal = fn(a);
  const bVal = fn(b);
  return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
});

const sortByLength = compose2(sortBy)((s: string) => s.length);
sortByLength(['aaa', 'a', 'aa']);
// ['a', 'aa', 'aaa']
```

### Async Composition

```typescript
import { pipeAsync } from '@certes/composition';

type User = { id: number; email: string };
type Data = { userId: number };

// Mix sync and async operations seamlessly
const notifyUser = pipeAsync(
  async (id: number): Promise<User> => fetchUser(id),
  (user: User) => user.email,                    // sync
  async (email: string) => sendEmail(email)       // async
);

await notifyUser(123);
```

## Package Overviews

### @certes/combinator

Classical combinatory logic primitives implementing the SKI calculus and Raymond Smullyan's bird combinators. Provides the theoretical foundation for point-free programming.

**Key exports:** `compose`, `pipe`, `fork`, `flip`, `identity`, `constant`, `substitution`, `on`

```typescript
import { pipe, fork, on } from '@certes/combinator';

// On combinator: transform arguments before applying binary operation
const compareByLength = on
  ((a: number) => (b: number) => a - b)
  ((s: string) => s.length);

compareByLength('hello')('world'); // 0
```

### @certes/common

Essential utilities for functional programming patterns.

**Key exports:** `lookup`, `noop`, `once`, `tap`

```typescript
import { tap } from '@certes/common';
import { pipe } from '@certes/composition';

// Debug pipelines without breaking the flow
const process = pipe(
  (x: number) => x * 2,
  tap(x => console.log('Doubled:', x)),
  (x: number) => x + 3,
  tap(x => console.log('Added 3:', x))
);
```

### @certes/composition

Function composition utilities with both synchronous and asynchronous variants.

**Key exports:** `compose`, `pipe`, `composeAsync`, `pipeAsync`, `curry`

```typescript
import { curry } from '@certes/composition';

const add = (a: number, b: number, c: number) => a + b + c;
const curriedAdd = curry(add);

curriedAdd(1)(2)(3);    // 6
curriedAdd(1, 2)(3);    // 6
curriedAdd(1)(2, 3);    // 6
```

### @certes/lazy

Reusable lazy iteration for memory-efficient data processing.

**Key exports:** `range`, `map`, `filter`, `take`, `chunk`, `scan`, `zip`, `collect`

```typescript
import { iterate, map, take, collect } from '@certes/lazy';

// Fibonacci sequence
const fibs = iterate(([a, b]: [number, number]) => [b, a + b])([0, 1]);
const firstTenFibs = collect(take(10)(map(([a, _]: [number, number]) => a)(fibs)));
// [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
```

### @certes/list

Pure, curried array operations optimized for V8.

**Key exports:** `map`, `filter`, `reduce`, `find`, `flatten`, `reverse`, `slice`

```typescript
import { filter, map, reduce } from '@certes/list';

const sumSquaredEvens = (nums: number[]) =>
  reduce((acc: number, x: number) => acc + x)(0)(
    map((x: number) => x * x)(
      filter((x: number) => x % 2 === 0)(nums)
    )
  );
```

### @certes/logic

Boolean logic operations with both value-level and function-level (predicate) variants.

**Key exports:** `and`, `or`, `not`, `xor`, `andFn`, `orFn`, `notFn`, `nullishOr`

```typescript
import { andFn, notFn } from '@certes/logic';
import { filter } from '@certes/list';

const isEven = (x: number) => x % 2 === 0;
const isLarge = (x: number) => x > 100;

const isOddAndLarge = andFn(notFn(isEven))(isLarge);

filter(isOddAndLarge)([50, 99, 101, 150, 200]);
// [101]
```

## Design Principles

### Currying

All multi-argument functions are curried by default, enabling partial application and composition:

```typescript
import { filter, map } from '@certes/list';

// Create reusable transformations
const filterEvens = filter((x: number) => x % 2 === 0);
const double = map((x: number) => x * 2);

const processNumbers = (nums: number[]) => double(filterEvens(nums));
```

### Purity

Functions strive to avoid mutations and side effects, aiming for referential transparency:

```typescript
import { reverse } from '@certes/list';

const original = [1, 2, 3];
const reversed = reverse(original);

console.log(original); // [1, 2, 3] - unchanged
console.log(reversed); // [3, 2, 1]
```

### Type Safety

Designed to provide full TypeScript inference throughout composition chains:

```typescript
import { pipe } from '@certes/composition';
import { map, filter } from '@certes/list';

// Type flows through entire pipeline
const result = pipe(
  filter((x: number) => x > 0),
  map((x: number) => x.toString()),
  map((x: string) => x.length)
)([1, -2, 3, -4, 5]);
// result: number[]
```

## Performance

- **Manual loop implementations** for array operations instead of relying on native methods where performance matters
- **Lazy evaluation** processes only what's needed - enables safe work with infinite sequences
- **Low overhead** from currying - designed to work well with V8 optimization
- **Zero dependencies** across all packages

## Contributing

This is a monorepo managed with standard pnpm workspaces. All packages follow the same development workflow:

```bash
# Install dependencies
pnpm install

# Run tests across all packages
pnpm run test

# Run lint across all packages
pnpm run lint

# Build all packages
pnpm run build
```

## License

MIT
