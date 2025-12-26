import { describe, expect, it } from 'vitest';
import { reduce } from '.';

const add = (a: number, b: number) => a + b;
const arr = [1, 2, 3, 4, 5];

describe('Reduce', () => {
  it('should correctly reduce the array', () => {
    const sumItems = reduce(add)(0);

    expect(sumItems(arr)).toStrictEqual(15);
  });

  it('should return initial value for empty array', () => {
    const sumItems = reduce(add)(0);

    expect(sumItems([])).toStrictEqual(0);
  });
});
