import type { Predicate } from '../../types';

/**
 * Lazily filters elements of an iterable based on a predicate.
 *
 * @template T - The element type
 *
 * @param pred - Predicate function; elements pass if this returns true
 * @param iter - Source iterable
 *
 * @returns A new iterable yielding only elements satisfying the predicate
 *
 * @remarks
 * Elements are tested one at a time as the result is iterated.
 *
 * @example
 * const evens = filter((x: number) => x % 2 === 0);
 * collect(evens([1, 2, 3, 4, 5])); // [2, 4]
 */
export const filter =
  <T>(pred: Predicate<T>): ((iter: Iterable<T>) => Iterable<T>) =>
  (iter: Iterable<T>): Iterable<T> => ({
    *[Symbol.iterator]() {
      let idx = 0;

      for (const item of iter) {
        if (pred(item, idx++)) {
          yield item;
        }
      }
    },
  });
