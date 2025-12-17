/**
 * Groups array elements into fixed-size chunks.
 *
 * @template T - Element type
 *
 * @param size - Size of each chunk (must be positive)
 *
 * @returns Curried function that takes an array and returns array of chunks
 *
 * @remarks
 * Last chunk may be smaller than size if array length not evenly divisible.
 * Throws error if size is not a positive integer.
 *
 * Time complexity: O(n)
 * Space complexity: O(n)
 *
 * @example
 * ```typescript
 * chunk(3)([1, 2, 3, 4, 5, 6, 7]);
 * // [[1, 2, 3], [4, 5, 6], [7]]
 *
 * chunk(2)(['a', 'b', 'c', 'd']);
 * // [['a', 'b'], ['c', 'd']]
 *
 * chunk(5)([1, 2]);
 * // [[1, 2]]
 * ```
 */
export const chunk =
  (size: number) =>
  <T>(arr: T[]): T[][] => {
    if (!Number.isSafeInteger(size) || size <= 0) {
      throw new TypeError(
        'chunk() requires size to be a positive safe integer',
      );
    }

    const len = arr.length;
    const result: T[][] = [];
    let resultIdx = 0;

    for (let i = 0; i < len; i += size) {
      const chunkEnd = Math.min(i + size, len);
      const chunkSize = chunkEnd - i;
      const chunk: T[] = new Array(chunkSize);

      for (let j = 0; j < chunkSize; j++) {
        chunk[j] = arr[i + j] as T;
      }

      result[resultIdx++] = chunk;
    }

    return result;
  };
