import type { Predicate } from '@/types';

/**
 * Returns the last index of the given array that satisfies the predicate.
 * Returns `-1` otherwise.
 *
 * @template T - The type of array elements.
 *
 * @param predicate - A predicate function to apply to each element of the array.
 * @param arr - The array to find against based on the predicate.
 *
 * @returns The index of the last matching element, or -1 if none found.
 *
 * @remarks
 * Iterates from the end of the array backwards.
 *
 * @example
 * const isEven = (x: number) => !(x & 1);
 * findLastIndex(isEven)([1, 2, 3, 4, 5]);
 * // 3
 */
export const findLastIndex =
  <T>(predicate: Predicate<T>) =>
  (arr: T[]): number => {
    const len = arr.length;

    for (let i = len - 1; i >= 0; i--) {
      if (predicate(arr[i] as T, i)) {
        return i;
      }
    }

    return -1;
  };
