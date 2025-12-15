/**
 * Lazily yields elements with unique keys as determined by a key function.
 *
 * @template T - The element type
 * @template K - The key type
 *
 * @param keyFn - Function extracting a key from each element
 * @param iter - Source iterable
 *
 * @returns A new iterable with duplicates (by key) removed
 *
 * @remarks
 * Uses a `Set` internally; memory grows with unique key count.
 *
 * @example
 * const users = [{ id: 1, name: 'a' }, { id: 2, name: 'b' }, { id: 1, name: 'c' }];
 * collect(uniqueBy((u) => u.id)(users)); // [{ id: 1, name: 'a' }, { id: 2, name: 'b' }]
 */
export const uniqueBy =
  <T, K>(keyFn: (x: T) => K) =>
  (iter: Iterable<T>): Iterable<T> => ({
    *[Symbol.iterator]() {
      const seen = new Set<K>();

      for (const item of iter) {
        const key = keyFn(item);

        if (!seen.has(key)) {
          seen.add(key);
          yield item;
        }
      }
    },
  });
