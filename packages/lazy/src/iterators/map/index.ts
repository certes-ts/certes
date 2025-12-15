import type { MapFn } from '@/types';

/**
 * Lazily transforms each element of an iterable using a mapping function.
 *
 * @template T - The input element type
 * @template R - The output element type
 *
 * @param fn - Mapping function applied to each element
 * @param iter - Source iterable
 *
 * @returns A new iterable yielding transformed elements
 *
 * @remarks
 * Elements are transformed one at a time as the result is iterated.
 *
 * @example
 * const double = map((x: number) => x * 2);
 * collect(double([1, 2, 3])); // [2, 4, 6]
 */
export const map =
  <T, R>(fn: MapFn<T, R>) =>
  (iter: Iterable<T>): Iterable<R> => ({
    *[Symbol.iterator]() {
      let idx = 0;

      for (const item of iter) {
        yield fn(item, idx++);
      }
    },
  });
