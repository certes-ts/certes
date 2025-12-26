import { describe, expect, it } from 'vitest';
import { reverse } from '.';

const input = [1, 2, 3, 4, 5];
const expected = [5, 4, 3, 2, 1];

describe('Reverse', () => {
  it('should correctly reverse the array', () => {
    expect(reverse(input)).toStrictEqual(expected);
  });

  it('should handle empty array', () => {
    expect(reverse([])).toStrictEqual([]);
  });

  it('should handle single element', () => {
    expect(reverse([1])).toStrictEqual([1]);
  });

  it('should not mutate original array', () => {
    const original = [1, 2, 3];

    reverse(original);

    expect(original).toStrictEqual([1, 2, 3]);
  });
});
