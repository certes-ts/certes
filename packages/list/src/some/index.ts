import type { Comparator } from '@/types';

/**
 * Tests whether any elements in the array pass the given comparator.
 *
 * @template T - The type of array elements.
 *
 * @param comparator - The comparator function to apply to each element of the array.
 * @param arr - The array to check each element of.
 *
 * @returns True if any element passes the comparator, false otherwise.
 *
 * @example
 * every(x => !(x & 1))([1, 2, 3, 4, 5]);
 * // true
 */
export const some =
  <T>(comparator: Comparator<T>) =>
  (arr: T[]): boolean => {
    const len = arr.length;

    for (let i = 0; i < len; i++) {
      if (comparator(arr[i] as T)) {
        return true;
      }
    }

    return false;
  };
