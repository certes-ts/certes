/**
 * Lazily pairs elements from two iterables into tuples.
 *
 * @template T - The source element type
 * @template U - The other iterable's element type
 *
 * @param other - Iterable to zip with
 * @param iter - Source iterable
 *
 * @returns A new iterable yielding `[T, U]` pairs
 *
 * @remarks
 * Stops when either iterable is exhausted.
 *
 * @example
 * collect(zip(['a', 'b', 'c'])([1, 2, 3])); // [[1, 'a'], [2, 'b'], [3, 'c']]
 */
export const zip =
  <U>(other: Iterable<U>) =>
  <T>(iter: Iterable<T>): Iterable<[T, U]> => ({
    *[Symbol.iterator]() {
      const iterA = iter[Symbol.iterator]();
      const iterB = other[Symbol.iterator]();

      while (true) {
        const a = iterA.next();
        const b = iterB.next();

        if (a.done || b.done) {
          break;
        }

        yield [a.value, b.value];
      }
    },
  });
