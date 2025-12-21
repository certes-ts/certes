/**
 * Exclusive disjunction (XOR) operation. Returns `true` when exactly one
 * operand is truthy, implementing Boolean XOR semantics via bitwise operators.
 *
 * This function coerces operands to Boolean values (0 or 1) before applying
 * the bitwise XOR operation, useful for toggle logic and mutually exclusive
 * conditions.
 *
 * @param a - First value to compare
 * @param b - Second value to compare
 *
 * @returns `true` if exactly one operand is truthy, `false` otherwise
 *
 * @example
 * ```typescript
 * // Different boolean values
 * xor(true)(false);
 * // => true
 *
 * // Same boolean values
 * xor(true)(true);
 * // => false
 * ```
 *
 * @see {@link https://en.wikipedia.org/wiki/Exclusive_or | Exclusive OR}
 * @see {@link xorFn} for function composition variant
 */
export const xor =
  (a: unknown) =>
  (b: unknown): boolean =>
    !!((a ? 1 : 0) ^ (b ? 1 : 0));

/**
 * Exclusive disjunction (XOR) over function results. Returns `true` when
 * exactly one predicate evaluates to a truthy value, implementing Boolean
 * XOR semantics on predicate outputs.
 *
 * This higher-order function is useful for expressing mutually exclusive
 * conditions in a composable way.
 *
 * @template T - Type of input value passed to both predicates
 *
 * @param a - First predicate function to evaluate
 * @param b - Second predicate function to evaluate
 * @param c - Input value passed to both predicates
 *
 * @returns `true` if exactly one predicate returns truthy value, `false` otherwise
 *
 * @example
 * ```typescript
 * // Mutually exclusive validation
 * const hasError = (state: State) => state.error !== null;
 * const isLoading = (state: State) => state.loading;
 * const isInconsistent = xorFn(hasError)(isLoading);
 *
 * isInconsistent({ error: null, loading: true });
 * // => true
 *
 * isInconsistent({ error: 'timeout', loading: true });
 * // => false (both true - inconsistent state)
 * ```
 *
 * @see {@link https://en.wikipedia.org/wiki/Exclusive_or | Exclusive OR}
 * @see {@link xor} for value-level XOR
 */
export const xorFn =
  <T>(a: (x: T) => unknown) =>
  (b: (x: T) => unknown) =>
  (c: T): boolean =>
    !!((a(c) ? 1 : 0) ^ (b(c) ? 1 : 0));
