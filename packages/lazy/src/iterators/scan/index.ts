import type { Accumulator } from '@/types';

/**
 * Lazily yields intermediate accumulator values during a reduction.
 *
 * @template T - The input element type
 * @template A - The accumulator type
 *
 * @param reducer - Function combining accumulator with each element
 * @param initial - Initial accumulator value
 * @param iter - Source iterable
 *
 * @returns A new iterable yielding each intermediate accumulator
 *
 * @remarks
 * Like `reduce`, but emits every step. Useful for running totals.
 *
 * @example
 * collect(scan((acc, x) => acc + x, 0)([1, 2, 3, 4])); // [1, 3, 6, 10]
 */
export const scan =
  <T, A>(
    reducer: Accumulator<T, A>,
    initial: A,
  ): ((iter: Iterable<T>) => Iterable<A>) =>
  (iter: Iterable<T>): Iterable<A> => ({
    *[Symbol.iterator]() {
      let acc = initial;
      let idx = 0;

      for (const item of iter) {
        acc = reducer(acc, item, idx++);
        yield acc;
      }
    },
  });
