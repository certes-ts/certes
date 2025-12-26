# @certes/composition

Type-safe function composition utilities for TypeScript.

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
npm install @certes/composition
```

## Quick Start

### Synchronous Composition

```typescript
import { compose, pipe, curry } from '@certes/composition';

// Compose (right-to-left)
const transform = compose(
  (x: string) => x.toUpperCase(),
  (x: number) => x.toString(),
  (x: number) => x + 3
);
transform(4); // "7"

// Pipe (left-to-right)
const process = pipe(
  (x: number) => x + 3,
  (x: number) => x.toString(),
  (x: string) => x.toUpperCase()
);
process(4); // "7"

// Curry
const multiply = (a: number, b: number, c: number) => a * b * c;
const curried = curry(multiply);

curried(2)(3)(4);     // 24
curried(2, 3)(4);     // 24
curried(2)(3, 4);     // 24
```

### Asynchronous Composition

```typescript
import { composeAsync, pipeAsync } from '@certes/composition';

// Compose async functions (right-to-left)
const notifyUser = composeAsync(
  async (email: string) => sendEmail(email),
  (user: User) => user.email,
  async (id: number) => fetchUser(id)
);
await notifyUser(123);

// Pipe async functions (left-to-right)
const processUrl = pipeAsync(
  async (url: string) => fetch(url),
  async (response: Response) => response.json(),
  (data: Data) => transform(data),
  async (result: Result) => saveToDb(result)
);
await processUrl('https://api.example.com/data');

// Mix sync and async functions
const pipeline = pipeAsync(
  async (x: number) => fetchData(x),  // async
  (data: Data) => data.value,         // sync
  async (value: number) => save(value) // async
);
await pipeline(42);
```

## API Reference

### compose(...fns)

Composes functions from right to left.
```typescript
const fn = compose(f, g, h);
fn(x) === f(g(h(x)));
```

**Constraints:**
- Last function can accept n parameters
- All other functions must be unary
- Maximum depth: 1000 functions

### pipe(...fns)

Composes functions from left to right.
```typescript
const fn = pipe(f, g, h);
fn(x) === h(g(f(x)));
```

**Constraints:**
- First function can accept n parameters
- All other functions must be unary
- Maximum depth: 1000 functions

### composeAsync(...fns)

Composes async functions from right to left. Automatically handles Promises.

```typescript
const fn = composeAsync(f, g, h);
await fn(x) === await f(await g(await h(x)));
```

**Features:**
- Handles both sync and async functions seamlessly
- Always returns a Promise
- Awaits each function before calling the next
- Propagates errors through the chain

**Constraints:**
- Last function can accept n parameters
- All other functions must be unary
- Maximum depth: 1000 functions

### pipeAsync(...fns)

Composes async functions from left to right. Automatically handles Promises.

```typescript
const fn = pipeAsync(f, g, h);
await fn(x) === await h(await g(await f(x)));
```

**Features:**
- Handles both sync and async functions seamlessly
- Always returns a Promise
- Awaits each function before calling the next
- Propagates errors through the chain

**Constraints:**
- First function can accept n parameters
- All other functions must be unary
- Maximum depth: 1000 functions

### curry(fn)

Returns a curried version of the function.
```typescript
const add = (a: number, b: number, c: number) => a + b + c;
const curriedAdd = curry(add);

const add5 = curriedAdd(5);
add5(3, 2); // 10
```

**Note:** Uses `Function.prototype.length` for arity detection. Rest parameters and default parameters may not curry as expected.

## License

MIT

## Contributing

Part of the [@certes](https://github.com/certes-ts/certes) monorepo. See main repository for contribution guidelines.
