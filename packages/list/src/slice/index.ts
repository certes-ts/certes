/**
 * Returns a new array containing elements between `start` and `end` (exclusive)
 * from the original array.
 *
 * @template T - The type of array elements.
 *
 * @param start - The index to start at (inclusive).
 * @param end - The index to end on (exclusive).
 * @param arr - The array to get a slice from.
 *
 * @returns A new array containing elements from start to end.
 *
 * @example
 * slice(0)(4)([1, 2, 3, 4, 5, 6]);
 * // [1, 2, 3, 4]
 */
export const slice =
  (start: number) =>
  (end: number) =>
  <T>(arr: T[]): T[] => {
    const minY = Math.min(end, arr.length);
    const res = new Array<T>(minY - start);

    for (let i = start; i < minY; i++) {
      res[i - start] = arr[i] as T;
    }

    return res;
  };
