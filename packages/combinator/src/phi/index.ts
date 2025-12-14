/**
 * Pass a value through two different functions and the results to a function that takes two arguments.
 *
 * @template A - The type of the first input to the binary function. Corresponds to the return type of the first function.
 * @template B - The type of the second input to the binary function. Corresponds to the return type of the second function.
 * @template C - The return type of the binary function.
 * @template D - The type of the input value.
 * @param a - The final curried, binary function that receives the results from `b` and `c`.
 * @param b - The first function to pass the value to.
 * @param c - The second function to pass the value to.
 * @param d - The value to pass to `b` and `c`.
 *
 * @remarks
 * The Big Phi combinator applies a single argument to two different
 * functions and passes their results to a binary function. Given functions
 * $b$ and $c$ that transform input $d$, and a binary function $a$, it
 * computes $a(b(d), c(d))$.
 *
 * AKA: `Fork`
 *
 * Bird: `Phoenix`
 *
 * Signature: `Phi :: (a → b → c) → (d → a) → (d → b) → d → c`
 *
 * Lambda: `λabcd.a(bd)(cd)`
 *
 * @example
 * fork((x) => (y) => x + y)(x => x + 3)(x => x - 2)(9)
 * // 19
 */
export const Phi =
  <A, B, C>(a: (x: A) => (y: B) => C) =>
  <D>(b: (x: D) => A) =>
  (c: (x: D) => B) =>
  (d: D) =>
    a(b(d))(c(d));

/**
 * @alias Phi
 * @inheritdoc
 */
export const fork = Phi;
