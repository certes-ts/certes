/**
 * Calls the given function with the passed value and returns the value unchanged.
 *
 * This enables side effects in a functional pipeline without breaking the data flow.
 *
 * @template T - The type of the input value.
 * @template R - The return type of the side effect function (typically ignored).
 *
 * @param fn - The function to call for its side effect.
 *
 * @returns A function that accepts a value, passes it to fn, and returns it unchanged.
 *
 * @remarks
 * Pure in the sense that it doesn't modify the value, but the tapped function fn
 * may have side effects (logging, mutation of external state, etc.).
 *
 * Type signature: `(α -> β) -> α -> α`
 *
 * @example
 * // Debugging a single value
 * const processData = (data: string) =>
 *   pipe(
 *     trim,
 *     tap(s => console.log('After trim:', s)),
 *     toLowerCase,
 *     tap(s => console.log('After lower:', s)),
 *     capitalize
 *   )(data);
 */
export const tap =
  <T, R>(fn: (v: T) => R) =>
  (val: T) => {
    fn(val);

    return val;
  };
