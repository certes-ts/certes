/**
 * Left-to-right function composition (pipe).
 *
 * @template A - The type of the input argument.
 * @template B - The intermediate type.
 * @template C - The return type.
 * @param f - The first function to apply.
 * @param g - The second function to apply.
 * @param x - The argument.
 *
 * @remarks
 * The $Q$ combinator implements left-to-right function composition, commonly
 * known as `pipe`. Unlike the $B$ combinator (compose) which applies functions
 * right-to-left as $f \circ g$, the Q combinator applies them in reading order:
 * $Q \; f \; g \; x = g \; (f \; x)$. This matches the natural flow of data
 * transformations from left to right.
 *
 * AKA: `pipe`
 *
 * Bird: `Queer bird`
 *
 * Signature: `Q :: (a → b) → (b → c) → a → c`
 *
 * Lambda: `λabc.b(ac)`
 *
 * @example
 * const double = (x: number) => x * 2;
 * const addThree = (x: number) => x + 3;
 * pipe(double)(addThree)(5);
 * // 13 (5 → double → 10 → addThree → 13)
 */
export const Q =
  <A, B>(f: (x: A) => B) =>
  <C>(g: (y: B) => C) =>
  (x: A) =>
    g(f(x));

/**
 * @alias Q
 * @inheritdoc
 */
export const pipe = Q;
