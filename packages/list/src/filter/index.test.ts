import { describe, expect, test } from 'vitest';
import { filter } from '.';

const isEven = (x: number) => !(x & 1);
const isOdd = (x: number) => !isEven(x);
const arr = [1, 2, 3, 4, 5, 6];
const expectedEven = [2, 4, 6];
const expectedOdd = [1, 3, 5];

describe('filter', () => {
  test('it should return the correct filtered array', () => {
    const filterEven = filter(isEven);
    const filterOdd = filter(isOdd);

    expect(filterEven(arr)).toStrictEqual(expectedEven);
    expect(filterOdd(arr)).toStrictEqual(expectedOdd);
  });

  test('it should return empty array when filtering empty array', () => {
    const filterEven = filter(isEven);

    expect(filterEven([])).toStrictEqual([]);
  });

  test('it should return empty array when no matches', () => {
    const filterNegative = filter((x: number) => x < 0);

    expect(filterNegative(arr)).toStrictEqual([]);
  });
});
