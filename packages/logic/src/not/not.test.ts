import { describe, expect, it } from 'vitest';
import { not, notFn } from '.';

const isEven = (x: number) => !(x & 1);
const isOdd = (x: number) => !isEven(x);

describe('Not', () => {
  it('should return false for !true', () => {
    expect(not(true)).toEqual(false);
  });

  it('should return true for !false', () => {
    expect(not(false)).toEqual(true);
  });

  it('should convert truthy values correctly', () => {
    const values = [1, 'hello', {}, [], -1];

    values.forEach((val) => {
      expect(not(val)).toBe(false);
    });
  });

  it('should convert falsy values correctly', () => {
    const values = [0, '', null, undefined, Number.NaN];

    values.forEach((val) => {
      expect(not(val)).toBe(true);
    });
  });
});

describe('NotFn', () => {
  it('should return false for !true', () => {
    expect(notFn(isEven)(6)).toEqual(false);
  });

  it('should return true for !false', () => {
    expect(notFn(isOdd)(6)).toEqual(true);
  });
});
