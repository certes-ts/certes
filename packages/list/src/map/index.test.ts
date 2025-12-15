import { describe, expect, test } from 'vitest';
import { map } from '.';

const double = (x: number) => x * 2;
const arr = [1, 2, 3, 4, 5];

describe('map', () => {
  test('it should return the correct filtered array', () => {
    const doubleItems = map(double);

    expect(doubleItems(arr)).toStrictEqual([2, 4, 6, 8, 10]);
  });

  test('it should handle empty array', () => {
    const doubleItems = map(double);

    expect(doubleItems([])).toStrictEqual([]);
  });
});
