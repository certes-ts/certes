/**
 * Logical negation (NOT) operation. Returns the Boolean negation of the
 * given value with automatic type coercion.
 *
 * This function provides a functional interface to JavaScript's `!` operator,
 * enabling use in point-free compositions and partial application contexts.
 *
 * @template T - Type of the input value
 *
 * @param x - Value to negate
 *
 * @returns `true` if value is falsy, `false` if value is truthy
 *
 * @example
 * ```typescript
 * // Boolean negation
 * not(true);
 * // => false
 *
 * // Type coercion
 * not(0);
 * // => true
 *
 * // Array filtering
 * const numbers = [0, 1, 2, 0, 3];
 * numbers.filter(not);
 * // => [0, 0]
 * ```
 *
 * @see {@link https://en.wikipedia.org/wiki/Negation | Logical Negation}
 * @see {@link notFn} for function composition variant
 */
export const not = <T>(x: T): boolean => !x;

/**
 * Logical negation (NOT) over function results. Returns the Boolean negation
 * of the predicate's return value for the given input.
 *
 * This higher-order function enables negating predicates in a point-free style,
 * useful for inverting validation logic without creating intermediate variables.
 *
 * @template T - Type of input value passed to the predicate
 *
 * @param a - Predicate function to negate the result of
 * @param b - Input value passed to the predicate
 *
 * @returns `true` if predicate returns falsy value, `false` if truthy
 *
 * @example
 * ```typescript
 * // Negate a predicate
 * const isEven = (x: number) => x % 2 === 0;
 * const isOdd = notFn(isEven);
 *
 * isOdd(3);
 * // => true
 *
 * // Array filtering with negated predicate
 * const isEmpty = (s: string) => s.length === 0;
 * const strings = ['', 'a', '', 'b'];
 * strings.filter(notFn(isEmpty));
 * // => ['a', 'b']
 * ```
 *
 * @see {@link https://en.wikipedia.org/wiki/Negation | Logical Negation}
 * @see {@link not} for value-level negation
 */
export const notFn =
  <T>(a: (x: T) => unknown) =>
  (b: T): boolean =>
    !a(b);
