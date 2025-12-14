/**
 * Corresponds to the encoding of `true` in the lambda calculus.
 * Takes two arguments and always returns the first.
 *
 * @template A - The type of the first input value.
 * @template B - The type of the second input value.
 * @param a - The value to return.
 * @param b - The value to ignore.
 *
 * @remarks
 * The $K$ combinator is a function that takes two arguments, $x$ and $y$,
 * and simply returns the first argument $(x)$ while ignoring the second argument $(y)$.
 *
 * AKA: `constant`
 *
 * Bird: `Kestrel`
 *
 * Signature: `K :: a → b → a`
 *
 * Lambda: `λab.a`
 *
 * @example
 * K(42)(100);
 * // 42 (always returns first argument)
 */
export const K =
  <A>(a: A) =>
  <B>(_b: B): A =>
    a;

/**
 * @alias K
 * @inheritdoc
 */
export const constant = K;
