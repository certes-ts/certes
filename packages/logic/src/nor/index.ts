import { or, orFn } from '../or';

/**
 * Logical non-disjunction (NOR) operation. Returns `true` only when both
 * operands are falsy, implementing the negation of Boolean OR.
 *
 * NOR is a universal logic gate - all other Boolean operations can be
 * constructed from NOR alone. This function provides a curried interface
 * with automatic type coercion to Boolean values.
 *
 * @template A - Type of the first operand
 * @template B - Type of the second operand
 *
 * @param a - First operand to evaluate
 * @param b - Second operand to evaluate
 *
 * @returns `true` if both operands are falsy, `false` otherwise
 *
 * @example
 * ```typescript
 * // Both false yields true
 * nor(false)(0);
 * // => true
 *
 * // Any true yields false
 * nor(true)(false);
 * // => false
 *
 * // Default state detection
 * const isDefault = nor(hasCustomTheme)(hasUserPreferences);
 * ```
 *
 * @see {@link https://en.wikipedia.org/wiki/Logical_NOR | Logical NOR}
 * @see {@link norFn} for function composition variant
 * @see {@link or} for the non-negated operation
 */
export const nor =
  <A>(a: A) =>
  <B>(b: B): boolean =>
    !(Boolean(a) || Boolean(b));

/**
 * Logical non-disjunction (NOR) over function results. Returns `true` only
 * when both predicates evaluate to falsy values, implementing the negation
 * of Boolean OR on predicate outputs.
 *
 * This higher-order function is useful for detecting the absence of multiple
 * conditions simultaneously.
 *
 * @template T - Type of input value passed to both predicates
 * @template A - Return type of first predicate
 * @template B - Return type of second predicate
 *
 * @param a - First predicate function to evaluate
 * @param b - Second predicate function to evaluate
 * @param c - Input value passed to both predicates
 *
 * @returns `true` if both predicates return falsy values, `false` otherwise
 *
 * @example
 * ```typescript
 * // Validation: accept only when both conditions fail
 * const hasSpecialChars = (s: string) => /[^a-zA-Z0-9]/.test(s);
 * const hasSpaces = (s: string) => /\s/.test(s);
 * const isSimpleString = norFn(hasSpecialChars)(hasSpaces);
 *
 * isSimpleString('hello123');
 * // => true (both false)
 *
 * isSimpleString('hello world');
 * // => false (second true)
 * ```
 *
 * @see {@link https://en.wikipedia.org/wiki/Logical_NOR | Logical NOR}
 * @see {@link nor} for value-level NOR
 * @see {@link orFn} for the non-negated operation
 */
export const norFn =
  <T, A>(a: (x: T) => A) =>
  <B>(b: (y: T) => B) =>
  (c: T): boolean =>
    !(Boolean(a(c)) || Boolean(b(c)));
