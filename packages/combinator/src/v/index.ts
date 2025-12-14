/**
 * Pairs two values and applies them to a binary function.
 *
 * @template A - The type of the first value.
 * @template B - The type of the second value.
 * @template C - The return type of the binary function.
 * @param a - The first value to pair.
 * @param b - The second value to pair.
 * @param f - The binary function to apply to the paired values.
 *
 * @remarks
 * The $V$ combinator (Vireo) creates a pair from two values and passes them to
 * a binary function. It takes two arguments $a$ and $b$, then accepts a function
 * $f$, and applies $f$ to both arguments: $(V \; a \; b) \; f = f \; a \; b$.
 * This is sometimes called the "pairing combinator" because it packages two
 * values together for later consumption by a binary function.
 *
 * AKA: `pair`
 *
 * Bird: `Vireo`
 *
 * Signature: `V :: a → b → (a → b → c) → c`
 *
 * Lambda: `λabc.cab`
 *
 * @example
 * const multiply = (a: number) => (b: number) => a * b;
 * V(6)(7)(multiply);
 * // 42 (6 * 7 = 42)
 */
export const V =
  <A>(a: A) =>
  <B>(b: B) =>
  <C>(f: (x: A) => (y: B) => C) =>
    f(a)(b);

/**
 * @alias V
 * @inheritdoc
 */
export const pair = V;
