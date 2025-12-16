/**
 * Lazily prepends additional iterables before the source.
 *
 * @template T - The element type
 *
 * @param others - Iterables to prepend
 * @param iter - Source iterable
 *
 * @returns A new iterable yielding all `others` followed by source elements
 *
 * @example
 * collect(prepend([1, 2], [3])([4, 5, 6])); // [1, 2, 3, 4, 5, 6]
 */
export const prepend =
  <T>(...others: Iterable<T>[]): ((iter: Iterable<T>) => Iterable<T>) =>
  (iter: Iterable<T>): Iterable<T> => ({
    *[Symbol.iterator]() {
      for (const other of others) {
        yield* other;
      }

      yield* iter;
    },
  });
