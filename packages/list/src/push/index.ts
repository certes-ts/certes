/**
 * Returns a new array with the given value added to the end.
 *
 * @template T - The type of array elements.
 *
 * @param arr - The array to add an item to.
 * @param x - The value to add to the end of the array.
 *
 * @returns A new array with the value appended.
 *
 * @example
 * push([1, 2, 3, 4])(5);
 * // [1, 2, 3, 4, 5]
 */
export const push =
  <T>(arr: T[]) =>
  (x: T): T[] => {
    const len = arr.length;
    const res = new Array<T>(len + 1);

    for (let i = 0; i < len; i++) {
      res[i] = arr[i] as T;
    }

    res[len] = x;

    return res;
  };
