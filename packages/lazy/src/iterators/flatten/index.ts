/**
 * Lazily flattens a nested iterable by one level.
 *
 * @template T - The inner element type
 *
 * @param iter - An iterable of iterables
 *
 * @returns A new iterable yielding all inner elements sequentially
 *
 * @example
 * collect(flatten([[1, 2], [3, 4]])); // [1, 2, 3, 4]
 */
export const flatten = <T>(iter: Iterable<Iterable<T>>): Iterable<T> => ({
  *[Symbol.iterator]() {
    for (const inner of iter) {
      yield* inner;
    }
  },
});
