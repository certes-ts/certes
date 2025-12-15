/**
 * Determines whether the given array includes an element. Uses strict equality.
 *
 * @template T - The type of array elements.
 *
 * @param x - The value to find in the array.
 * @param arr - The array to search for the element in.
 *
 * @returns True if the array contains the element, false otherwise.
 *
 * @example
 * includes(3)([1, 2, 3, 4, 5]);
 * // true
 */
export const includes =
  <T>(x: T) =>
  (arr: T[]): boolean => {
    const len = arr.length;

    for (let i = 0; i < len; i++) {
      if (arr[i] === x) {
        return true;
      }
    }

    return false;
  };
