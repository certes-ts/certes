/**
 * Lazily pairs each element with its zero-based index.
 *
 * @template T - The element type
 *
 * @param iter - Source iterable
 *
 * @returns A new iterable yielding `[index, value]` tuples
 *
 * @example
 * collect(enumerate(['a', 'b', 'c'])); // [[0, 'a'], [1, 'b'], [2, 'c']]
 */
export const enumerate = <T>(iter: Iterable<T>): Iterable<[number, T]> => ({
  *[Symbol.iterator]() {
    let idx = 0;

    for (const item of iter) {
      yield [idx++, item];
    }
  },
});
