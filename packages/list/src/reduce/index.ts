import type { Accumulator } from '@/types';

/**
 * Calls the accumulator with each element of the given array, starting with the first element. Returns the final result.
 *
 * @template T - The type of array elements.
 * @template R - The result type of the folder function.
 *
 * @param fn - The accumulator function to apply to each element of the array.
 * @param initVal - The initial value of the reduction.
 * @param arr - The array to fold over.
 *
 * @returns The final accumulated value.
 *
 * @example
 * reduce((total, n) => total + n)(0)([1, 2, 3, 4, 5]);
 * // 15
 */
export const reduce =
  <T, R>(fn: Accumulator<T, R>) =>
  (initVal: R) =>
  (arr: T[]): R => {
    const len = arr.length;
    let acc = initVal;

    for (let i = 0; i < len; i++) {
      acc = fn(acc, arr[i] as T);
    }

    return acc;
  };
