/**
 * A no-operation function that accepts any argument and returns undefined.
 *
 * @param _x - Optional argument of any type (ignored).
 *
 * @remarks
 * Pure function with no side effects. Useful as a placeholder callback or default handler.
 *
 * Type signature: `a? -> ()`
 *
 * @example
 * const handler = shouldLog ? console.log : noop;
 * handler('message'); // Only logs if shouldLog is true
 */
// biome-ignore lint/suspicious/noEmptyBlockStatements: It is intentional
export const noop = (_x?: unknown) => {};
