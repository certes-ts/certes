import { describe, expect, it } from 'vitest';
import { shift } from '.';

const input = [1, 2, 3, 4, 5];
const expected = [1, [2, 3, 4, 5]];

describe('shift', () => {
  it('should return the head and tail of the array', () => {
    expect(shift(input)).toStrictEqual(expected);
  });

  it('should handle single element array', () => {
    const result = shift([1]);

    expect(result).toStrictEqual([1, []]);
  });
});
