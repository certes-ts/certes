/**
 * Returns a new array with the given value added to the start.
 *
 * @template T - The type of array elements.
 *
 * @param arr - The array to add an item to.
 * @param x - The value to add to the start of the array.
 *
 * @returns A new array with the value prepended.
 *
 * @example
 * unshift([1, 2, 3, 4])(0);
 * // [0, 1, 2, 3, 4]
 */
export const unshift =
  <T>(arr: T[]) =>
  (x: T): T[] => {
    const len = arr.length;
    const res = new Array<T>(len + 1);

    res[0] = x;

    for (let i = 0; i < len; i++) {
      res[i + 1] = arr[i] as T;
    }

    return res;
  };
