/**
 * Logical conjunction operation implementing Boolean AND semantics with
 * automatic type coercion. Returns `true` only when both operands are truthy.
 *
 * @template A - Type of the first operand
 * @template B - Type of the second operand
 *
 * @param a - First operand to evaluate
 * @param b - Second operand to evaluate
 *
 * @returns `true` if both operands are truthy, `false` otherwise
 *
 * @example
 * ```typescript
 * // Basic usage with booleans
 * and(true)(false);
 * // => false
 *
 * // Partial application
 * const andTrue = and(true);
 * andTrue(42);
 * // => true
 *
 * // Array filtering with partial application
 * const values = [1, 0, 2, null, 3];
 * const hasValue = and(true);
 * values.filter(hasValue);
 * // => [1, 2, 3]
 * ```
 *
 * @see {@link https://en.wikipedia.org/wiki/Logical_conjunction | Logical Conjunction}
 * @see {@link andFn} for function composition variant
 */
export const and =
  <A>(a: A) =>
  <B>(b: B): boolean =>
    Boolean(a) && Boolean(b);

/**
 * Logical conjunction over function results, implementing predicate composition
 * via Boolean AND semantics. Returns `true` only when both predicates evaluate
 * to truthy values for the given input.
 *
 * This higher-order function enables composing predicates in a point-free style,
 * useful for building complex validation logic from simpler predicates.
 *
 * @template T - Type of input value passed to both predicates
 * @template A - Return type of first predicate
 * @template B - Return type of second predicate
 *
 * @param a - First predicate function to evaluate
 * @param b - Second predicate function to evaluate
 * @param c - Input value passed to both predicates
 *
 * @returns `true` if both predicates return truthy values, `false` otherwise
 *
 * @example
 * ```typescript
 * // Validate number ranges
 * const isPositive = (x: number) => x > 0;
 * const isEven = (x: number) => x % 2 === 0;
 * const isPositiveEven = andFn(isPositive)(isEven);
 *
 * isPositiveEven(4);
 * // => true
 *
 * isPositiveEven(-4);
 * // => false
 * ```
 *
 * @see {@link https://en.wikipedia.org/wiki/Logical_conjunction | Logical Conjunction}
 * @see {@link and} for value-level conjunction
 */
export const andFn =
  <T, A>(a: (x: T) => A) =>
  <B>(b: (y: T) => B) =>
  (c: T): boolean =>
    Boolean(a(c)) && Boolean(b(c));
