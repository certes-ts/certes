/**
 * Lazily inserts a separator between each element.
 *
 * @template T - The element type
 *
 * @param separator - Value to insert between elements
 * @param iter - Source iterable
 *
 * @returns A new iterable with separators between each original element
 *
 * @example
 * collect(intersperse(0)([1, 2, 3])); // [1, 0, 2, 0, 3]
 */
export const intersperse =
  <T>(separator: T): ((iter: Iterable<T>) => Iterable<T>) =>
  (iter: Iterable<T>): Iterable<T> => ({
    *[Symbol.iterator]() {
      let first = true;

      for (const item of iter) {
        if (!first) {
          yield separator;
        }

        first = false;
        yield item;
      }
    },
  });
