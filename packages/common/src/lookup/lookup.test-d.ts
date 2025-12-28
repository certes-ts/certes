import { describe, expectTypeOf, it } from 'vitest';
import { lookup } from '.';

describe('Lookup', () => {
  it('should narrow to exact type for known literal keys', () => {
    const colorTable = {
      FOO: [0, 0, 255, 155] as const,
      BAR: [255, 0, 255, 155] as const,
      FIZZ: [230, 0, 0, 155] as const,
    } as const;

    const directLookup = lookup(colorTable);
    const withDefault = lookup(colorTable, () => [128, 128, 128, 155] as const);

    // Known literal key - should narrow to exact type
    expectTypeOf(directLookup('FOO')).toEqualTypeOf<
      readonly [0, 0, 255, 155]
    >();
    expectTypeOf(directLookup('BAR')).toEqualTypeOf<
      readonly [255, 0, 255, 155]
    >();

    expectTypeOf(withDefault('FOO')).toEqualTypeOf<readonly [0, 0, 255, 155]>();
    expectTypeOf(withDefault('FIZZ')).toEqualTypeOf<
      readonly [230, 0, 0, 155]
    >();
  });

  it('should return undefined for unknown literal keys without default', () => {
    const colorTable = {
      FOO: [0, 0, 255, 155] as const,
      BAR: [255, 0, 255, 155] as const,
    } as const;

    const directLookup = lookup(colorTable);

    // Unknown literal key - should be undefined
    expectTypeOf(directLookup('MISSING')).toEqualTypeOf<undefined>();
    expectTypeOf(directLookup('NOPE')).toEqualTypeOf<undefined>();
  });

  it('should return default type for unknown literal keys with default', () => {
    const colorTable = {
      FOO: [0, 0, 255, 155] as const,
      BAR: [255, 0, 255, 155] as const,
    } as const;

    const defaultColor = [128, 128, 128, 155] as const;
    const withDefault = lookup(colorTable, () => defaultColor);

    // Unknown literal key - should be the default type
    expectTypeOf(withDefault('MISSING')).toEqualTypeOf<
      readonly [128, 128, 128, 155]
    >();
    expectTypeOf(withDefault('NOPE')).toEqualTypeOf<
      readonly [128, 128, 128, 155]
    >();
  });

  it('should return union type for dynamic keys without default', () => {
    const colorTable = {
      FOO: [0, 0, 255, 155] as const,
      BAR: [255, 0, 255, 155] as const,
    } as const;

    const directLookup = lookup(colorTable);

    // Dynamic string key - should be union of all values | undefined
    const dynamicKey: string = 'FOO';
    expectTypeOf(directLookup(dynamicKey)).toEqualTypeOf<
      readonly [0, 0, 255, 155] | readonly [255, 0, 255, 155] | undefined
    >();
  });

  it('should return union type for dynamic keys with default', () => {
    const colorTable = {
      FOO: [0, 0, 255, 155] as const,
      BAR: [255, 0, 255, 155] as const,
    } as const;

    const defaultColor = [128, 128, 128, 155] as const;
    const withDefault = lookup(colorTable, () => defaultColor);

    // Dynamic string key - should be union of all values | default type
    const dynamicKey: string = 'FOO';
    expectTypeOf(withDefault(dynamicKey)).toEqualTypeOf<
      | readonly [0, 0, 255, 155]
      | readonly [255, 0, 255, 155]
      | readonly [128, 128, 128, 155]
    >();
  });

  it('should handle numeric keys correctly', () => {
    const statusCodes = {
      200: 'OK' as const,
      404: 'Not Found' as const,
      500: 'Internal Server Error' as const,
    } as const;

    const getStatus = lookup(statusCodes, () => 'Unknown' as const);

    // Known numeric literal
    expectTypeOf(getStatus(200)).toEqualTypeOf<'OK'>();
    expectTypeOf(getStatus(404)).toEqualTypeOf<'Not Found'>();

    // Unknown numeric literal
    expectTypeOf(getStatus(999)).toEqualTypeOf<'Unknown'>();

    // Dynamic number
    const code: number = 200;
    expectTypeOf(getStatus(code)).toEqualTypeOf<
      'OK' | 'Not Found' | 'Internal Server Error' | 'Unknown'
    >();
  });

  it('should handle symbol keys correctly', () => {
    const sym1 = Symbol('test');
    const sym2 = Symbol('other');

    const symbolTable = {
      [sym1]: 'found' as const,
    } as const;

    const symLookup = lookup(symbolTable, () => 'not-found' as const);

    // Known symbol literal
    expectTypeOf(symLookup(sym1)).toEqualTypeOf<'found'>();

    // Unknown symbol literal
    expectTypeOf(symLookup(sym2 as typeof sym2)).toEqualTypeOf<'not-found'>();
  });

  it('should preserve const assertion types', () => {
    const config = {
      apiUrl: 'https://api.example.com' as const,
      timeout: 5000 as const,
      enabled: true as const,
    } as const;

    const getConfig = lookup(config);

    // Each key should preserve its exact literal type
    expectTypeOf(
      getConfig('apiUrl'),
    ).toEqualTypeOf<'https://api.example.com'>();
    expectTypeOf(getConfig('timeout')).toEqualTypeOf<5000>();
    expectTypeOf(getConfig('enabled')).toEqualTypeOf<true>();
  });

  it('should handle default function with type transformation', () => {
    const numberTable = {
      one: 1,
      two: 2,
      three: 3,
    } as const;

    // Default function transforms undefined to string
    const getLookup = lookup(numberTable, (x: 1 | 2 | 3 | undefined) =>
      x === undefined ? 'unknown' : x.toString(),
    );

    // Known key should still return the original number type
    expectTypeOf(getLookup('one')).toEqualTypeOf<1>();

    // Unknown key should return the default type (string)
    expectTypeOf(getLookup('four')).toEqualTypeOf<string>();

    // Dynamic key should be union of both
    const key: string = 'one';
    expectTypeOf(getLookup(key)).toEqualTypeOf<1 | 2 | 3 | string>();
  });

  it('should handle mutable vs immutable tables', () => {
    // Mutable table (no const assertion)
    const mutableTable = {
      foo: [1, 2, 3],
      bar: [4, 5, 6],
    };

    const mutableLookup = lookup(mutableTable);

    // Should return mutable array type
    expectTypeOf(mutableLookup('foo')).toEqualTypeOf<number[]>();

    // Immutable table (with const assertion)
    const immutableTable = {
      foo: [1, 2, 3] as const,
      bar: [4, 5, 6] as const,
    } as const;

    const immutableLookup = lookup(immutableTable);

    // Should return exact readonly tuple type
    expectTypeOf(immutableLookup('foo')).toEqualTypeOf<readonly [1, 2, 3]>();
  });
});
