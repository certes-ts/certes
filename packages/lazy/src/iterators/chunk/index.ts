/**
 * Lazily groups consecutive elements into fixed-size arrays.
 *
 * @template T - The element type
 *
 * @param size - Number of elements per chunk
 * @param iter - Source iterable
 *
 * @returns A new iterable yielding arrays of length `size` (final chunk may be smaller)
 *
 * @example
 * collect(chunk(2)([1, 2, 3, 4, 5])); // [[1, 2], [3, 4], [5]]
 */
export const chunk = (
  size: number,
): (<T>(iter: Iterable<T>) => Iterable<T[]>) => {
  if (!Number.isSafeInteger(size) || size <= 0) {
    throw new TypeError('chunk() requires size to be a positive safe integer');
  }

  return <T>(iter: Iterable<T>): Iterable<T[]> => ({
    *[Symbol.iterator]() {
      let batch: T[] = [];

      for (const item of iter) {
        batch.push(item);

        if (batch.length === size) {
          yield batch;
          batch = [];
        }
      }

      if (batch.length > 0) {
        yield batch;
      }
    },
  });
};
