/**
 * Pass two values through the same function and pass the results to another function of 2-arity
 *
 * @template B - The return type of the transformation function, which becomes input to the combiner.
 * @template C - The return type of the binary combining function.
 * @template A - The type of the input arguments.
 * @param f - The binary function that combines the transformed results.
 * @param g - The unary transformation function applied to both arguments.
 * @param x - The first argument to transform and combine.
 * @param y - The second argument to transform and combine.
 *
 * @remarks
 * The $\Psi$ combinator (Psi) applies the same unary function to two different
 * arguments and then combines the results using a binary function. Given a binary
 * function $f$, a unary function $g$, and two arguments $x$ and $y$, it computes
 * $f(g(x), g(y))$. This is equivalent to Haskell's \texttt{on} combinator, often
 * used for comparing or combining values after transformation.
 *
 * AKA: `on`
 *
 * Bird: `--` (not in standard aviary)
 *
 * Signature: `Psi :: (b → b → c) → (a → b) → a → a → c`
 *
 * Lambda: `λabcd.a(bc)(bd)`
 *
 * @example
 * const add = (a: number) => (b: number) => a + b;
 * const square = (x: number) => x * x;
 * Psi(add)(square)(3)(4);
 * // 25 (3² + 4² = 9 + 16 = 25)
 */
export const Psi =
  <B, C>(f: (x: B) => (y: B) => C) =>
  <A>(g: (x: A) => B) =>
  (x: A) =>
  (y: A) =>
    f(g(x))(g(y));

/**
 * @alias Psi
 * @inheritdoc
 */
export const on = Psi;
