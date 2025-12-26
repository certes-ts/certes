import { describe, expect, it } from 'vitest';
import { and, andFn } from '.';

const isEven = (x: number) => !(x & 1);
const isOdd = (x: number) => !isEven(x);

describe('And', () => {
  it('should return true for true && true', () => {
    expect(and(true)(true)).toEqual(true);
  });

  it('should return false for true && false', () => {
    expect(and(true)(false)).toEqual(false);
  });

  it('should return false for false && true', () => {
    expect(and(false)(true)).toEqual(false);
  });

  it('should return false for false && false', () => {
    expect(and(false)(false)).toEqual(false);
  });

  it('should treat 0 as false', () => {
    const actual = and(0)(1);
    expect(actual).toBe(false);
  });

  it('should treat empty string as false', () => {
    const actual = and('')(1);
    expect(actual).toBe(false);
  });

  it('should treat undefined as false', () => {
    const actual = and(undefined)(1);
    expect(actual).toBe(false);
  });

  it('should treat null as false', () => {
    const actual = and(null)(1);
    expect(actual).toBe(false);
  });

  it('should treat non-empty string as true', () => {
    const actual = and('hello')('world');
    expect(actual).toBe(true);
  });

  it('should treat non-zero number as true', () => {
    const actual = and(42)(7);
    expect(actual).toBe(true);
  });
});

describe('AndFn', () => {
  it('should return true for true && true', () => {
    expect(andFn(isEven)(isEven)(6)).toEqual(true);
  });

  it('should return false for false && true', () => {
    expect(andFn(isOdd)(isEven)(6)).toEqual(false);
  });

  it('should return false for true && false', () => {
    expect(andFn(isEven)(isOdd)(6)).toEqual(false);
  });

  it('should return false for false && false', () => {
    expect(andFn(isOdd)(isOdd)(6)).toEqual(false);
  });
});
