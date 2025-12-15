/**
 * Eagerly collects all elements from an iterable into an array.
 *
 * @template T - The element type
 *
 * @param iter - Source iterable
 *
 * @returns An array containing all elements
 *
 * @remarks
 * Forces evaluation of the entire iterable. Do not use on infinite iterables.
 *
 * @example
 * collect(take(3)(range(1, 100))); // [1, 2, 3]
 */
export const collect = <T>(iter: Iterable<T>): T[] => [...iter];
