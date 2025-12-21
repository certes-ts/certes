import { describe, expect, it } from 'vitest';
import { nand, nandFn } from '.';

const isEven = (x: number) => !(x & 1);
const isOdd = (x: number) => !isEven(x);

describe('nand', () => {
  it('should return false for true && true', () => {
    expect(nand(true)(true)).toEqual(false);
  });

  it('should return true for true && false', () => {
    expect(nand(true)(false)).toEqual(true);
  });

  it('should return true for false && true', () => {
    expect(nand(false)(true)).toEqual(true);
  });

  it('should return true for false && false', () => {
    expect(nand(false)(false)).toEqual(true);
  });
});

describe('nandFn', () => {
  it('should return false for true && true', () => {
    expect(nandFn(isEven)(isEven)(6)).toEqual(false);
  });

  it('should return true for false && true', () => {
    expect(nandFn(isOdd)(isEven)(6)).toEqual(true);
  });

  it('should return true for true && false', () => {
    expect(nandFn(isEven)(isOdd)(6)).toEqual(true);
  });

  it('should return true for false && false', () => {
    expect(nandFn(isOdd)(isOdd)(6)).toEqual(true);
  });
});
