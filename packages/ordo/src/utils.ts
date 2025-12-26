/**
 * Asserts that a value is not undefined.
 *
 * Uses TypeScript's assertion signature to narrow the type, eliminating
 * undefined from the type union.
 *
 * @template T - The expected type of the value
 * @param value - The value to check
 * @throws {Error} If value is undefined
 *
 * @example
 * ```typescript
 * const value = arr[index];
 * assertDefined(value);
 * // TypeScript now knows value is T, not T | undefined
 * return value;
 * ```
 */
export function assertDefined<T>(value: T | undefined): asserts value is T {
  if (value === undefined) {
    throw new Error('Unexpected undefined value');
  }
}
