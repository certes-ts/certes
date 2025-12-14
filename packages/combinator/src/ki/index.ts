/**
 * Corresponds to the encoding of `false` in the lambda calculus.
 * Inverse of constant (K)
 *
 * @template A - The type of the first input value.
 * @template B - The type of the second input value.
 * @param a - The value to ignore.
 * @param b - The value to return.
 *
 * @remarks
 * The $Ki$ combinator, like the $K$ combinator, is a function that takes two arguments,
 * $x$ and $y$. However, in contrast to the $K$ combinator, which always returns the
 * first argument $(x)$ and ignores the second argument, the $Ki$ combinator always
 * returns the second argument $(y)$ and ignores the first argument $(x)$.
 *
 * AKA: `second`
 *
 * Bird: `Kite`
 *
 * Signature: `Ki :: a → b → b`
 *
 * Lambda: `λab.b`
 *
 * @example
 * KI(42)(100);
 * // 100 (always returns second argument)
 */
export const KI =
  <A>(_a: A) =>
  <B>(b: B): B =>
    b;

/**
 * @alias KI
 * @inheritdoc
 */
export const second = KI;
