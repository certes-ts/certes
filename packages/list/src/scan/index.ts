/**
 * Like reduce, but returns array of all intermediate accumulator values.
 *
 * @template T - Element type
 * @template R - Accumulator type
 *
 * @param fn - Accumulator function
 *
 * @returns Curried function that takes initial value, then array
 *
 * @remarks
 * Also known as "scan" or "prefix sum" in other languages.
 * Result includes initial value and has length n + 1.
 *
 * Time complexity: O(n)
 * Space complexity: O(n)
 *
 * @example
 * ```typescript
 * const add = (acc: number, x: number) => acc + x;
 * scan(add)(0)([1, 2, 3, 4]);
 * // [0, 1, 3, 6, 10]
 *
 * const concat = (acc: string, x: string) => acc + x;
 * scan(concat)('')(['a', 'b', 'c']);
 * // ['', 'a', 'ab', 'abc']
 * ```
 */
export const scan =
  <T, R>(fn: (acc: R, x: T) => R) =>
  (init: R) =>
  (arr: T[]): R[] => {
    const len = arr.length;
    const result: R[] = new Array(len + 1);
    result[0] = init;

    let acc = init;
    for (let i = 0; i < len; i++) {
      acc = fn(acc, arr[i] as T);
      result[i + 1] = acc;
    }

    return result;
  };
