/**
 * Pass a value to a function and the result to another function
 *
 * @template A - The type of the first function's input value. Corresponds to the return type of the second function.
 * @template B - The return type of first function.
 * @template C - The type of the input value.
 * @param f - The second function in the composition.
 * @param g - The first function in the composition.
 * @param x - The value to pass to `g`.
 *
 * @remarks
 * The $B$ combinator is used to combine and apply two functions to an argument.
 * Given two functions, $f$ and $g$, and an argument $x$, you can use the $B$ combinator as $B f g x$.
 * It essentially represents function composition, where $g$ is applied to $x$ first, and then the
 * result is passed to $f$.
 *
 * AKA: `compose`
 *
 * Bird: `Bluebird`
 *
 * Signature: `B :: (a → b) → (c → a) → c → b`
 *
 * Lambda: `λabc.a(bc)`
 *
 * @example
 * B((x) => x + 8)((x) => x * 3)(4);
 * >> 20
 */
export const B =
  <A, B>(f: (z: A) => B) =>
  <C>(g: (y: C) => A) =>
  (x: C) =>
    f(g(x));

/**
 * @alias B
 * @inheritdoc
 */
export const compose = B;
