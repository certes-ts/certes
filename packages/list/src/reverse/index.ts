/**
 * Returns a new array with the order of the elements reversed.
 *
 * @template T - The type of array elements.
 *
 * @param arr - The array to reverse the order of.
 *
 * @returns A new array with elements in reversed order.
 *
 * @example
 * reverse([1, 2, 3, 4, 5]);
 * // [5, 4, 3, 2, 1]
 */
export const reverse = <T>(arr: T[]): T[] => {
  const len = arr.length;
  const res = new Array<T>(len);
  const maxIdx = len - 1;

  for (let i = 0; i < len; i++) {
    res[i] = arr[maxIdx - i] as T;
  }

  return res;
};
