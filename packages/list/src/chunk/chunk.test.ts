import { describe, expect, it } from 'vitest';
import { chunk } from '.';

describe('chunk', () => {
  it('should chunk array into fixed-size groups', () => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const result = chunk(3)(arr);

    expect(result).toEqual([
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ]);
  });

  it('should handle last chunk smaller than size', () => {
    const arr = [1, 2, 3, 4, 5, 6, 7];
    const result = chunk(3)(arr);

    expect(result).toEqual([[1, 2, 3], [4, 5, 6], [7]]);
  });

  it('should chunk strings', () => {
    const arr = ['a', 'b', 'c', 'd', 'e'];
    const result = chunk(2)(arr);

    expect(result).toEqual([['a', 'b'], ['c', 'd'], ['e']]);
  });

  it('should handle chunk size of 1', () => {
    const arr = [1, 2, 3];
    const result = chunk(1)(arr);

    expect(result).toEqual([[1], [2], [3]]);
  });

  it('should handle chunk size equal to array length', () => {
    const arr = [1, 2, 3];
    const result = chunk(3)(arr);

    expect(result).toEqual([[1, 2, 3]]);
  });

  it('should handle chunk size larger than array length', () => {
    const arr = [1, 2];
    const result = chunk(5)(arr);

    expect(result).toEqual([[1, 2]]);
  });

  it('should handle an empty array', () => {
    const arr: number[] = [];
    const result = chunk(3)(arr);

    expect(result).toEqual([]);
  });

  it('should handle a single element array', () => {
    const arr = [42];
    const result = chunk(2)(arr);

    expect(result).toEqual([[42]]);
  });

  it('should handle array with exact multiple of chunk size', () => {
    const arr = [1, 2, 3, 4, 5, 6];
    const result = chunk(2)(arr);

    expect(result).toEqual([
      [1, 2],
      [3, 4],
      [5, 6],
    ]);
  });

  it('should throw error for non-positive chunk size', () => {
    const arr = [1, 2, 3];

    expect(() => chunk(0)(arr)).toThrow(
      'chunk() requires size to be a positive safe integer',
    );
    expect(() => chunk(-1)(arr)).toThrow(
      'chunk() requires size to be a positive safe integer',
    );
  });

  it('should throw error for non-integer chunk size', () => {
    const arr = [1, 2, 3];

    expect(() => chunk(2.5)(arr)).toThrow(
      'chunk() requires size to be a positive safe integer',
    );
  });
});
