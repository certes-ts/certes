import { describe, expect, it } from 'vitest';
import { equality, equalityFn } from '.';

const isEven = (x: number) => !(x & 1);
const isOdd = (x: number) => !isEven(x);

describe('Equality', () => {
  it('should return true for true === true', () => {
    expect(equality(true)(true)).toEqual(true);
  });

  it('should return false for true === false', () => {
    expect(equality(true)(false)).toEqual(false);
  });

  it('should return false for false === true', () => {
    expect(equality(false)(true)).toEqual(false);
  });

  it('should return true for false === false', () => {
    expect(equality(false)(false)).toEqual(true);
  });

  it('should handle NaN correctly', () => {
    const a = Number.NaN;
    const b = Number.NaN;
    const actual = equality(a)(b);

    expect(actual).toBe(false); // NaN !== NaN in JavaScript
  });

  it('should differentiate +0 and -0', () => {
    const a = +0;
    const b = -0;
    const actual = equality(a)(b);

    expect(actual).toBe(true); // +0 === -0 in JavaScript
  });

  it('should handle object reference equality', () => {
    const obj = { x: 1 };
    const actual = equality(obj)(obj);

    expect(actual).toBe(true);
  });

  it('should fail for different object instances', () => {
    const a = { x: 1 };
    const b = { x: 1 };
    const actual = equality(a)(b);

    expect(actual).toBe(false);
  });
});

describe('EqualityFn', () => {
  it('should return true for true === true', () => {
    expect(equalityFn(isEven)(isEven)(6)).toEqual(true);
  });

  it('should return false for false === true', () => {
    expect(equalityFn(isOdd)(isEven)(6)).toEqual(false);
  });

  it('should return false for true === false', () => {
    expect(equalityFn(isEven)(isOdd)(6)).toEqual(false);
  });

  it('should return true for false === false', () => {
    expect(equalityFn(isOdd)(isOdd)(6)).toEqual(true);
  });
});
