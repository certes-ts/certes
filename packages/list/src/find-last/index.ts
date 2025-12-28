import type { Predicate } from '../types';

/**
 * Returns the last element of the given array that satisfies the predicate.
 * Returns `null` otherwise.
 *
 * @template T - The type of array elements.
 *
 * @param predicate - A predicate function to apply to each element of the array.
 * @param arr - The array to find against based on the predicate.
 *
 * @returns The last matching element, or null if none found.
 *
 * @example
 * findLast(x => !(x & 1))([1, 2, 3, 4, 5]);
 * // 4
 */
export const findLast =
  <T>(predicate: Predicate<T>) =>
  (arr: T[]): T | null => {
    const len = arr.length;

    for (let i = len - 1; i >= 0; i--) {
      if (predicate(arr[i] as T, i)) {
        return arr[i] as T;
      }
    }

    return null;
  };
