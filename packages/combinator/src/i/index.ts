/**
 * Mathematic identity function. A function that always returns the value
 * that was used as its argument, unchanged.
 *
 * @template A - The type of the input value.
 * @param x - The value to return.
 *
 * @remarks
 * The $I$ combinator is a function that takes an argument $x$ and simply returns $x$ itself.
 * It's called the "identity combinator" because it leaves the argument unaltered
 *
 * AKA: `identity`
 *
 * Bird: `Idiot`
 *
 * Signature: `I :: a → a`
 *
 * Lambda: `λa.a`
 *
 * @example
 * I(4);
 * >> 4
 */
export const I = <A>(x: A) => x;

/**
 * @alias I
 * @inheritdoc
 */
export const identity = I;
