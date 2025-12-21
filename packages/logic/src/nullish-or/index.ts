/**
 * Nullish coalescing operation implementing JavaScript's `??` operator.
 * Returns the first operand unless it is `null` or `undefined`, in which
 * case it returns the second operand.
 *
 * Unlike logical OR (`||`), this operation only treats `null` and `undefined`
 * as nullish, preserving falsy values like `0`, `false`, and `''`.
 *
 * @template A - Type of the first operand
 * @template B - Type of the second operand
 *
 * @param a - Primary value to check for nullishness
 * @param b - Fallback value if primary is nullish
 *
 * @returns First operand if not nullish, otherwise second operand
 *
 * @example
 * ```typescript
 * // Non-nullish value is returned
 * nullishOr(42)(0);
 * // => 42
 *
 * // Null falls back to second value
 * nullishOr(null)(0);
 * // => 0
 *
 * // Preserves falsy values
 * nullishOr(0)(100);
 * // => 0
 *
 * // Configuration with defaults
 * const getTimeout = nullishOr(config.timeout)(5000);
 * ```
 *
 * @see {@link nullishOrFn} for function composition variant
 * @see {@link swappedNullishOr} for reversed argument order
 * @see {@link or} for falsy-based coalescing
 */
export const nullishOr =
  <A>(a: A) =>
  <B>(b: B): A | B =>
    a ?? b;

/**
 * Nullish coalescing over function results. Returns the first function's
 * result unless it is `null` or `undefined`, in which case it returns the
 * second function's result.
 *
 * This higher-order function enables nullish coalescing with computed values,
 * only invoking the fallback function if the primary function returns nullish.
 *
 * @template T - Type of input value passed to both functions
 * @template A - Return type of first function
 * @template B - Return type of second function
 *
 * @param a - Primary function to evaluate
 * @param b - Fallback function to evaluate if primary returns nullish
 * @param c - Input value passed to both functions
 *
 * @returns First function's result if not nullish, otherwise second function's result
 *
 * @example
 * ```typescript
 * // Property access with fallback
 * type Config = { timeout?: number; maxRetries?: number };
 * const getTimeout = nullishOrFn(
 *   (c: Config) => c.timeout,
 *   (c: Config) => c.maxRetries
 * );
 *
 * getTimeout({ maxRetries: 3 });
 * // => 3
 *
 * // Chained lookups
 * const getValue = nullishOrFn(
 *   (x: Record<string, unknown>) => x.primary,
 *   (x: Record<string, unknown>) => x.secondary
 * );
 * ```
 *
 * @see {@link nullishOr} for value-level nullish coalescing
 * @see {@link swappedNullishOrFn} for reversed argument order
 */
export const nullishOrFn =
  <T, A>(a: (x: T) => A) =>
  <B>(b: (y: T) => B) =>
  (c: T): A | B =>
    a(c) ?? b(c);

/**
 * Swapped nullish coalescing operation. Returns the second operand unless
 * it is `null` or `undefined`, in which case it returns the first operand.
 *
 * This is the argument-reversed variant of `nullishOr`, useful for
 * partial application scenarios where the default value should be
 * applied first.
 *
 * @template A - Type of the first operand (fallback)
 * @template B - Type of the second operand (primary)
 *
 * @param a - Fallback value if primary is nullish
 * @param b - Primary value to check for nullishness
 *
 * @returns Second operand if not nullish, otherwise first operand
 *
 * @example
 * ```typescript
 * // Partial application with default
 * const withDefault = swappedNullishOr(42);
 * withDefault(null);
 * // => 42
 *
 * withDefault(7);
 * // => 7
 *
 * // Array mapping with defaults
 * const values: (number | null)[] = [1, null, 3];
 * values.map(swappedNullishOr(0));
 * // => [1, 0, 3]
 * ```
 *
 * @see {@link nullishOr} for standard argument order
 * @see {@link swappedNullishOrFn} for function composition variant
 */
export const swappedNullishOr =
  <A>(a: A) =>
  <B>(b: B): A | B =>
    b ?? a;

/**
 * Swapped nullish coalescing over function results. Returns the second
 * function's result unless it is `null` or `undefined`, in which case it
 * returns the first function's result.
 *
 * This is the argument-reversed variant of `nullishOrFn`, useful when
 * the fallback computation should be specified first.
 *
 * @template T - Type of input value passed to both functions
 * @template A - Return type of first function (fallback)
 * @template B - Return type of second function (primary)
 *
 * @param a - Fallback function to evaluate if primary returns nullish
 * @param b - Primary function to evaluate
 * @param c - Input value passed to both functions
 *
 * @returns Second function's result if not nullish, otherwise first function's result
 *
 * @example
 * ```typescript
 * // Define default computation first
 * const getValue = swappedNullishOrFn(
 *   (_: Config) => 5000,
 *   (c: Config) => c.timeout
 * );
 *
 * getValue({ timeout: null });
 * // => 5000
 * ```
 *
 * @see {@link swappedNullishOr} for value-level swapped coalescing
 * @see {@link nullishOrFn} for standard argument order
 */
export const swappedNullishOrFn =
  <T, A>(a: (x: T) => A) =>
  <B>(b: (y: T) => B) =>
  (c: T): A | B =>
    b(c) ?? a(c);
