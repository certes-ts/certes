import { identity } from '@certes/combinator/i';

/**
 * The value type of a record.
 */
type ValueOf<T> = T[keyof T];

/**
 * Checks if a PropertyKey is a literal type (not the wide `string`, `number`, or `symbol`).
 */
type IsLiteralKey<K extends PropertyKey> = string extends K
  ? false
  : number extends K
    ? false
    : symbol extends K
      ? false
      : true;

/**
 * Creates a lookup function that retrieves values from a record with optional default handling.
 *
 * This is a curried function that first takes a lookup table and optional default handler,
 * then returns a function that performs the actual property lookup.
 *
 * @template T - The record type used as the lookup table.
 *
 * @param obj - The lookup table record.
 * @param def - Optional function to handle values (including undefined for missing keys).
 *              Receives the looked-up value and returns a transformed result.
 *              If not provided, uses identity function.
 *
 * @returns A lookup function with intelligent return type narrowing:
 *          - Known literal key (`'FOO'`): exact type `T[K]`
 *          - Unknown literal key (`'MISSING'`): `R` (with default) or `undefined` (without)
 *          - Dynamic key (`string`): `ValueOf<T> | R` or `ValueOf<T> | undefined`
 *
 * @example
 * ```ts
 * const colorTable = {
 *   FOO: [0, 0, 255, 155],
 *   BAR: [255, 0, 255, 155],
 * } as const;
 *
 * const colorLookup = lookup(colorTable, () => [128, 128, 128, 155] as const);
 *
 * // Known literal key - narrows to exact type
 * colorLookup('FOO');     // readonly [0, 0, 255, 155]
 *
 * // Unknown literal key - only the default
 * colorLookup('MISSING'); // readonly [128, 128, 128, 155]
 *
 * // Dynamic key - union of all possibilities
 * const key: string = getKey();
 * colorLookup(key);       // ValueOf<T> | readonly [128, 128, 128, 155]
 *
 * // Without default
 * const directLookup = lookup(colorTable);
 * directLookup('FOO');     // readonly [0, 0, 255, 155]
 * directLookup('MISSING'); // undefined
 * directLookup(key);       // ValueOf<T> | undefined
 * ```
 */
export function lookup<T extends Record<PropertyKey, unknown>>(
  obj: T,
): (<K extends keyof T>(prop: K) => T[K]) &
  (<K extends PropertyKey>(
    prop: IsLiteralKey<K> extends true ? Exclude<K, keyof T> : never,
  ) => undefined) &
  ((prop: PropertyKey) => ValueOf<T> | undefined);

export function lookup<T extends Record<PropertyKey, unknown>, R>(
  obj: T,
  def: (value: ValueOf<T> | undefined) => R,
): (<K extends keyof T>(prop: K) => T[K]) &
  (<K extends PropertyKey>(
    prop: IsLiteralKey<K> extends true ? Exclude<K, keyof T> : never,
  ) => R) &
  ((prop: PropertyKey) => ValueOf<T> | R);

export function lookup<T extends Record<PropertyKey, unknown>, R>(
  obj: T,
  def?: (value: ValueOf<T> | undefined) => R,
): (prop: PropertyKey) => ValueOf<T> | undefined | R {
  const fn = def ?? identity;

  return (prop: PropertyKey): ValueOf<T> | undefined | R => {
    const value = Object.hasOwn(obj, prop)
      ? (obj[prop as keyof T] as ValueOf<T>)
      : undefined;

    return fn(value);
  };
}
