import { describe, expect, it } from 'vitest';
import { range } from '.';

describe('Range', () => {
  it('should yield integers from start to end inclusive', () => {
    const result = [...range(1, 5)];

    expect(result).toEqual([1, 2, 3, 4, 5]);
  });

  it('should yield a single value when start equals end', () => {
    const result = [...range(5, 5)];

    expect(result).toEqual([5]);
  });

  it('should yield negative numbers', () => {
    const result = [...range(-3, 2)];

    expect(result).toEqual([-3, -2, -1, 0, 1, 2]);
  });

  it('should yield an empty iterable when start is greater than end', () => {
    const result = [...range(5, 1)];

    expect(result).toEqual([]);
  });

  it('should be reusable across multiple iterations', () => {
    const r = range(1, 3);

    const first = [...r];
    const second = [...r];

    expect(first).toEqual([1, 2, 3]);
    expect(second).toEqual([1, 2, 3]);
  });

  // Negative space
  it('should throw TypeError when start is not a safe integer', () => {
    expect(() => range(1.5, 5)).toThrow(TypeError);
    expect(() => range(1.5, 5)).toThrow(
      'range() requires safe integers for start and end',
    );
  });

  it('should throw TypeError when end is not a safe integer', () => {
    expect(() => range(1, 5.5)).toThrow(TypeError);
    expect(() => range(1, 5.5)).toThrow(
      'range() requires safe integers for start and end',
    );
  });

  it('should throw TypeError when start is Infinity', () => {
    // biome-ignore lint/style/useNumberNamespace: For testing
    expect(() => range(Infinity, 5)).toThrow(TypeError);
  });

  it('should throw TypeError when end is Infinity', () => {
    // biome-ignore lint/style/useNumberNamespace: For testing
    expect(() => range(1, Infinity)).toThrow(TypeError);
  });

  it('should throw TypeError when start is NaN', () => {
    // biome-ignore lint/style/useNumberNamespace: For testing
    expect(() => range(NaN, 5)).toThrow(TypeError);
  });

  it('should throw TypeError when end is NaN', () => {
    // biome-ignore lint/style/useNumberNamespace: For testing
    expect(() => range(1, NaN)).toThrow(TypeError);
  });

  it('should throw TypeError when start exceeds MAX_SAFE_INTEGER', () => {
    expect(() => range(Number.MAX_SAFE_INTEGER + 1, 5)).toThrow(TypeError);
  });
});
