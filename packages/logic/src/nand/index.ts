import { and, andFn } from '../and';

/**
 * Logical non-conjunction (NAND) operation. Returns `false` only when both
 * operands are truthy, implementing the negation of Boolean AND.
 *
 * NAND is a universal logic gate - all other Boolean operations can be
 * constructed from NAND alone. This function provides a curried interface
 * with automatic type coercion to Boolean values.
 *
 * @template A - Type of the first operand
 * @template B - Type of the second operand
 *
 * @param a - First operand to evaluate
 * @param b - Second operand to evaluate
 *
 * @returns `false` if both operands are truthy, `true` otherwise
 *
 * @example
 * ```typescript
 * // Both true yields false
 * nand(true)(true);
 * // => false
 *
 * // Any false yields true
 * nand(true)(0);
 * // => true
 *
 * // Guard clause construction
 * const shouldProcess = nand(isLoading)(hasError);
 * ```
 *
 * @see {@link https://en.wikipedia.org/wiki/Sheffer_stroke | Sheffer Stroke (NAND)}
 * @see {@link nandFn} for function composition variant
 * @see {@link and} for the non-negated operation
 */
export const nand =
  <A>(a: A) =>
  <B>(b: B): boolean =>
    !(Boolean(a) && Boolean(b));

/**
 * Logical non-conjunction (NAND) over function results. Returns `false` only
 * when both predicates evaluate to truthy values, implementing the negation
 * of Boolean AND on predicate outputs.
 *
 * This higher-order function is useful for expressing negative conditions
 * in a composable way.
 *
 * @template T - Type of input value passed to both predicates
 * @template A - Return type of first predicate
 * @template B - Return type of second predicate
 *
 * @param a - First predicate function to evaluate
 * @param b - Second predicate function to evaluate
 * @param c - Input value passed to both predicates
 *
 * @returns `false` if both predicates return truthy values, `true` otherwise
 *
 * @example
 * ```typescript
 * // Validation: reject when both conditions fail
 * const hasWhitespace = (s: string) => /\s/.test(s);
 * const isEmpty = (s: string) => s.length === 0;
 * const isInvalid = nandFn(hasWhitespace)(isEmpty);
 *
 * isInvalid('foo bar');
 * // => false (both true)
 *
 * isInvalid('foobar');
 * // => true (first false)
 * ```
 *
 * @see {@link https://en.wikipedia.org/wiki/Sheffer_stroke | Sheffer Stroke (NAND)}
 * @see {@link nand} for value-level NAND
 * @see {@link andFn} for the non-negated operation
 */
export const nandFn =
  <T, A>(a: (x: T) => A) =>
  <B>(b: (y: T) => B) =>
  (c: T): boolean =>
    !(Boolean(a(c)) && Boolean(b(c)));
