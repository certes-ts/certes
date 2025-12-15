/**
 * Creates a reusable infinite iterable from an index-based generator function.
 *
 * @template T - The element type.
 *
 * @param fn - Function generating the value at each index.
 * @returns An infinite Iterable<T>: `fn(0), fn(1), fn(2), ...`
 *
 * @throws {TypeError} If fn is not a function.
 *
 * @remarks
 * **Reusable**: Each iteration creates a fresh iterator starting from index 0.
 * **Caution**: Creates an infinite iterable; always use with `take()` or
 * similar limiting operations.
 *
 * @example
 * const squares = generate((i) => i * i);
 * [...take(5)(squares)]; // [0, 1, 4, 9, 16]
 *
 * // Alternating signs
 * const alternating = generate((i) => (i % 2 === 0 ? 1 : -1));
 * [...take(6)(alternating)]; // [1, -1, 1, -1, 1, -1]
 */
export const generate = <T>(fn: (idx: number) => T): Iterable<T> => {
  if (typeof fn !== 'function') {
    throw new TypeError('generate() requires fn to be a function');
  }

  return {
    *[Symbol.iterator]() {
      let idx = 0;
      while (true) {
        yield fn(idx++);
      }
    },
  };
};
