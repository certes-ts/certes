import { describe, expect, it } from 'vitest';
import { map } from '.';

const double = (x: number) => x * 2;
const arr = [1, 2, 3, 4, 5];

describe('Map', () => {
  it('should return the correct filtered array', () => {
    const doubleItems = map(double);

    expect(doubleItems(arr)).toStrictEqual([2, 4, 6, 8, 10]);
  });

  it('should handle empty array', () => {
    const doubleItems = map(double);

    expect(doubleItems([])).toStrictEqual([]);
  });
});
