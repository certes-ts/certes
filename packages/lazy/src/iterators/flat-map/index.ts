import type { MapFn } from '../../types';

/**
 * Lazily maps each element to an iterable and flattens the results.
 *
 * @template T - The input element type
 * @template R - The output element type
 *
 * @param fn - Function mapping each element to an iterable
 * @param iter - Source iterable
 *
 * @returns A new iterable yielding all elements from all produced iterables
 *
 * @remarks
 * Equivalent to `flatten(map(fn)(iter))` but in a single pass.
 *
 * @example
 * const duplicate = flatMap((x: number) => [x, x]);
 * collect(duplicate([1, 2, 3])); // [1, 1, 2, 2, 3, 3]
 */
export const flatMap =
  <T, R>(fn: MapFn<T, Iterable<R>>): ((iter: Iterable<T>) => Iterable<R>) =>
  (iter: Iterable<T>): Iterable<R> => ({
    *[Symbol.iterator]() {
      let idx = 0;

      for (const item of iter) {
        yield* fn(item, idx++);
      }
    },
  });
