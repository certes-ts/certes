/**
 * Creates a reusable iterable range from start to end (inclusive).
 *
 * @param start - The start of the number range (inclusive).
 * @param end - The end of the number range (inclusive).
 *
 * @returns An Iterable<number> that yields values from start to end (both inclusive).
 *          Each call to [Symbol.iterator]() creates a fresh iterator, making the
 *          range reusable.
 *
 * @throws {TypeError} If start or end are not safe integers.
 *
 * @remarks
 * **Reusable**: Each iteration creates a fresh iterator with independent state.
 * If `start > end`, the iterator completes immediately without yielding any values.
 *
 * @example
 * const r = range(1, 5);
 * [...r]; // [1, 2, 3, 4, 5]
 * [...r]; // [1, 2, 3, 4, 5] (reusable)
 *
 * [...range(-2, 2)]; // [-2, -1, 0, 1, 2]
 *
 * [...range(5, 5)]; // [5]
 *
 * [...range(5, 1)]; // []
 */
export const range = (start: number, end: number): Iterable<number> => {
  if (!(Number.isSafeInteger(start) && Number.isSafeInteger(end))) {
    throw new TypeError('range() requires safe integers for start and end');
  }

  return {
    *[Symbol.iterator]() {
      for (let i = start; i <= end; i++) {
        yield i;
      }
    },
  };
};
