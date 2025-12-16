/**
 * Lazily interleaves elements from two iterables alternately.
 *
 * @template T - The element type
 *
 * @param other - Iterable to interleave with
 * @param iter - Source iterable
 *
 * @returns A new iterable yielding `[a₀, b₀, a₁, b₁, ...]`
 *
 * @remarks
 * Continues until both iterables are exhausted.
 *
 * @example
 * collect(interleave([4, 5, 6])([1, 2, 3])); // [1, 4, 2, 5, 3, 6]
 */
export const interleave =
  <T>(other: Iterable<T>): ((iter: Iterable<T>) => Iterable<T>) =>
  (iter: Iterable<T>): Iterable<T> => ({
    *[Symbol.iterator]() {
      const iterA = iter[Symbol.iterator]();
      const iterB = other[Symbol.iterator]();
      let a = iterA.next();
      let b = iterB.next();

      while (!(a.done && b.done)) {
        if (!a.done) {
          yield a.value;
          a = iterA.next();
        }

        if (!b.done) {
          yield b.value;
          b = iterB.next();
        }
      }
    },
  });
