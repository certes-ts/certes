/**
 * Lazily applies a side-effect function to each element without modifying them.
 *
 * @template T - The element type
 *
 * @param fn - Side-effect function (e.g., logging)
 * @param iter - Source iterable
 *
 * @returns A new iterable yielding the same elements unchanged
 *
 * @remarks
 * Useful for debugging pipelines without breaking the chain.
 *
 * @example
 * const logged = tap((x: number) => console.log(x));
 * collect(logged([1, 2, 3])); // logs 1, 2, 3; returns [1, 2, 3]
 */
export const tap =
  <T>(fn: (x: T, idx?: number) => void) =>
  (iter: Iterable<T>): Iterable<T> => ({
    *[Symbol.iterator]() {
      let idx = 0;

      for (const item of iter) {
        fn(item, idx++);
        yield item;
      }
    },
  });
