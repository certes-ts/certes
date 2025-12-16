import type { Predicate } from '@/types';

/**
 * Lazily yields elements while the predicate returns true, then stops.
 *
 * @template T - The element type
 *
 * @param pred - Predicate function; stops on first false
 * @param iter - Source iterable
 *
 * @returns A new iterable yielding the longest prefix satisfying `pred`
 *
 * @remarks
 * Iteration terminates immediately when `pred` returns false.
 *
 * @example
 * collect(takeWhile((x: number) => x < 4)([1, 2, 3, 4, 5])); // [1, 2, 3]
 */
export const takeWhile =
  <T>(pred: Predicate<T>): ((iter: Iterable<T>) => Iterable<T>) =>
  (iter: Iterable<T>): Iterable<T> => ({
    *[Symbol.iterator]() {
      let idx = 0;

      for (const item of iter) {
        if (!pred(item, idx++)) {
          break;
        }

        yield item;
      }
    },
  });
