import { describe, expect, it } from 'vitest';
import { range } from '.';

const expected = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

describe('range', () => {
  it('should iterate through the range given', () => {
    const actual: number[] = [];

    for (const x of range(1, 10)) {
      actual.push(x);
    }

    expect(actual).toStrictEqual(expected);
  });

  it('should spread into the correct array', () => {
    const actual = [...range(1, 10)];

    expect(actual).toStrictEqual(expected);
  });

  it('should handle single value range', () => {
    const actual = [...range(5, 5)];
    expect(actual).toEqual([5]);
  });

  it('should handle negative ranges', () => {
    const actual = [...range(-3, 2)];
    expect(actual).toEqual([-3, -2, -1, 0, 1, 2]);
  });

  it('should return empty for backwards range', () => {
    const actual = [...range(10, 1)];
    expect(actual).toEqual([]);
  });

  it('should be reusable across multiple iterations', () => {
    const r = range(1, 3);
    const first = [...r];
    const second = [...r];

    expect(first).toEqual([1, 2, 3]);
    expect(second).toEqual([1, 2, 3]);
  });
});
