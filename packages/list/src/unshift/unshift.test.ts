import { describe, expect, it } from 'vitest';
import { unshift } from '.';

const input = [1, 2, 3, 4];
const expected = [0, 1, 2, 3, 4];

describe('Unshift', () => {
  it('should push the item onto the start of the array', () => {
    expect(unshift(input)(0)).toEqual(expected);
  });

  it('should unshift onto empty array', () => {
    const result = unshift([] as number[])(1);

    expect(result).toStrictEqual([1]);
  });

  it('should not mutate original array', () => {
    const original = [1, 2, 3];
    const unshiftToOriginal = unshift(original);

    unshiftToOriginal(0);

    expect(original).toStrictEqual([1, 2, 3]);
  });
});
