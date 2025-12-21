/**
 * Strict equality comparison implementing the logical biconditional (XNOR)
 * operation. Returns `true` when both operands are strictly equal using
 * JavaScript's `===` operator.
 *
 * This function provides referential equality checking without type coercion.
 *
 * @param a - First value to compare
 * @param b - Second value to compare
 *
 * @returns `true` if values are strictly equal, `false` otherwise
 *
 * @example
 * ```typescript
 * // Primitive comparison
 * equality(4)(4);
 * // => true
 *
 * // Different types are not equal
 * equality(4)('4');
 * // => false
 * ```
 *
 * @see {@link https://en.wikipedia.org/wiki/Logical_equality | Logical Equality}
 * @see {@link https://en.wikipedia.org/wiki/Logical_biconditional | Logical Biconditional}
 * @see {@link equalityFn} for function composition variant
 */
export const equality =
  (a: unknown) =>
  (b: unknown): boolean =>
    a === b;

/**
 * Strict equality comparison over function results, implementing the logical
 * biconditional (XNOR) operation on predicate outputs. Returns `true` when both
 * predicates return strictly equal values for the given input.
 *
 * This higher-order function enables comparing function results without
 * intermediate variable assignment.
 *
 * @template T - Type of input value passed to both predicates
 *
 * @param a - First function to evaluate
 * @param b - Second function to evaluate
 * @param c - Input value passed to both functions
 *
 * @returns `true` if function results are strictly equal, `false` otherwise
 *
 * @example
 * ```typescript
 * // Compare modulo operations
 * equalityFn((x: number) => x % 2)((x: number) => x % 3)(6);
 * // => true (both return 0)
 * ```
 *
 * @see {@link https://en.wikipedia.org/wiki/Logical_equality | Logical Equality}
 * @see {@link https://en.wikipedia.org/wiki/Logical_biconditional | Logical Biconditional}
 * @see {@link equality} for value-level equality
 */
export const equalityFn =
  <T>(a: (x: T) => unknown) =>
  (b: (x: T) => unknown) =>
  (c: T): boolean =>
    a(c) === b(c);
