import { describe, expect, it } from 'vitest';
import { or, orFn, swappedOr, swappedOrFn } from '.';

const isEven = (x: number) => !(x & 1);
const isOdd = (x: number) => !isEven(x);

describe('Or', () => {
  it('should return true for true || true', () => {
    expect(or(true)(true)).toEqual(true);
  });

  it('should return true for true || false', () => {
    expect(or(true)(false)).toEqual(true);
  });

  it('should return true for false || true', () => {
    expect(or(false)(true)).toEqual(true);
  });

  it('should return false for false || false', () => {
    expect(or(false)(false)).toEqual(false);
  });

  it('should treat 0 as false', () => {
    const a = 0;
    const b = 0;
    const actual = or(a)(b);

    expect(actual).toBe(false);
  });

  it('should treat non-zero as true with false', () => {
    const a = 42;
    const b = false;
    const actual = or(a)(b);

    expect(actual).toBe(true);
  });
});

describe('OrFn', () => {
  it('should return true for true || true', () => {
    expect(orFn(isEven)(isEven)(6)).toEqual(true);
  });

  it('should return true for false || true', () => {
    expect(orFn(isOdd)(isEven)(6)).toEqual(true);
  });

  it('should return true for true || false', () => {
    expect(orFn(isEven)(isOdd)(6)).toEqual(true);
  });

  it('should return false for false || false', () => {
    expect(orFn(isOdd)(isOdd)(6)).toEqual(false);
  });
});

describe('SwappedOr', () => {
  it('should return true for true || true', () => {
    expect(swappedOr(true)(true)).toEqual(true);
  });

  it('should return true for true || false', () => {
    expect(swappedOr(true)(false)).toEqual(true);
  });

  it('should return true for false || true', () => {
    expect(swappedOr(false)(true)).toEqual(true);
  });

  it('should return false for false || false', () => {
    expect(swappedOr(false)(false)).toEqual(false);
  });
});

describe('SwappedOrFn', () => {
  it('should return true for true || true', () => {
    expect(swappedOrFn(isEven)(isEven)(6)).toEqual(true);
  });

  it('should return true for false || true', () => {
    expect(swappedOrFn(isOdd)(isEven)(6)).toEqual(true);
  });

  it('should return true for true || false', () => {
    expect(swappedOrFn(isEven)(isOdd)(6)).toEqual(true);
  });

  it('should return false for false || false', () => {
    expect(swappedOrFn(isOdd)(isOdd)(6)).toEqual(false);
  });
});
