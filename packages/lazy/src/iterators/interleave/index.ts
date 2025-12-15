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
  <T>(other: Iterable<T>) =>
  (iter: Iterable<T>): Iterable<T> => ({
    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Shhhh
    *[Symbol.iterator]() {
      const iterA = iter[Symbol.iterator]();
      const iterB = other[Symbol.iterator]();

      while (true) {
        const a = iterA.next();

        if (!a.done) {
          yield a.value;
        }

        const b = iterB.next();

        if (!b.done) {
          yield b.value;
        }

        if (a.done && b.done) {
          break;
        }
      }
    },
  });
