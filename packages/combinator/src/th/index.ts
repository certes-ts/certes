/**
 * Takes an argument and an unary function and then applies the function to the argument.
 * Inverse of `apply`.
 *
 * @template A - The type of input value.
 * @template B - The return type of given function.
 * @param a - The value to pass to the function.
 * @param b - The function to apply to the value.
 *
 * @remarks
 * The $Th$ combinator (Thrush) reverses the normal order of function application.
 * Instead of applying $f$ to $x$ as $f(x)$, it takes $x$ first, then $f$, and
 * applies $f$ to $x$: $(Th \; x) \; f = f \; x$. This enables a "data-first"
 * or "pipeline" style of programming where the data flows through transformations
 * from left to right.
 *
 * AKA: `applyTo`
 *
 * Bird: `Thrush`
 *
 * Signature: `Th :: a → (a → b) → b`
 *
 * Lamda: `λab.ba`
 *
 * @example
 * applyTo(6)(x => x * 2);
 * // 12
 */
export const Th =
  <A>(a: A) =>
  <B>(b: (x: A) => B) =>
    b(a);
/**
 * @alias Th
 * @inheritdoc
 */
export const applyTo = Th;
