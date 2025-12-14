# @certes/common

Common utility functions for functional programming patterns in TypeScript.

## Installation
```bash
npm install @certes/common
```

## API Reference

### `lookup`

Creates a curried lookup function with optional default handling for missing keys.

**Type Signature**
```typescript
function lookup(
  obj: A,
  def: B
): (prop: string | number | symbol) => ReturnType;

function lookup(
  obj: A
): (prop: string | number | symbol) => A[keyof A] | undefined;
```

**Parameters**
- `obj` - The lookup table record
- `def` - Optional function to handle missing or undefined values

**Returns**

A function that accepts a property key and returns the value or default.

**Example**
```typescript
import { lookup } from '@certes/common';

const statusCodes = {
  200: 'OK',
  404: 'Not Found',
  500: 'Internal Server Error',
};

const getStatus = lookup(statusCodes, () => 'Unknown');

getStatus(200); // 'OK'
getStatus(999); // 'Unknown'
```

---

### `noop`

A no-operation function that accepts any argument and returns undefined.

**Type Signature**
```typescript
const noop: (x?: unknown) => void;
```

**Example**
```typescript
import { noop } from '@certes/common';

const handler = isDevelopment ? console.log : noop;
handler('Debug message'); // Only logs in development
```

---

### `once`

Ensures a function is only called once, caching and returning the result for all subsequent calls.

**Type Signature**
```typescript
function once<T extends (...args: any[]) => any>(fn: T): T;
```

**Parameters**
- `fn` - The function to call once

**Returns**

A wrapped function that executes once and caches the result.

**Example**
```typescript
import { once } from '@certes/common';

const initializeDatabase = once(async () => {
  console.log('Connecting to database...');
  return await connectDB();
});

await initializeDatabase(); // Logs and connects
await initializeDatabase(); // Returns cached connection
await initializeDatabase(); // Returns cached connection
```

---

### `range`

Creates a reusable iterable that yields integers from start to end (inclusive).

**Type Signature**
```typescript
function range(start: number, end: number): Iterable;
```

**Parameters**
- `start` - The start of the range (inclusive)
- `end` - The end of the range (inclusive)

**Returns**

An iterable that can be used multiple times.

**Example**
```typescript
import { range } from '@certes/common';

// Basic iteration
for (const i of range(0, 3)) {
  console.log(i);
}
// 0, 1, 2, 3

// Reusable
const indices = range(1, 5);
const squares = [...indices].map(x => x * x);
const cubes = [...indices].map(x => x * x * x);

// Negative ranges
[...range(-2, 2)]; // [-2, -1, 0, 1, 2]

// Backwards range (empty)
[...range(5, 1)]; // []
```

---

### `tap`

Executes a function for its side effects and returns the input value unchanged. Useful for debugging and logging in functional pipelines.

**Type Signature**
```typescript
function tap(fn: (v: T) => R): (val: T) => T;
```

**Parameters**
- `fn` - The function to call for side effects

**Returns**

A function that passes through its input value.

**Example**
```typescript
import { tap } from '@certes/common';
import { pipe } from '@certes/combinator';

const processData = pipe(
  (x: string) => x.trim(),
  tap(x => console.log('After trim:', x)),
  (x: string) => x.toLowerCase(),
  tap(x => console.log('After lowercase:', x)),
  (x: string) => x.split(' ')
);

processData('  HELLO WORLD  ');
// Logs:
// After trim: HELLO WORLD
// After lowercase: hello world
// Returns: ['hello', 'world']
```

## License

MIT

## Contributing

Part of the [@certes](https://github.com/certes-ts/certes) monorepo. See main repository for contribution guidelines.
