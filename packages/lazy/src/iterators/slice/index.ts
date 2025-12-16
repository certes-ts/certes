/**
 * Lazily yields elements from index `start` up to (but not including) `end`.
 *
 * @template T - The element type
 *
 * @param start - Starting index (inclusive)
 * @param end - Ending index (exclusive); if omitted, yields to the end
 * @param iter - Source iterable
 *
 * @returns A new iterable yielding the specified slice
 *
 * @example
 * collect(slice(1, 4)([0, 1, 2, 3, 4, 5])); // [1, 2, 3]
 */
export const slice = (
  start: number,
  end?: number,
): (<T>(iter: Iterable<T>) => Iterable<T>) => {
  if (!Number.isSafeInteger(start) || start < 0) {
    throw new TypeError(
      'slice() requires start to be a non-negative safe integer',
    );
  }

  if (end !== undefined && (!Number.isSafeInteger(end) || end < 0)) {
    throw new TypeError(
      'slice() requires end to be a non-negative safe integer',
    );
  }

  return <T>(iter: Iterable<T>): Iterable<T> => ({
    *[Symbol.iterator]() {
      let idx = 0;
      for (const item of iter) {
        if (end !== undefined && idx >= end) {
          break;
        }

        if (idx >= start) {
          yield item;
        }

        idx++;
      }
    },
  });
};
