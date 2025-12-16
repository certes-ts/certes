/**
 * Lazily yields only the first occurrence of each unique element.
 *
 * @template T - The element type
 *
 * @param iter - Source iterable
 *
 * @returns A new iterable with duplicates removed (preserving first occurrence)
 *
 * @remarks
 * Uses a `Set` internally; memory grows linearly with unique element count.
 * For very large iterables with high cardinality, consider streaming
 * alternatives or bounded caches.
 *
 * @example
 * collect(unique([1, 2, 1, 3, 2, 4])); // [1, 2, 3, 4]
 */
export const unique = <T>(iter: Iterable<T>): Iterable<T> => ({
  *[Symbol.iterator]() {
    const seen = new Set<T>();

    for (const item of iter) {
      if (!seen.has(item)) {
        seen.add(item);
        yield item;
      }
    }
  },
});
