/**
 * Swap argument order
 *
 * @template A - The type of the first argument to the original function.
 * @template B - The type of the second argument to the original function.
 * @template C - The return type of the function.
 * @param f - The curried binary function whose arguments will be swapped.
 * @param b - The second argument (applied first after swapping).
 * @param a - The first argument (applied second after swapping).
 *
 * @remarks
 * The $C$ combinator reverses the order of arguments to a binary function.
 * Given a curried binary function $f :: a \to b \to c$, it produces a new
 * function where the arguments are swapped: $(C \; f) \; x \; y = f \; y \; x$.
 *
 * This is particularly useful for partial application when you have a function
 * but want to fix the second argument instead of the first.
 *
 * AKA: `flip`
 *
 * Bird: `Cardinal`
 *
 * Signature: `C :: (a → b → c) → b → a → c`
 *
 * Lambda: `λabc.acb`
 *
 * @example
 * const divide = (a: number) => (b: number) => a / b;
 * C(divide)(2)(10);
 * // 5 (flips to 10 / 2 instead of 2 / 10)
 */
export const C =
  <A, B, C>(f: (x: A) => (y: B) => C) =>
  (
    b: B, // Take second argument first
  ) =>
  (
    a: A, // Take first argument second
  ) =>
    f(a)(b);

/**
 * @alias C
 * @inheritdoc
 */
export const flip = C;
