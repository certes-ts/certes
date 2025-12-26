import { describe, expect, it } from 'vitest';
import { slice } from '.';

const input = [1, 2, 3, 4, 5];
const expected = [1, 2, 3, 4];

describe('slice', () => {
  it('should return the head and tail of the array', () => {
    expect(slice(0)(4)(input)).toStrictEqual(expected);
  });

  it('should handle empty array', () => {
    expect(slice(0)(2)([])).toStrictEqual([]);
  });

  it('should handle end beyond array length', () => {
    expect(slice(0)(100)(input)).toStrictEqual(input);
  });

  it('should handle start equal to end', () => {
    expect(slice(2)(2)(input)).toStrictEqual([]);
  });
});
