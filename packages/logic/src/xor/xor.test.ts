import { describe, expect, it } from 'vitest';
import { xor, xorFn } from '.';

const isEven = (x: number) => !(x & 1);
const isOdd = (x: number) => !isEven(x);

describe('xor', () => {
  describe('basic functionality', () => {
    it('should return true for true | false', () => {
      const actual = xor(true)(false);

      expect(actual).toBe(true);
    });

    it('should return true for false | true', () => {
      const actual = xor(false)(true);

      expect(actual).toBe(true);
    });

    it('should return false for true | true', () => {
      const actual = xor(true)(true);

      expect(actual).toBe(false);
    });

    it('should return false for false | false', () => {
      const actual = xor(false)(false);

      expect(actual).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should handle truthy non-boolean values', () => {
      const a = 'hello';
      const b = 42;
      const actual = xor(a)(b);

      expect(actual).toBe(false); // Both truthy
    });

    it('should handle mixed truthy/falsy', () => {
      const a = 0;
      const b = 'hello';
      const actual = xor(a)(b);

      expect(actual).toBe(true); // Exactly one truthy
    });
  });
});

describe('xorFn', () => {
  it('should return true for true | false', () => {
    const actual = xorFn(isEven)(isOdd)(4);

    expect(actual).toBe(true);
  });

  it('should return true for false | true', () => {
    const actual = xorFn(isOdd)(isEven)(4);

    expect(actual).toBe(true);
  });

  it('should return false for true | true', () => {
    const actual = xorFn(isEven)(isEven)(4);

    expect(actual).toBe(false);
  });

  it('should return false for false | false', () => {
    const actual = xorFn(isOdd)(isOdd)(4);

    expect(actual).toBe(false);
  });
});
