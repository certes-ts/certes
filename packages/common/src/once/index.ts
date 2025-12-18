// TS' `Function` type only models the object side of it, not whether it is callable.
// biome-ignore lint/suspicious/noExplicitAny: This is intended
type SomeFunction = (...args: any[]) => any;

/**
 * Ensures that the given function is only called once, caching its result.
 * Subsequent calls return the cached result without re-executing the function.
 *
 * @template T - The type of the function to wrap. Must be a function type.
 *
 * @param fn - The function to call once.
 *
 * @returns A wrapped function with the same signature as the input. The wrapped function
 *          executes the original function on first call and caches the result. All subsequent
 *          calls return the cached result, regardless of arguments.
 *
 * @remarks
 * The original function's return value is preserved and cached. If the function returns
 * undefined, subsequent calls will also return undefined. Arguments passed to subsequent
 * calls are ignored.
 *
 * Type signature: `((α... -> β)) -> (α... -> β)`
 *
 * **Warning**: This creates a closure that persists the `done` flag and result. Do not
 * use with functions that must be garbage collected.
 *
 * @example
 * const expensiveCalculation = (n: number) => {
 *   console.log('Computing...');
 *   return n * n;
 * };
 *
 * const onceCalc = once(expensiveCalculation);
 *
 * onceCalc(5);  // Logs "Computing...", returns 25
 * onceCalc(10); // Returns 25 (cached), no log
 * onceCalc(15); // Returns 25 (cached), no log
 */
export const once = <T extends SomeFunction>(fn: T): T => {
  let done = false;
  let result: ReturnType<T>;

  return ((...args: Parameters<T>): ReturnType<T> => {
    if (!done) {
      result = fn(...args);
      done = true;
    }

    return result;
  }) as T;
};
