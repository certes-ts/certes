/**
 * Creates a reusable infinite iterable that yields a value repeatedly.
 *
 * @template T - The element type.
 *
 * @param value - Value to repeat.
 *
 * @returns An infinite Iterable<T> yielding `value` indefinitely.
 *
 * @remarks
 * **Reusable**: Each iteration creates a fresh iterator.
 * **Caution**: Creates an infinite iterable; always use with `take()` or
 * similar limiting operations.
 *
 * @example
 * [...take(3)(repeat('x'))]; // ['x', 'x', 'x']
 *
 * [...take(5)(repeat(1))]; // [1, 1, 1, 1, 1]
 */
export const repeat = <T>(value: T): Iterable<T> => ({
  *[Symbol.iterator]() {
    while (true) {
      yield value;
    }
  },
});
