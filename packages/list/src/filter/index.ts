import type { Predicate } from '@/types';

/**
 * Returns a copy of the given array of elements that satisfy the predicate.
 *
 * @template T - The type of array elements.
 *
 * @param predicate - A predicate function to apply to each element of the array.
 * @param arr - The array to filter on based on the predicate.
 *
 * @returns A new array containing only elements that satisfy the predicate.
 *
 * @example
 * filter(x => !(x & 1))([1, 2, 3, 4, 5]);
 * // [2, 4]
 */
export const filter =
  <T>(predicate: Predicate<T>) =>
  (arr: T[]): T[] => {
    const len = arr.length;
    const res: T[] = [];

    for (let i = 0; i < len; i++) {
      if (predicate(arr[i] as T, i)) {
        res.push(arr[i] as T);
      }
    }

    return res;
  };
