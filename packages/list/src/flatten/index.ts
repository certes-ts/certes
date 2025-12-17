/**
 * Flattens a nested array by one level.
 *
 * @template T - Element type of inner arrays
 *
 * @param arr - Array of arrays to flatten
 *
 * @returns Single flattened array
 *
 * @remarks
 * Only flattens one level deep. For deeper nesting, compose multiple flatten calls.
 *
 * Time complexity: O(n * m) where n is outer length and m is average inner length
 * Space complexity: O(n * m) for the output array
 *
 * @example
 * ```typescript
 * flatten([[1, 2], [3, 4], [5]]);
 * // [1, 2, 3, 4, 5]
 *
 * flatten([['a'], ['b', 'c']]);
 * // ['a', 'b', 'c']
 *
 * flatten([[[1]], [[2]]]);
 * // [[1], [2]] - only one level
 * ```
 */
export const flatten = <T>(arr: T[][]): T[] => {
  const len = arr.length;
  const result: T[] = [];
  let resultIdx = 0;

  for (let i = 0; i < len; i++) {
    const inner = arr[i] as T[];
    const innerLen = inner.length;

    for (let j = 0; j < innerLen; j++) {
      result[resultIdx++] = inner[j] as T;
    }
  }

  return result;
};
