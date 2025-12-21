/**
 * Logical disjunction (OR) operation implementing Boolean OR semantics with
 * automatic type coercion. Returns `true` when at least one operand is truthy.
 *
 * This function provides a curried interface to JavaScript's `||` operator,
 * enabling partial application and composition. All operands are coerced to
 * Boolean values before evaluation.
 *
 * @template A - Type of the first operand
 * @template B - Type of the second operand
 *
 * @param a - First operand to evaluate
 * @param b - Second operand to evaluate
 *
 * @returns `true` if at least one operand is truthy, `false` otherwise
 *
 * @example
 * ```typescript
 * // At least one true
 * or(true)(false);
 * // => true
 *
 * // Both false
 * or(0)(false);
 * // => false
 *
 * // Partial application for default values
 * const hasValueOrDefault = or(userInput);
 * hasValueOrDefault(defaultValue);
 * ```
 *
 * @see {@link https://en.wikipedia.org/wiki/Logical_disjunction | Logical Disjunction}
 * @see {@link orFn} for function composition variant
 * @see {@link swappedOr} for reversed argument order
 * @see {@link nullishOr} for nullish-only coalescing
 */
export const or =
  <A>(a: A) =>
  <B>(b: B): boolean =>
    Boolean(a) || Boolean(b);

/**
 * Logical disjunction (OR) over function results, implementing predicate
 * composition via Boolean OR semantics. Returns `true` when at least one
 * predicate evaluates to a truthy value.
 *
 * This higher-order function enables composing predicates with OR logic,
 * useful for building flexible validation that accepts multiple conditions.
 *
 * @template T - Type of input value passed to both predicates
 * @template A - Return type of first predicate
 * @template B - Return type of second predicate
 *
 * @param a - First predicate function to evaluate
 * @param b - Second predicate function to evaluate
 * @param c - Input value passed to both predicates
 *
 * @returns `true` if at least one predicate returns truthy value, `false` otherwise
 *
 * @example
 * ```typescript
 * // Multiple validation conditions
 * const isAdmin = (user: User) => user.role === 'admin';
 * const isOwner = (user: User) => user.isOwner;
 * const canEdit = orFn(isAdmin)(isOwner);
 *
 * canEdit({ role: 'user', isOwner: true });
 * // => true
 *
 * // Range validation
 * const isTooSmall = (x: number) => x < 10;
 * const isTooLarge = (x: number) => x > 100;
 * const isOutOfRange = orFn(isTooSmall)(isTooLarge);
 *
 * isOutOfRange(5);
 * // => true
 * ```
 *
 * @see {@link https://en.wikipedia.org/wiki/Logical_disjunction | Logical Disjunction}
 * @see {@link or} for value-level disjunction
 * @see {@link swappedOrFn} for reversed argument order
 */
export const orFn =
  <T, A>(a: (x: T) => A) =>
  <B>(b: (y: T) => B) =>
  (c: T): boolean =>
    Boolean(a(c)) || Boolean(b(c));

/**
 * Swapped logical disjunction (OR) operation. Returns `true` when at least
 * one operand is truthy, with arguments in reversed order compared to `or`.
 *
 * This is the argument-reversed variant of `or`, useful for partial application
 * scenarios where the fallback value should be applied first.
 *
 * @template A - Type of the first operand (fallback)
 * @template B - Type of the second operand (primary)
 *
 * @param a - Fallback operand
 * @param b - Primary operand
 *
 * @returns `true` if at least one operand is truthy, `false` otherwise
 *
 * @example
 * ```typescript
 * // Partial application with default
 * const orDefault = swappedOr(true);
 * orDefault(false);
 * // => true
 *
 * // Array mapping with defaults
 * const flags = [false, null, true];
 * flags.map(swappedOr(true));
 * // => [true, true, true]
 * ```
 *
 * @see {@link https://en.wikipedia.org/wiki/Logical_disjunction | Logical Disjunction}
 * @see {@link or} for standard argument order
 * @see {@link swappedOrFn} for function composition variant
 */
export const swappedOr =
  <A>(a: A) =>
  <B>(b: B): boolean =>
    Boolean(b) || Boolean(a);

/**
 * Swapped logical disjunction (OR) over function results. Returns `true` when
 * at least one predicate evaluates to a truthy value, with arguments in
 * reversed order compared to `orFn`.
 *
 * This is the argument-reversed variant of `orFn`, useful when the fallback
 * predicate should be specified first.
 *
 * @template T - Type of input value passed to both predicates
 * @template A - Return type of first predicate (fallback)
 * @template B - Return type of second predicate (primary)
 *
 * @param a - Fallback predicate function to evaluate
 * @param b - Primary predicate function to evaluate
 * @param c - Input value passed to both predicates
 *
 * @returns `true` if at least one predicate returns truthy value, `false` otherwise
 *
 * @example
 * ```typescript
 * // Define fallback predicate first
 * const alwaysTrue = (_: unknown) => true;
 * const isPositive = (x: number) => x > 0;
 * const isValid = swappedOrFn(alwaysTrue)(isPositive);
 *
 * isValid(-5);
 * // => true
 * ```
 *
 * @see {@link https://en.wikipedia.org/wiki/Logical_disjunction | Logical Disjunction}
 * @see {@link swappedOr} for value-level swapped disjunction
 * @see {@link orFn} for standard argument order
 */
export const swappedOrFn =
  <T, A>(a: (x: T) => A) =>
  <B>(b: (y: T) => B) =>
  (c: T): boolean =>
    Boolean(b(c)) || Boolean(a(c));
