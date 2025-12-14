export type Curried<T extends unknown[], R> = <P extends Partial<T>>(
  ...args: P
  // biome-ignore lint/suspicious/noExplicitAny: This is intended
) => ((...args: T) => any) extends (...args: [...P, ...infer Args]) => any
  ? Args extends []
    ? R
    : Curried<Args, R>
  : never;

/**
 * Curries the given function. Allowing it to accept one or more arguments at a time.
 *
 * @template T - The function to be curried.
 *
 * @param fn - The function to convert to a curried version
 *
 * @returns A curried function that can accept parameters incrementally.
 *          Each partial application returns either:
 *          - Another curried function if more parameters needed
 *          - The final result R if all parameters satisfied
 *
 * @remarks
 * The curried function maintains referential transparency and can be called with:
 * - One argument at a time: autoCurry(f)(a)(b)(c)
 * - Multiple arguments: autoCurry(f)(a, b)(c)
 * - All arguments: autoCurry(f)(a, b, c)
 * - Any combination of the above
 *
 * Arity detection uses Function.prototype.length which counts only non-rest parameters.
 *
 * @example
 * const multiply = (a: number, b: number, c: number): number => a * b * c;
 * const curriedMultiply = autoCurry(multiply);
 *
 * // All equivalent:
 * curriedMultiply(2)(3)(4);     // 24
 * curriedMultiply(2, 3)(4);     // 24
 * curriedMultiply(2)(3, 4);     // 24
 * curriedMultiply(2, 3, 4);     // 24
 *
 * // Partial application for reuse
 * const add = (a: number, b: number, c: number) => a + b + c;
 * const curriedAdd = autoCurry(add);
 * const add10 = curriedAdd(10);
 *
 * add10(5, 3);  // 18
 * add10(2, 8);  // 20
 */
// biome-ignore lint/suspicious/noExplicitAny: This is intended
export function autoCurry<T extends (...args: any[]) => any>(
  fn: T,
  // biome-ignore lint/suspicious/noExplicitAny: This is intended
  _args = [] as any[],
): Curried<Parameters<T>, ReturnType<T>> {
  return (...__args) => {
    const argsLen = _args.length;
    const newArgsLen = __args.length;
    const totalLen = argsLen + newArgsLen;

    // Only spread when executing, not on partial application
    if (totalLen >= fn.length) {
      // Pre-allocate exact size
      const allArgs = new Array(totalLen);

      // Manual copy is faster than spread for small arrays
      for (let i = 0; i < argsLen; i++) {
        allArgs[i] = _args[i];
      }

      for (let i = 0; i < newArgsLen; i++) {
        allArgs[argsLen + i] = __args[i];
      }

      return fn(...allArgs);
    }

    // For partial application, concat is faster than spread for this use case
    return autoCurry(fn, _args.concat(__args));
  };
}

/**
 * @alias autoCurry
 *
 * Curries the given function. Allowing it to accept one or more arguments at a time.
 *
 * @template T - The function to be curried.
 *
 * @param fn - The function to convert to a curried version
 *
 * @returns A curried function that can accept parameters incrementally.
 *          Each partial application returns either:
 *          - Another curried function if more parameters needed
 *          - The final result R if all parameters satisfied
 *
 * @remarks
 * The curried function maintains referential transparency and can be called with:
 * - One argument at a time: curry(f)(a)(b)(c)
 * - Multiple arguments: curry(f)(a, b)(c)
 * - All arguments: curry(f)(a, b, c)
 * - Any combination of the above
 *
 * Arity detection uses Function.prototype.length which counts only non-rest parameters.
 *
 * @example
 * const multiply = (a: number, b: number, c: number): number => a * b * c;
 * const curriedMultiply = curry(multiply);
 *
 * // All equivalent:
 * curriedMultiply(2)(3)(4);     // 24
 * curriedMultiply(2, 3)(4);     // 24
 * curriedMultiply(2)(3, 4);     // 24
 * curriedMultiply(2, 3, 4);     // 24
 *
 * // Partial application for reuse
 * const add = (a: number, b: number, c: number) => a + b + c;
 * const curriedAdd = curry(add);
 * const add10 = curriedAdd(10);
 *
 * add10(5, 3);  // 18
 * add10(2, 8);  // 20
 */
export const curry = autoCurry;
