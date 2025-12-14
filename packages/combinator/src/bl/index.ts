/**
 * Composition of composition and composition. Pass two values to
 * a function and the result to another function
 *
 * @template C - The type of the binary function's return value, which becomes input to the unary function.
 * @template D - The return type of the unary function.
 * @template A - The type of the first argument to the binary function.
 * @template B - The type of the second argument to the binary function.
 * @param f - The unary function to apply to the result of the binary function.
 * @param g - The curried binary function.
 * @param a - The first argument to pass to the binary function.
 * @param b - The second argument to pass to the binary function.
 *
 * @remarks
 * The $BL$ combinator (Blackbird) composes a unary function with a binary function.
 * Given a binary function $g$ that takes two arguments and produces a result, and
 * a unary function $f$ that transforms that result, the Blackbird combinator applies
 * $f$ to the result of $g$: $BL \; f \; g \; a \; b = f \; (g \; a \; b)$.
 *
 * This is equivalent to composing after a two-argument function, allowing you to
 * transform the output of binary operations.
 *
 * AKA: `--`
 *
 * Bird: `Blackbird`
 *
 * Signature: `BL :: (c → d) → (a → b → c) → a → b → d`
 *
 * Lambda: `λabcd.a(bcd)`
 *
 * @example
 * const add = (a: number) => (b: number) => a + b;
 * const double = (x: number) => x * 2;
 * BL(double)(add)(3)(4);
 * // 14 (double(add(3)(4)) = double(7) = 14)
 */
export const BL =
  <C, D>(f: (z: C) => D) =>
  <A, B>(g: (x: A) => (y: B) => C) =>
  (a: A) =>
  (b: B) =>
    f(g(a)(b));

// Alternative supposedly:
// const BL = B(B)(B);
