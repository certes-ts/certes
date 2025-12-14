import { identity } from '@certes/combinator/i';

/**
 * Creates a lookup function that retrieves values from a record with optional default handling.
 *
 * This is a curried function that first takes a lookup table and optional default handler,
 * then returns a function that performs the actual property lookup.
 *
 * @template A - The record type used as the lookup table. Must extend Record<string | number | symbol, unknown>.
 * @template B - The type of the default handler function. Must be a function that accepts unknown and returns unknown.
 *
 * @param obj - The lookup table record.
 * @param def - Optional function to handle missing or undefined values. Receives the looked-up value (possibly undefined) and returns a default. If not provided, uses identity function.
 *
 * @returns A lookup function that accepts a property key and returns the associated value or default.
 *
 * @remarks
 * Pure function. The returned lookup function accepts `string | number | symbol` keys, allowing
 * lookups of properties that may not exist in the type definition. When a key doesn't exist,
 * the default function receives `undefined`.
 *
 * Type signature: `(Record<K, V>, (V | undefined -> W)?) -> (K -> W | V)`
 *
 * @example
 * const colorTable = {
 *   FOO: [0, 0, 255, 155],
 *   BAR: [255, 0, 255, 155],
 *   FIZZ: [230, 0, 0, 155],
 *   BUZZ: [0, 128, 0, 155],
 * };
 *
 * const colorLookup = lookup(colorTable, x => x ?? [128, 128, 128, 155]);
 *
 * colorLookup('FOO');     // [0, 0, 255, 155]
 * colorLookup('MISSING'); // [128, 128, 128, 155] (default)
 */
export const lookup =
  <
    A extends Record<string | number | symbol, unknown>,
    // biome-ignore lint/suspicious/noExplicitAny: This is intended
    B extends (...args: any[]) => any,
  >(
    obj: A,
    def?: B,
  ) =>
  <C extends keyof A>(prop: string | number | symbol): A[C] => {
    const fn = def ?? identity;
    const value = Object.hasOwn(obj, prop) ? obj[prop as keyof A] : undefined;

    return fn(value);
  };
