/**
 * Creates a reusable infinite iterable by repeatedly applying a function.
 *
 * @template T - The element type.
 *
 * @param fn - Function to compute the next value from the current.
 * @param seed - Initial value.
 *
 * @returns An infinite Iterable<T>: `seed, fn(seed), fn(fn(seed)), ...`
 *
 * @throws {TypeError} If fn is not a function.
 *
 * @remarks
 * **Reusable**: Each iteration creates a fresh iterator starting from `seed`.
 * **Caution**: Creates an infinite iterable; always use with `take()` or
 * similar limiting operations.
 *
 * @example
 * const powers = iterate((x: number) => x * 2)(1);
 * [...take(5)(powers)]; // [1, 2, 4, 8, 16]
 *
 * // Fibonacci via tuple iteration
 * const fibs = iterate(([a, b]: [number, number]) => [b, a + b] as [number, number])([0, 1]);
 * [...take(7)(lazyMap(([a]: [number, number]) => a)(fibs))]; // [0, 1, 1, 2, 3, 5, 8]
 */
export const iterate = <T>(fn: (x: T) => T): ((seed: T) => Iterable<T>) => {
  if (typeof fn !== 'function') {
    throw new TypeError('iterate() requires fn to be a function');
  }

  return (seed: T): Iterable<T> => ({
    *[Symbol.iterator]() {
      let current = seed;

      while (true) {
        yield current;
        current = fn(current);
      }
    },
  });
};
