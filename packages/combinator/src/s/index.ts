/**
 * Applies a binary function to an argument and the result of applying a unary function to that same argument.
 *
 * @template A - The type of the input argument.
 * @template B - The return type of the unary function.
 * @template C - The return type of the binary function.
 * @param f - The binary function.
 * @param g - The unary function.
 * @param x - The argument to pass to both functions.
 *
 * @remarks
 * The $S$ combinator (Starling) is one of the most fundamental combinators in combinatory logic.
 * Along with $K$, it forms a complete basis (S and K alone are Turing complete).
 * Given functions $f$ and $g$ and an argument $x$, it computes: $S \; f \; g \; x = f \; x \; (g \; x)$.
 *
 * This distributes an argument to two different functions and combines the results.
 *
 * AKA: `substitution`
 *
 * Bird: `Starling`
 *
 * Signature: `S :: (a → b → c) → (a → b) → a → c`
 *
 * Lambda: `λabc.ac(bc)`
 *
 * @example
 * const add = (a: number) => (b: number) => a + b;
 * const double = (x: number) => x * 2;
 * S(add)(double)(5);
 * // 15 (5 + double(5) = 5 + 10 = 15)
 */
export const S =
  <A, B, C>(f: (x: A) => (y: B) => C) =>
  (g: (x: A) => B) =>
  (x: A) =>
    f(x)(g(x));

/**
 * @alias S
 * @inheritdoc
 */
export const substitution = S;
