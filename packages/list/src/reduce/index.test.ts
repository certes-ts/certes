import { describe, expect, test } from 'vitest';
import { reduce } from '.';

const add = (a: number, b: number) => a + b;
const arr = [1, 2, 3, 4, 5];

describe('reduce', () => {
  test('it should correctly reduce the array', () => {
    const sumItems = reduce(add)(0);

    expect(sumItems(arr)).toStrictEqual(15);
  });

  test('it should return initial value for empty array', () => {
    const sumItems = reduce(add)(0);

    expect(sumItems([])).toStrictEqual(0);
  });
});
