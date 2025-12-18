# @certes/list

Curried array operations for functional programming in TypeScript.

## Installation
```bash
npm install @certes/list
```

## Features

- **Pure Functions**: All operations are side-effect free and non-mutating
- **Curried by Default**: Optimized for composition and partial application
- **Performance-First**: Manual loop implementations optimized for V8
- **Type-Safe**: Full TypeScript support with strict typing
- **Zero Dependencies**: Minimal footprint

## Usage
```typescript
import { filter, map, reduce } from '@certes/list';

// Basic usage
const nums = [1, 2, 3, 4, 5];
const doubled = map((x: number) => x * 2)(nums);
// [2, 4, 6, 8, 10]

// Currying enables partial application
const filterEven = filter((x: number) => !(x & 1));
const evens = filterEven(nums);
// [2, 4]

// Composition
const sum = reduce((acc: number, x: number) => acc + x)(0);
const sumOfEvens = (arr: number[]) => sum(filterEven(arr));
sumOfEvens(nums);
// 6
```

## API Reference

### Transformation

**`map<T, R>(fn: (x: T, idx?: number) => R) => (arr: T[]) => R[]`**

Maps over an array, applying the function to each element.

```typescript
const square = (x: number) => x * x;
map(square)([1, 2, 3]);
// [1, 4, 9]
```

**`filter<T>(predicate: (x: T, idx?: number) => boolean) => (arr: T[]) => T[]`**

Returns elements that satisfy the predicate.

```typescript
const isPositive = (x: number) => x > 0;
filter(isPositive)([-1, 0, 1, 2]);
// [1, 2]
```

**`flatMap<T, R>(fn: (x: T, idx?: number) => R[]) => (arr: T[]) => R[]`**

Maps each element to an array and flattens the result.

```typescript
const duplicate = (x: number) => [x, x];
flatMap(duplicate)([1, 2, 3]);
// [1, 1, 2, 2, 3, 3]
```

**`flatten<T>(arr: T[][]) => T[]`**

Flattens a nested array by one level.

```typescript
flatten([[1, 2], [3, 4], [5]]);
// [1, 2, 3, 4, 5]
```

**`reverse<T>(arr: T[]) => T[]`**

Reverses array order.

```typescript
reverse([1, 2, 3, 4]);
// [4, 3, 2, 1]
```

### Reduction

**`reduce<T, R>(fn: (acc: R, x: T) => R) => (init: R) => (arr: T[]) => R`**

Left-to-right reduction with accumulator.

```typescript
const multiply = (acc: number, x: number) => acc * x;
reduce(multiply)(1)([2, 3, 4]);
// 24
```

**`reduceRight<T, R>(fn: (acc: R, x: T) => R) => (init: R) => (arr: T[]) => R`**

Right-to-left reduction with accumulator.

```typescript
const concat = (acc: string, x: string) => `${acc}${x}`;
reduceRight(concat)('')(['a', 'b', 'c']);
// 'cba'
```

### Searching

**`find<T>(predicate: (x: T, idx?: number) => boolean) => (arr: T[]) => T | null`**

Returns first element matching predicate, or `null`.

```typescript
find((x: number) => x > 3)([1, 2, 3, 4, 5]);
// 4
```

**`findIndex<T>(predicate: (x: T, idx?: number) => boolean) => (arr: T[]) => number`**

Returns index of first match, or `-1`.

```typescript
findIndex((x: number) => x > 3)([1, 2, 3, 4, 5]);
// 3
```

**`findLast<T>(predicate: (x: T, idx?: number) => boolean) => (arr: T[]) => T | null`**

Returns last element matching predicate, or `null`.

```typescript
findLast((x: number) => !(x & 1))([1, 2, 3, 4, 5]);
// 4
```

**`findLastIndex<T>(predicate: (x: T, idx?: number) => boolean) => (arr: T[]) => number`**

Returns index of last match, or `-1`.

```typescript
findLastIndex((x: number) => !(x & 1))([1, 2, 3, 4, 5]);
// 3
```

**`includes<T>(x: T) => (arr: T[]) => boolean`**

Determines if array contains element (strict equality).

```typescript
includes(3)([1, 2, 3, 4, 5]);
// true
```

**`indexOf<T>(x: T) => (arr: T[]) => number`**

Returns first index of element, or `-1`.

```typescript
indexOf(3)([1, 2, 3, 4, 5]);
// 2
```

### Testing

**`every<T>(comparator: (x: T) => boolean) => (arr: T[]) => boolean`**

Tests if all elements satisfy comparator.

```typescript
every((x: number) => x > 0)([1, 2, 3]);
// true
```

**`some<T>(comparator: (x: T) => boolean) => (arr: T[]) => boolean`**

Tests if any element satisfies comparator.

```typescript
some((x: number) => x > 3)([1, 2, 3, 4, 5]);
// true
```

### Construction

**`concat<T>(first: T[]) => (second: T[]) => T[]`**

Concatenates two arrays.

```typescript
concat([1, 2])([3, 4]);
// [1, 2, 3, 4]
```

**`push<T>(arr: T[]) => (x: T) => T[]`**

Returns new array with element appended.

```typescript
push([1, 2, 3])(4);
// [1, 2, 3, 4]
```

**`unshift<T>(arr: T[]) => (x: T) => T[]`**

Returns new array with element prepended.

```typescript
unshift([2, 3, 4])(1);
// [1, 2, 3, 4]
```

**`slice(start: number) => (end: number) => <T>(arr: T[]) => T[]`**

Returns slice from `start` (inclusive) to `end` (exclusive).

```typescript
slice(1)(3)([0, 1, 2, 3, 4]);
// [1, 2]
```

**`shift<T>(arr: T[]) => [T | null, T[]]`**

Returns tuple of first element (head) and remaining elements (tail).

```typescript
shift([1, 2, 3, 4]);
// [1, [2, 3, 4]]

shift([]);
// [null, []]
```

## Design Principles

### Currying

Functions are curried to enable partial application and composition:

```typescript
import { filter, map, reduce, every } from '@certes/list';

// Create reusable predicates
const isPositive = (x: number) => x > 0;
const filterPositive = filter(isPositive);

// Compose operations
const sumPositive = (arr: number[]) =>
  reduce((a: number, b: number) => a + b)(0)(filterPositive(arr));

// Pipeline-style composition
const processNumbers = (arr: number[]) => {
  const positives = filterPositive(arr);
  const doubled = map((x: number) => x * 2)(positives);

  return every((x: number) => x < 100)(doubled);
};
```

### Purity

No function mutates its input or produces side effects:

```typescript
const original = [1, 2, 3];
const reversed = reverse(original);

console.log(original); // [1, 2, 3] - unchanged
console.log(reversed); // [3, 2, 1]
```

## Type Utilities

```typescript
export type ArrayElementType<T> = T extends (infer E)[] ? E : T;
export type Comparator<T> = (x: T) => boolean;
export type Predicate<T> = (x: T, idx?: number) => boolean;
export type Accumulator<T, R> = (acc: R, x: T) => R;
export type MapFn<T, R> = (x: T, idx?: number) => R;
```

## License

MIT

## Contributing

Part of the [@certes](https://github.com/certes-ts/certes) monorepo. See main repository for contribution guidelines.
