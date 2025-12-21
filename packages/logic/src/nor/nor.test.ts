import { describe, expect, it } from 'vitest';
import { nor, norFn } from '.';

const isEven = (x: number) => !(x & 1);
const isOdd = (x: number) => !isEven(x);

describe('nor', () => {
  it('should return false for true || true', () => {
    expect(nor(true)(true)).toEqual(false);
  });

  it('should return false for true || false', () => {
    expect(nor(true)(false)).toEqual(false);
  });

  it('should return false for false || true', () => {
    expect(nor(false)(true)).toEqual(false);
  });

  it('should return true for false || false', () => {
    expect(nor(false)(false)).toEqual(true);
  });
});

describe('norFn', () => {
  it('should return false for true || true', () => {
    expect(norFn(isEven)(isEven)(6)).toEqual(false);
  });

  it('should return false for false || true', () => {
    expect(norFn(isOdd)(isEven)(6)).toEqual(false);
  });

  it('should return false for true || false', () => {
    expect(norFn(isEven)(isOdd)(6)).toEqual(false);
  });

  it('should return true for false || false', () => {
    expect(norFn(isOdd)(isOdd)(6)).toEqual(true);
  });
});
