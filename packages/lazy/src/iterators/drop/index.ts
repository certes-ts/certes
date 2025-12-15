/**
 * Lazily skips the first `n` elements, then yields the rest.
 *
 * @template T - The element type
 *
 * @param n - Number of elements to skip
 * @param iter - Source iterable
 *
 * @returns A new iterable yielding elements after the first `n`
 *
 * @example
 * collect(drop(2)([1, 2, 3, 4, 5])); // [3, 4, 5]
 */
export const drop =
  (n: number) =>
  <T>(iter: Iterable<T>): Iterable<T> => ({
    *[Symbol.iterator]() {
      let count = 0;

      for (const item of iter) {
        if (count++ >= n) {
          yield item;
        }
      }
    },
  });
