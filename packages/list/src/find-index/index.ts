import type { Predicate } from '@/types';

/**
 * Returns the first index of the given array that satisfies the predicate.
 * Returns `-1` otherwise.
 *
 * @template T - The type of array elements.
 *
 * @param predicate - A predicate function to apply to each element of the array.
 * @param arr - The array to find against based on the predicate.
 *
 * @returns The index of the first matching element, or -1 if none found.
 *
 * @example
 * findIndex(x => !(x & 1))([1, 2, 3, 4, 5]);
 * // 1
 */
export const findIndex =
  <T>(predicate: Predicate<T>) =>
  (arr: T[]): number => {
    const len = arr.length;

    for (let i = 0; i < len; i++) {
      if (predicate(arr[i] as T, i)) {
        return i;
      }
    }

    return -1;
  };
