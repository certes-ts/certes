/**
 * Returns a tuple containing the first element (head) of the given array and
 * the remaining elements of the array (tail).
 *
 * @template T - The type of array elements.
 *
 * @param arr - The element to get the `head`/`tail` of.
 *
 * @returns A tuple containing the first element and remaining elements.
 *
 * @example
 * shift([1, 2, 3, 4, 5]);
 * // [1, [2, 3, 4, 5]]
 */
export function shift(arr: []): [null, []];
export function shift<T>(arr: [T, ...T[]]): [T, T[]];
export function shift<T>(arr: T[]): [T | null, T[]];
export function shift<T>(arr: T[]): [T | null, T[]] {
  const len = arr.length;

  if (len === 0) {
    return [null, []];
  }

  const tail = new Array<T>(len - 1);
  const head = arr[0] as T;

  for (let i = 1; i < len; i++) {
    tail[i - 1] = arr[i] as T;
  }

  return [head, tail];
}
