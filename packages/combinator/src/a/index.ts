/**
 * Takes an unary function and applies it to the given argument.
 *
 * @template T - The type of input value.
 * @template R - The return type of given function.
 * @param f - The function to apply to the value.
 * @param x - The value to pass to the function.
 *
 * @remarks
 * The $A$ combinator, often referred to as the "application" or "apply" combinator,
 * takes two functions, $f$ and $x$, and applies function $f$ to the argument $x$.
 * It effectively represents function application.
 *
 * AKA: `apply`
 *
 * Bird: `--`
 *
 * Signature: `A :: (a → b) → a → b`
 *
 * Lambda: `λab.ab`
 *
 * @example
 * A((a) => a + 6)(3);
 * >> 9
 */
export const A =
  <T, R>(f: (x: T) => R) =>
  (x: T) =>
    f(x);

/**
 * @alias A
 * @inheritdoc
 */
export const apply = A;
