import type { Accumulator } from '@/types';

/**
 * Calls the accumulator with each element of the given array, starting with the last element. Returns the final result.
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
 * reduceRight((base, s) => `${base}${s}`)('')(['a', 'b', 'c', 'd', 'e']);
 * // 'edcba'
 */
export const reduceRight =
  <T, R>(fn: Accumulator<T, R>) =>
  (initVal: R) =>
  (arr: T[]): R => {
    const len = arr.length;
    let acc = initVal;

    for (let i = len - 1; i >= 0; i--) {
      acc = fn(acc, arr[i] as T);
    }

    return acc;
  };
