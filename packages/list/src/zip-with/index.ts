/**
 * Combines corresponding elements from two arrays using a function.
 *
 * @template T - Type of first array elements
 * @template U - Type of second array elements
 * @template R - Type of result elements
 *
 * @param other - Second array to combine with
 *
 * @returns Curried function that takes combining function, then first array
 *
 * @remarks
 * Stops at the length of the shorter array.
 * Applies the combining function to each pair of corresponding elements.
 *
 * Time complexity: O(min(n, m))
 * Space complexity: O(min(n, m))
 *
 * @example
 * ```typescript
 * const add = (a: number, b: number) => a + b;
 * zipWith([10, 20, 30])(add)([1, 2, 3]);
 * // [11, 22, 33]
 *
 * const concat = (a: string, b: string) => `${a}-${b}`;
 * zipWith(['x', 'y'])(concat)(['a', 'b', 'c']);
 * // ['a-x', 'b-y']
 * ```
 */
export const zipWith =
  <U>(other: U[]) =>
  <T, R>(fn: (a: T, b: U) => R) =>
  (arr: T[]): R[] => {
    const len = Math.min(arr.length, other.length);
    const result: R[] = new Array(len);

    for (let i = 0; i < len; i++) {
      result[i] = fn(arr[i] as T, other[i] as U);
    }

    return result;
  };
