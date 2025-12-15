/**
 * Lazily concatenates additional iterables after the source.
 *
 * @template T - The element type
 *
 * @param others - Iterables to append
 * @param iter - Source iterable
 *
 * @returns
 * A new iterable yielding source elements followed by all `others`
 *
 * @example
 * collect(concat([4, 5], [6])([1, 2, 3])); // [1, 2, 3, 4, 5, 6]
 */
export const concat =
  <T>(...others: Iterable<T>[]) =>
  (iter: Iterable<T>): Iterable<T> => ({
    *[Symbol.iterator]() {
      yield* iter;

      for (const other of others) {
        yield* other;
      }
    },
  });
