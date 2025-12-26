import { describe, expect, it } from 'vitest';
import { concat } from '.';

const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const expected = [1, 2, 3, 4, 5, 6];

describe('Concat', () => {
  it('should concatenate two arrays together', () => {
    expect(concat(arr1)(arr2)).toStrictEqual(expected);
  });

  it('should handle empty first array', () => {
    const result = concat([] as number[])(arr2);

    expect(result).toStrictEqual(arr2);
  });

  it('should handle empty second array', () => {
    const result = concat(arr1)([] as number[]);

    expect(result).toStrictEqual(arr1);
  });

  it('should handle both arrays empty', () => {
    const result = concat([] as number[])([] as number[]);

    expect(result).toStrictEqual([]);
  });
});
