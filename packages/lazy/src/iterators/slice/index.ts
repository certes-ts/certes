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
export const slice =
  (start: number, end?: number) =>
  <T>(iter: Iterable<T>): Iterable<T> => ({
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
