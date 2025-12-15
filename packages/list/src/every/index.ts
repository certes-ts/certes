import type { Comparator } from '@/types';

/**
 * Tests whether all elements in the array pass the given comparator.
 *
 * @template T - The type of array elements.
 *
 * @param comparator - The comparator function to apply to each element of the array.
 * @param arr - The array to check each element of.
 *
 * @returns True if all elements pass the comparator, false otherwise.
 *
 * @example
 * every(x => !(x & 1))([1, 2, 3, 4, 5]);
 * // false
 */
export const every =
  <T>(comparator: Comparator<T>) =>
  (arr: T[]): boolean => {
    const len = arr.length;

    for (let i = 0; i < len; i++) {
      if (!comparator(arr[i] as T)) {
        return false;
      }
    }

    return true;
  };
