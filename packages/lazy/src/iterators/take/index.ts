/**
 * Lazily yields at most the first `n` elements.
 *
 * @template T - The element type
 *
 * @param n - Maximum number of elements to yield
 * @param iter - Source iterable
 *
 * @returns A new iterable yielding at most `n` elements
 *
 * @remarks Iteration stops early once `n` elements have been yielded.
 *
 * @example
 * collect(take(3)([1, 2, 3, 4, 5])); // [1, 2, 3]
 */
export const take = (n: number): (<T>(iter: Iterable<T>) => Iterable<T>) => {
  if (!Number.isSafeInteger(n) || n < 0) {
    throw new TypeError('take() requires n to be a non-negative safe integer');
  }

  return <T>(iter: Iterable<T>): Iterable<T> => ({
    *[Symbol.iterator]() {
      if (n === 0) {
        return;
      }

      let count = 0;

      for (const item of iter) {
        yield item;

        if (++count >= n) {
          return;
        }
      }
    },
  });
};
