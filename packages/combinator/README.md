# @certes/combinator

Type-safe, pure functional combinators for TypeScript. A comprehensive collection of classical combinatory logic primitives for composable, point-free programming.

## Installation
```bash
npm install @certes/combinator
```

## Quick Start
```typescript
import { compose, pipe, fork, flip } from '@certes/combinator';

// Compose functions right-to-left
const addThenDouble = compose((x: number) => x * 2)((x: number) => x + 3);
addThenDouble(5); // 16 ((5 + 3) * 2)

// Pipe functions left-to-right
const doubleThenAdd = pipe((x: number) => x * 2)((x: number) => x + 3);
doubleThenAdd(5); // 13 ((5 * 2) + 3)

// Fork: apply one value to two functions, combine results
const average = fork((sum: number) => (length: number) => sum / length)
  ((nums: number[]) => nums.reduce((a, b) => a + b, 0))
  ((nums: number[]) => nums.length);

average([1, 2, 3, 4, 5]); // 3
```

## Available Combinators

| Combinator | Name | Lambda | Signature | Description |
|------------|------|--------|-----------|-------------|
| **A** | Apply | $\lambda ab.ab$ | `(a → b) → a → b` | Apply function to argument |
| **B** | Bluebird | $\lambda abc.a(bc)$ | `(a → b) → (c → a) → c → b` | Function composition (right-to-left) |
| **BL** | Blackbird | $\lambda abcd.a(bcd)$ | `(c → d) → (a → b → c) → a → b → d` | Compose unary after binary |
| **C** | Cardinal | $\lambda abc.acb$ | `(a → b → c) → b → a → c` | Flip argument order |
| **I** | Idiot | $\lambda a.a$ | `a → a` | Identity function |
| **K** | Kestrel | $\lambda ab.a$ | `a → b → a` | Constant (returns first) |
| **KI** | Kite | $\lambda ab.b$ | `a → b → b` | Returns second argument |
| **OR** | — | $\lambda abc.(ac) \lor (bc)$ | `(a → b) → (a → b) → a → Bool` | Logical disjunction |
| **Phi** | Phoenix | $\lambda abcd.a(bd)(cd)$ | `(a → b → c) → (d → a) → (d → b) → d → c` | Fork combinator |
| **Psi** | — | $\lambda abcd.a(bc)(bd)$ | `(b → b → c) → (a → b) → a → a → c` | On combinator |
| **Q** | Queer bird | $\lambda abc.b(ac)$ | `(a → b) → (b → c) → a → c` | Pipe (left-to-right composition) |
| **S** | Starling | $\lambda abc.ac(bc)$ | `(a → b → c) → (a → b) → a → c` | Substitution |
| **Th** | Thrush | $\lambda ab.ba$ | `a → (a → b) → b` | Reverse application |
| **V** | Vireo | $\lambda abc.cab$ | `a → b → (a → b → c) → c` | Pairing |
| **W** | Warbler | $\lambda ab.abb$ | `(a → a → b) → a → b` | Duplication |

### Aliases
```typescript
// Common functional programming names
import {
  apply,           // A
  compose,         // B
  flip,            // C
  identity,        // I
  constant,        // K
  second,          // KI
  alternation,     // OR
  fork,            // Phi
  on,              // Psi
  pipe,            // Q
  substitution,    // S
  applyTo,         // Th
  pair,            // V
  duplication      // W
} from '@certes/combinator';
```

## Practical Examples

### Data Transformation Pipelines
```typescript
import { pipe } from '@certes/combinator';

// Transform data through multiple steps (left-to-right)
const processUser = pipe
  ((user: { name: string }) => user.name)
  ((name: string) => name.toUpperCase());

processUser({ name: 'alice' }); // 'ALICE'
```

### Partial Application with Flip
```typescript
import { flip } from '@certes/combinator';

const divide = (a: number) => (b: number) => a / b;
const divideBy10 = flip(divide)(10);

divideBy10(100); // 10 (100 / 10)
divideBy10(50);  // 5  (50 / 10)
```

### Duplicate and Apply
```typescript
import { duplication } from '@certes/combinator';

const multiply = (a: number) => (b: number) => a * b;
const square = duplication(multiply);

square(7);  // 49 (7 * 7)
square(12); // 144 (12 * 12)
```

### Fork Pattern
```typescript
import { fork } from '@certes/combinator';

// Calculate variance: E[X²] - E[X]²
const variance = fork
  ((sumSq: number) => (sum: number) => sumSq - sum * sum)
  ((nums: number[]) => nums.reduce((acc, x) => acc + x * x, 0) / nums.length)
  ((nums: number[]) => nums.reduce((acc, x) => acc + x, 0) / nums.length);

variance([1, 2, 3, 4, 5]); // 2
```

### On Combinator (Psi)
```typescript
import { on } from '@certes/combinator';

// Compare two strings by length
const compareByLength = on
  ((a: number) => (b: number) => a - b)
  ((s: string) => s.length);

compareByLength('hello')('world'); // 0 (same length)
compareByLength('hi')('world');    // -3 (2 - 5)
```

### Substitution Pattern
```typescript
import { substitution } from '@certes/combinator';

// Apply argument to function and transformed version
const addWithDouble = substitution
  ((a: number) => (b: number) => a + b)
  ((x: number) => x * 2);

addWithDouble(5); // 15 (5 + 10)
```

## Compose vs Pipe
```typescript
import { compose, pipe } from '@certes/combinator';

const double = (x: number) => x * 2;
const addThree = (x: number) => x + 3;

// Compose: right-to-left (mathematical notation)
compose(addThree)(double)(5); // 13 (addThree(double(5)))

// Pipe: left-to-right (data flow)
pipe(double)(addThree)(5); // 13 (double(5) then addThree)
```

## Theory

These combinators form the basis of **combinatory logic**, a notation for mathematical logic without variables. The **SKI combinator calculus** (using S, K, and I) is Turing complete, meaning any computable function can be expressed using only these three combinators.

**Key Properties:**

- **Pure functions** — No side effects, referentially transparent
- **Point-free style** — Function composition without explicit parameters
- **Algebraic laws** — Combinators satisfy formal algebraic properties

### Combinator Identities
```typescript
// Identity laws
I(x) ≡ x
K(x)(y) ≡ x
KI(x)(y) ≡ y

// Composition
B(f)(g)(x) ≡ f(g(x))
Q(f)(g)(x) ≡ g(f(x))

// Self-application
W(f)(x) ≡ f(x)(x)
V(x)(y)(f) ≡ f(x)(y)

// Distributive
S(f)(g)(x) ≡ f(x)(g(x))
Phi(f)(g)(h)(x) ≡ f(g(x))(h(x))
```

## Further Reading

- [To Mock a Mockingbird](https://en.wikipedia.org/wiki/To_Mock_a_Mockingbird) by Raymond Smullyan
- [Combinatory Logic](https://plato.stanford.edu/entries/logic-combinatory/) - Stanford Encyclopedia of Philosophy
- [SKI Combinator Calculus](https://en.wikipedia.org/wiki/SKI_combinator_calculus)
- [Lambda Calculus](https://en.wikipedia.org/wiki/Lambda_calculus)
- [Combinator Birds](https://www.angelfire.com/tx4/cus/combinator/birds.html)

## License

MIT

## Contributing

Part of the [@certes](https://github.com/certes/certes) monorepo. See main repository for contribution guidelines.
