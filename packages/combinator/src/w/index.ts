/**
 * Applies a binary function to the same argument twice.
 *
 * @template A - The type of the input argument.
 * @template B - The return type of the binary function.
 * @param f - The binary function to apply.
 * @param x - The argument to duplicate and pass to the function.
 *
 * @remarks
 * The $W$ combinator (Warbler) duplicates a single argument and passes it to both
 * parameters of a binary function: $W \; f \; x = f \; x \; x$. This is useful when
 * you need to apply a binary operation to the same value (e.g., squaring a number
 * via multiplication, checking equality).
 *
 * AKA: `duplication`
 *
 * Bird: `Warbler`
 *
 * Signature: `W :: (a → a → b) → a → b`
 *
 * Lambda: `λab.abb`
 *
 * @example
 * const multiply = (a: number) => (b: number) => a * b;
 * W(multiply)(7);
 * // 49 (7 * 7)

 * const equals = (a: number) => (b: number) => a === b;
 * W(equals)(5);
 * // true (5 === 5)
 */
export const W =
  <A, B>(f: (x: A) => (y: A) => B) =>
  (x: A) =>
    f(x)(x);

/**
 * @alias W
 * @inheritdoc
 */
export const duplication = W;
