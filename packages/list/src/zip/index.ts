/**
 * Pairs corresponding elements from two arrays into tuples.
 *
 * @template U - Type of second array elements
 *
 * @param other - Second array to zip with
 *
 * @returns Curried function that takes first array and returns array of tuples
 *
 * @remarks
 * Stops at the length of the shorter array.
 * Preserves order of elements.
 *
 * Time complexity: O(min(n, m))
 * Space complexity: O(min(n, m))
 *
 * @example
 * ```typescript
 * const names = ['Alice', 'Bob', 'Charlie'];
 * const scores = [95, 87, 92];
 * zip(scores)(names);
 * // [['Alice', 95], ['Bob', 87], ['Charlie', 92]]
 *
 * zip([1, 2])(['a', 'b', 'c']);
 * // [['a', 1], ['b', 2]]
 * ```
 */
export const zip =
  <U>(other: U[]) =>
  <T>(arr: T[]): [T, U][] => {
    const len = Math.min(arr.length, other.length);
    const result: [T, U][] = new Array(len);

    for (let i = 0; i < len; i++) {
      result[i] = [arr[i] as T, other[i] as U];
    }

    return result;
  };
