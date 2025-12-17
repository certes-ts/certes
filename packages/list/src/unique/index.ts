/**
 * Returns array with duplicate values removed (using ===).
 *
 * @template T - Element type
 *
 * @param arr - Array to deduplicate
 *
 * @returns New array with duplicates removed, preserving first occurrence order
 *
 * @remarks
 * Uses a Set internally for O(n) time complexity.
 * Preserves the order of first occurrences.
 * Uses strict equality (===) for comparison.
 *
 * Time complexity: O(n)
 * Space complexity: O(n)
 *
 * @example
 * ```typescript
 * unique([1, 2, 2, 3, 3, 3, 4]);
 * // [1, 2, 3, 4]
 *
 * unique(['a', 'b', 'a', 'c']);
 * // ['a', 'b', 'c']
 *
 * unique([]);
 * // []
 * ```
 */
export const unique = <T>(arr: T[]): T[] => {
  const seen = new Set<T>();
  const result: T[] = [];
  const len = arr.length;
  let resultIdx = 0;

  for (let i = 0; i < len; i++) {
    const item = arr[i] as T;

    if (!seen.has(item)) {
      seen.add(item);
      result[resultIdx++] = item;
    }
  }

  return result;
};
