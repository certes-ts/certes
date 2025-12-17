import { describe, expect, it } from 'vitest';
import { flatten } from '.';

describe('flatten', () => {
  it('should flatten an array of arrays', () => {
    const arr = [[1, 2], [3, 4], [5]];
    const result = flatten(arr);

    expect(result).toEqual([1, 2, 3, 4, 5]);
  });

  it('should flatten string arrays', () => {
    const arr = [['a'], ['b', 'c'], ['d', 'e', 'f']];
    const result = flatten(arr);

    expect(result).toEqual(['a', 'b', 'c', 'd', 'e', 'f']);
  });

  it('should flatten only one level', () => {
    const arr = [[[1, 2]], [[3, 4]]];
    const result = flatten(arr);

    expect(result).toEqual([
      [1, 2],
      [3, 4],
    ]);
  });

  it('should handle an empty array', () => {
    const arr: number[][] = [];
    const result = flatten(arr);

    expect(result).toEqual([]);
  });

  it('should handle an array with empty subarrays', () => {
    const arr = [[], [1], [], [2, 3], []];
    const result = flatten(arr);

    expect(result).toEqual([1, 2, 3]);
  });

  it('should handle a single subarray', () => {
    const arr = [[1, 2, 3]];
    const result = flatten(arr);

    expect(result).toEqual([1, 2, 3]);
  });

  it('should handle uniform subarrays', () => {
    const arr = [[1], [2], [3], [4]];
    const result = flatten(arr);

    expect(result).toEqual([1, 2, 3, 4]);
  });
});
