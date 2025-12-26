# @certes/logic

Type-safe, curried Boolean logic operations for TypeScript. A comprehensive collection of logical operators and combinators for composable, point-free programming.

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
npm install @certes/logic
```

## Features

- **Pure Functions:** All operations are side-effect free and referentially transparent
- **Curried API:** Optimized for partial application and composition
- **Type-Safe:** Full TypeScript inference with strict typing
- **Dual Variants:** Value-level and function-level operations for every combinator
- **Performance-First:** Inlined implementations optimized for V8
- **Zero Dependencies:** Minimal footprint

## Quick Start

```typescript
import { and, or, not, xor } from '@certes/logic';

// Basic Boolean operations
and(true)(false);  // false
or(true)(false);   // true
not(true);         // false
xor(true)(false);  // true

// Type coercion follows JavaScript semantics
and(1)(0);         // false
or(0)('hello');    // true
```

## API Reference

### Core Boolean Operations

| Operation | Symbol | Function | Fn Variant | Description |
|-----------|--------|----------|------------|-------------|
| AND | `a && b` | `and` | `andFn` | Conjunction: true when both operands are truthy |
| OR | `a \|\| b` | `or` | `orFn` | Disjunction: true when at least one operand is truthy |
| NOT | `!a` | `not` | `notFn` | Negation: inverts truthiness |
| NAND | `!(a && b)` | `nand` | `nandFn` | Non-conjunction: false only when both are truthy |
| NOR | `!(a \|\| b)` | `nor` | `norFn` | Non-disjunction: true only when both are falsy |
| XOR | `a ^ b` | `xor` | `xorFn` | Exclusive OR: true when exactly one operand is truthy |
| XNOR | `a === b` | `equality` | `equalityFn` | Equality: true when operands are strictly equal |

### Nullish Coalescing

| Operation | Function | Fn Variant | Description |
|-----------|----------|------------|-------------|
| `a ?? b` | `nullishOr` | `nullishOrFn` | Returns first operand unless null/undefined |
| `b ?? a` | `swappedNullishOr` | `swappedNullishOrFn` | Nullish coalescing with reversed arguments |

### Value-Level Operations

Boolean operations on values with automatic type coercion.

```typescript
import { and, or, not, nand, nor, xor, equality } from '@certes/logic';

// Logical AND
and(true)(true);   // true
and(true)(false);  // false
and(1)(0);         // false (type coercion)

// Logical OR
or(false)(true);   // true
or(0)(0);          // false

// Logical NOT
not(true);         // false
not(0);            // true

// NAND (universal gate)
nand(true)(true);  // false
nand(true)(false); // true

// NOR (universal gate)
nor(false)(false); // true
nor(true)(false);  // false

// XOR (exclusive or)
xor(true)(false);  // true
xor(true)(true);   // false

// Strict equality
equality(4)(4);    // true
equality(4)('4');  // false
```

### Function-Level Operations

Boolean operations on predicate functions, enabling predicate composition.

```typescript
import { andFn, orFn, notFn, xorFn, equalityFn } from '@certes/logic';

const isEven = (x: number) => x % 2 === 0;
const isPositive = (x: number) => x > 0;
const isLarge = (x: number) => x > 100;

// Combine predicates with AND
const isPositiveEven = andFn(isPositive)(isEven);
isPositiveEven(4);   // true
isPositiveEven(-4);  // false

// Combine predicates with OR
const isEvenOrLarge = orFn(isEven)(isLarge);
isEvenOrLarge(3);    // false
isEvenOrLarge(101);  // true

// Negate a predicate
const isOdd = notFn(isEven);
isOdd(3);  // true
isOdd(4);  // false

// Exclusive or between predicates
const hasExactlyOneProperty = xorFn(isEven)(isLarge);
hasExactlyOneProperty(4);    // true (even but not large)
hasExactlyOneProperty(101);  // true (large but not even)
hasExactlyOneProperty(102);  // false (both)

// Compare function results
const sameModulo = equalityFn((x: number) => x % 3)((x: number) => x % 2);
sameModulo(6);  // true (both return 0)
```

### Nullish Coalescing

Coalescing that only treats `null` and `undefined` as nullish, preserving falsy values like `0`, `false`, and `''`.

```typescript
import { nullishOr, swappedNullishOr } from '@certes/logic';

// Standard nullish coalescing
nullishOr(null)(42);        // 42
nullishOr(0)(100);          // 0 (preserves falsy)
nullishOr(false)(true);     // false (preserves falsy)
nullishOr('')('fallback');  // '' (preserves falsy)

// Swapped argument order (useful for partial application)
const withDefault = swappedNullishOr(42);
withDefault(null);  // 42
withDefault(7);     // 7

// Map with defaults
const values: (number | null)[] = [1, null, 3, null, 5];
values.map(swappedNullishOr(0));
// [1, 0, 3, 0, 5]
```

### Swapped Variants

Some operations provide swapped argument variants for ergonomic partial application.

```typescript
import { or, swappedOr, nullishOr, swappedNullishOr } from '@certes/logic';

// For logical operations (returns boolean)
// Standard OR: check if primary OR fallback is truthy
or(userFlag)(defaultFlag);  // returns boolean

// Swapped OR: default condition first (useful for creating predicates)
const isActiveOrDefault = swappedOr(false);
isActiveOrDefault(featureFlag);  // returns boolean: true if featureFlag is truthy

// For value selection (returns actual value)
// Standard nullish coalescing: primary value first
nullishOr(configValue)(defaultValue);  // returns actual value

// Swapped nullish coalescing: default first (useful for creating selectors)
const withFallback = swappedNullishOr('defaultValue');
withFallback(possiblyNullValue);  // returns actual value: possiblyNullValue or 'defaultValue'
```

## Composition

All functions are curried and designed for composition with `@certes/composition`:

```typescript
import { pipe } from '@certes/composition';
import { filter } from '@certes/list';
import { andFn, orFn, notFn } from '@certes/logic';

// Build complex predicates
const isEven = (x: number) => x % 2 === 0;
const isPositive = (x: number) => x > 0;
const isSmall = (x: number) => x < 10;

const isPositiveEven = andFn(isPositive)(isEven);
const isEvenOrSmall = orFn(isEven)(isSmall);
const isOdd = notFn(isEven);

// Use in array operations
const numbers = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

filter(isPositiveEven)(numbers);
// [2, 4, 6, 8, 10, 12]

filter(isEvenOrSmall)(numbers);
// [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12]

// Compose predicates in pipelines
const processData = pipe(
  filter(isPositive),
  filter(isEven),
  (arr: number[]) => arr.slice(0, 3)
);

processData(numbers);
// [2, 4, 6]
```

## Truth Tables

### AND / NAND
| A | B | AND | NAND |
|---|---|-----|------|
| T | T | T   | F    |
| T | F | F   | T    |
| F | T | F   | T    |
| F | F | F   | T    |

### OR / NOR
| A | B | OR | NOR |
|---|---|----|-----|
| T | T | T  | F   |
| T | F | T  | F   |
| F | T | T  | F   |
| F | F | F  | T   |

### XOR / XNOR (Equality)
| A | B | XOR | XNOR |
|---|---|-----|------|
| T | T | F   | T    |
| T | F | T   | F    |
| F | T | T   | F    |
| F | F | F   | T    |

## Practical Examples

### Validation Logic

```typescript
import { andFn, orFn, notFn } from '@certes/logic';

type User = { age: number; verified: boolean; banned: boolean };

const isAdult = (user: User) => user.age >= 18;
const isVerified = (user: User) => user.verified;
const isBanned = (user: User) => user.banned;

const canPost = andFn(
  andFn(isAdult)(isVerified)
)(notFn(isBanned));

const user = { age: 25, verified: true, banned: false };
canPost(user); // true
```

### Toggle Detection

```typescript
import { xor } from '@certes/logic';

const hasStateChanged = (prev: boolean, curr: boolean) => xor(prev)(curr);

hasStateChanged(true, false);  // true
hasStateChanged(true, true);   // false
```

### Default Value Handling

```typescript
import { nullishOr, or } from '@certes/logic';

type Config = { timeout?: number; retries?: number };

// nullishOr preserves 0, false, ''
const getTimeout = (config: Config) => nullishOr(config.timeout)(5000);
getTimeout({ timeout: 0 });     // 0 (not 5000)
getTimeout({ timeout: null });  // 5000

// or treats all falsy values as false
const getRetries = (config: Config) => or(config.retries)(3);
getRetries({ retries: 0 });  // 3 (0 is falsy)
```

## Theory

Boolean logic operations form the foundation of digital logic and computation. The operations in this library follow classical Boolean algebra with JavaScript's type coercion semantics.

**Universal Gates:**
- NAND and NOR are functionally complete. Any Boolean function can be constructed using only NAND or only NOR gates
- This library implements both as standalone operations

**Type Coercion:**
- All operations apply JavaScript's standard truthiness coercion via `Boolean(x)`
- Falsy values: `false`, `0`, `''`, `null`, `undefined`, `NaN`
- Truthy values: everything else

**Nullish vs. Falsy:**
- `nullishOr` only treats `null` and `undefined` as absent values
- `or` treats all falsy values (`0`, `false`, `''`, etc.) as false
- Choose based on whether you need to preserve falsy values

## License

MIT

## Contributing

Part of the [@certes](https://github.com/certes-ts/certes) monorepo. See main repository for contribution guidelines.
