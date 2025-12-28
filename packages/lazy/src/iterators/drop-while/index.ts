import type { Predicate } from '../../types';

/**
 * Lazily skips elements while the predicate returns true, then yields the rest.
 *
 * @template T - The element type
 *
 * @param pred - Predicate function; skips while true
 * @param iter - Source iterable
 *
 * @returns A new iterable yielding elements starting from first `pred` failure
 *
 * @remarks
 * Once `pred` returns false, all subsequent elements are yielded.
 *
 * @example
 * collect(dropWhile((x: number) => x < 3)([1, 2, 3, 4, 1])); // [3, 4, 1]
 */
export const dropWhile =
  <T>(pred: Predicate<T>): ((iter: Iterable<T>) => Iterable<T>) =>
  (iter: Iterable<T>): Iterable<T> => ({
    *[Symbol.iterator]() {
      let idx = 0;
      let dropping = true;

      for (const item of iter) {
        if (dropping && pred(item, idx++)) {
          continue;
        }

        dropping = false;
        yield item;
      }
    },
  });
