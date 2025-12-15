import type { MapFn } from '@/types';

/**
 * Maps over the given array, calling the mapping function for each element.
 * Returns a new array of the results.
 *
 * @template T - The type of array elements.
 * @template R - The return type of the mapping function.
 *
 * @param map - The mapping function to apply to each element of the array.
 * @param arr - The array to map over.
 *
 * @returns A new array with the mapping function applied to each element.
 *
 * @example
 * map(x => x * 2)([1, 2, 3, 4, 5]);
 * // [2, 4, 6, 8, 10]
 */
export const map =
  <T, R>(map: MapFn<T, R>) =>
  (arr: T[]): R[] => {
    const len = arr.length;
    const res = new Array<R>(len);

    for (let i = 0; i < len; i++) {
      res[i] = map(arr[i] as T, i);
    }

    return res;
  };
