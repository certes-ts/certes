/**
 * Creates a reusable iterable range from start to end (inclusive).
 *
 * @param start - The start of the number range (inclusive).
 * @param end - The end of the number range (inclusive).
 *
 * @returns An Iterable<number> that yields values from start to end. Each call to
 *          [Symbol.iterator]() creates a fresh iterator, making the range reusable
 *          across multiple iterations.
 *
 * @remarks
 * **Reusable**: Unlike generator functions, this range can be iterated multiple times.
 * Each iteration creates a fresh iterator with independent state. Similar to how arrays
 * can be iterated multiple times.
 *
 * If `start > end`, the iterator completes immediately without yielding any values,
 * returning `end` as the completion value.
 *
 * @example
 * // Basic usage
 * for (const n of range(1, 5)) {
 *   console.log(n);
 * }
 * // Output: 1, 2, 3, 4, 5
 *
 * // Reusable across multiple iterations
 * const r = range(1, 10);
 * const squares = [...r].map(x => x * x);
 * const cubes = [...r].map(x => x * x * x);
 *
 * // Spread into array
 * const numbers = [...range(1, 10)];
 * // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
 */
export const range = (start: number, end: number): Iterable<number> => {
  if (!(Number.isSafeInteger(start) && Number.isSafeInteger(end))) {
    throw new TypeError('range() requires safe, finite numbers');
  }

  return {
    [Symbol.iterator]() {
      let counter = start;
      return {
        next: () => {
          if (counter <= end) {
            return { value: counter++, done: false };
          }

          return { done: true, value: end };
        },
      };
    },
  };
};
