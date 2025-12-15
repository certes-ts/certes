/**
 * Returns the first index at which a given element can be found in the array.
 * Returns `-1` otherwise.
 *
 * @template T - The type of array elements.
 *
 * @param x - The value to find in the array.
 * @param arr - The array to search for the element in.
 *
 * @returns The index of the first occurrence, or -1 if not found.
 *
 * @example
 * indexOf(3)([1, 2, 3, 4, 5]);
 * // 2
 */
export const indexOf =
  <T>(x: T) =>
  (arr: T[]): number => {
    const len = arr.length;

    for (let i = 0; i < len; i++) {
      if (arr[i] === x) {
        return i;
      }
    }

    return -1;
  };
