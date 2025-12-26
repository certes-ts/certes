import { describe, expect, it } from 'vitest';
import { unique } from '.';

describe('Unique', () => {
  it('should remove duplicate numbers', () => {
    const arr = [1, 2, 2, 3, 3, 3, 4];
    const result = unique(arr);

    expect(result).toEqual([1, 2, 3, 4]);
  });

  it('should remove duplicate strings', () => {
    const arr = ['a', 'b', 'a', 'c', 'b'];
    const result = unique(arr);

    expect(result).toEqual(['a', 'b', 'c']);
  });

  it('should preserve order of first occurrences', () => {
    const arr = [3, 1, 2, 1, 3, 2, 4];
    const result = unique(arr);

    expect(result).toEqual([3, 1, 2, 4]);
  });

  it('should handle array with no duplicates', () => {
    const arr = [1, 2, 3, 4, 5];
    const result = unique(arr);

    expect(result).toEqual([1, 2, 3, 4, 5]);
  });

  it('should handle array with all duplicates', () => {
    const arr = [1, 1, 1, 1];
    const result = unique(arr);

    expect(result).toEqual([1]);
  });

  it('should handle an empty array', () => {
    const arr: number[] = [];
    const result = unique(arr);

    expect(result).toEqual([]);
  });

  it('should handle a single element array', () => {
    const arr = [42];
    const result = unique(arr);

    expect(result).toEqual([42]);
  });

  it('should handle consecutive duplicates', () => {
    const arr = [1, 1, 2, 2, 3, 3];
    const result = unique(arr);

    expect(result).toEqual([1, 2, 3]);
  });

  it('should handle non-consecutive duplicates', () => {
    const arr = [1, 2, 3, 1, 2, 3];
    const result = unique(arr);

    expect(result).toEqual([1, 2, 3]);
  });

  it('should use strict equality for comparison', () => {
    const arr = [1, '1', 2, '2'];
    const result = unique(arr);

    expect(result).toEqual([1, '1', 2, '2']);
  });

  it('should handle NaN correctly', () => {
    const arr = [1, Number.NaN, 2, Number.NaN, 3];
    const result = unique(arr);

    expect(result).toEqual([1, Number.NaN, 2, 3]);
  });

  it('should handle null and undefined', () => {
    const arr = [1, null, 2, null, undefined, 3, undefined];
    const result = unique(arr);

    expect(result).toEqual([1, null, 2, undefined, 3]);
  });

  it('should handle zero and negative zero', () => {
    const arr = [0, -0, 1];
    const result = unique(arr);

    expect(result).toEqual([0, 1]); // Set treats 0 and -0 as same
  });
});
