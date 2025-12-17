/**
 * Returns array with duplicates removed based on a key function.
 *
 * @template T - Element type
 * @template K - Key type
 *
 * @param keyFn - Function to extract comparison key from each element
 *
 * @returns Curried function that takes an array and returns deduplicated result
 *
 * @remarks
 * Uses a Set internally for O(n) time complexity.
 * Preserves the order of first occurrences.
 * Keys are compared using strict equality (===).
 *
 * Time complexity: O(n)
 * Space complexity: O(n)
 *
 * @example
 * ```typescript
 * const users = [
 *   { id: 1, name: 'Alice' },
 *   { id: 2, name: 'Bob' },
 *   { id: 1, name: 'Alice2' }
 * ];
 * uniqueBy((u) => u.id)(users);
 * // [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]
 *
 * const words = ['apple', 'apricot', 'banana', 'avocado'];
 * uniqueBy((w: string) => w[0])(words);
 * // ['apple', 'banana']
 * ```
 */
export const uniqueBy =
  <T, K>(keyFn: (x: T) => K) =>
  (arr: T[]): T[] => {
    const seen = new Set<K>();
    const result: T[] = [];
    const len = arr.length;
    let resultIdx = 0;

    for (let i = 0; i < len; i++) {
      const item = arr[i] as T;
      const key = keyFn(item);

      if (!seen.has(key)) {
        seen.add(key);
        result[resultIdx++] = item;
      }
    }

    return result;
  };
