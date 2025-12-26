import { describe, expect, it } from 'vitest';
import { lookup } from '.';

type Color = [number, number, number] | [number, number, number, number];

const defaultVal =
  <T>(x: T) =>
  (val: unknown) =>
    val ?? x;

const colorTable = {
  FOO: [0, 0, 255, 155] as Color,
  BAR: [255, 0, 255, 155] as Color,
  FIZZ: [230, 0, 0, 155] as Color,
  BUZZ: [0, 128, 0, 155] as Color,
  TEST: null as unknown as Color,
};

const defaultColor: Color = [128, 128, 128, 155];
const colorLookup = lookup(colorTable, defaultVal(defaultColor));
const undefLookup = lookup(colorTable);

describe('Lookup', () => {
  it('should return the selected value', () => {
    const actualOne = colorLookup('NOPE');
    const actualTwo = colorLookup('BUZZ');

    expect(actualOne).toEqual(defaultColor);
    expect(actualTwo).toEqual(colorTable.BUZZ);
  });

  it('should return the default value for null props', () => {
    const actual = colorLookup('TEST');

    expect(actual).toEqual(defaultColor);
  });

  it('should return the default value for unknown props', () => {
    const actual = colorLookup('UNKNOWN');

    expect(actual).toEqual(defaultColor);
  });

  it('should use identity for undefined default', () => {
    const actualOne = undefLookup('UNKNOWN');
    const actualTwo = undefLookup('BAR');

    expect(actualOne).not.toBeDefined();
    expect(actualTwo).toEqual(colorTable.BAR);
  });

  it('should handle numeric keys', () => {
    const numericTable = { 0: 'zero', 1: 'one', 2: 'two' };
    const numLookup = lookup(numericTable, defaultVal('unknown'));

    expect(numLookup(1)).toEqual('one');
    expect(numLookup(99)).toEqual('unknown');
  });

  it('should handle symbol keys', () => {
    const sym1 = Symbol('test');
    const sym2 = Symbol('other');
    const symbolTable = { [sym1]: 'found' };
    const symLookup = lookup(symbolTable, defaultVal('not-found'));

    expect(symLookup(sym1)).toEqual('found');
    expect(symLookup(sym2)).toEqual('not-found');
  });

  it('should return undefined when no default and key missing', () => {
    const noDefaultLookup = lookup(colorTable);

    expect(noDefaultLookup('MISSING')).toBeUndefined();
  });
});
