/**
 * Maps each element to an array and flattens the result.
 *
 * @template T - Input element type
 * @template R - Output element type
 *
 * @param fn - Function that maps each element to an array
 *
 * @returns Curried function that takes an array and returns flattened result
 *
 * @remarks
 * Applies the mapping function to each element and concatenates all resulting
 * arrays into a single flat array. Equivalent to map followed by flatten.
 *
 * Time complexity: O(n * m) where n is array length and m is average result length
 * Space complexity: O(n * m) for the output array
 *
 * @example
 * ```typescript
 * const duplicate = (x: number) => [x, x];
 * flatMap(duplicate)([1, 2, 3]);
 * // [1, 1, 2, 2, 3, 3]
 *
 * const explode = (s: string) => s.split('');
 * flatMap(explode)(['hi', 'yo']);
 * // ['h', 'i', 'y', 'o']
 * ```
 */
export const flatMap =
  <T, R>(fn: (x: T, idx?: number) => R[]) =>
  (arr: T[]): R[] => {
    const len = arr.length;
    const result: R[] = [];
    let resultIdx = 0;

    for (let i = 0; i < len; i++) {
      const mapped = fn(arr[i] as T, i);
      const mappedLen = mapped.length;

      for (let j = 0; j < mappedLen; j++) {
        result[resultIdx++] = mapped[j] as R;
      }
    }

    return result;
  };
