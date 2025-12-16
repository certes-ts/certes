import { repeat } from '@/generators/repeat';
import { take } from '../../iterators/take';

/**
 * Creates a finite iterable that repeats a value `n` times.
 *
 * @template T - The element type.
 *
 * @param n - Number of repetitions (must be a non-negative safe integer).
 * @param value - Value to repeat.
 *
 * @returns An Iterable<T> yielding `value` exactly `n` times.
 *
 * @throws {TypeError} If n is not a non-negative safe integer (thrown by `take`).
 *
 * @remarks
 * Composed from `take` and `repeat`. Unlike `repeat`, which produces an
 * infinite iterable, `replicate` produces a finite iterable of known length.
 *
 * @example
 * [...replicate(3)('x')]; // ['x', 'x', 'x']
 *
 * [...replicate(5)(0)]; // [0, 0, 0, 0, 0]
 *
 * // Reusable
 * const threeStars = replicate(3)('★');
 * [...threeStars]; // ['★', '★', '★']
 * [...threeStars]; // ['★', '★', '★']
 */
export const replicate =
  <T>(n: number): ((value: T) => Iterable<T>) =>
  (value: T): Iterable<T> =>
    take(n)(repeat(value));
