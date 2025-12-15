/**
 * Lazily combines elements from two iterables using a function.
 *
 * @template T - The source element type
 * @template U - The other iterable's element type
 * @template R - The result element type
 *
 * @param other - Iterable to zip with
 * @param fn - Function combining paired elements
 * @param iter - Source iterable
 *
 * @returns
 * A new iterable yielding combined results
 *
 * @remarks Stops when either iterable is exhausted.
 *
 * @example
 * collect(zipWith([10, 20, 30], (a, b) => a + b)([1, 2, 3])); // [11, 22, 33]
 */
export const zipWith =
  <T, U, R>(other: Iterable<U>, fn: (a: T, b: U) => R) =>
  (iter: Iterable<T>): Iterable<R> => ({
    *[Symbol.iterator]() {
      const iterA = iter[Symbol.iterator]();
      const iterB = other[Symbol.iterator]();

      while (true) {
        const a = iterA.next();
        const b = iterB.next();

        if (a.done || b.done) {
          break;
        }

        yield fn(a.value, b.value);
      }
    },
  });
