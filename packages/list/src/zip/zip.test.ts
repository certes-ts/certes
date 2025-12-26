import { describe, expect, it } from 'vitest';
import { zip } from '.';

describe('Zip', () => {
  it('should pair corresponding elements', () => {
    const arr1 = [1, 2, 3];
    const arr2 = ['a', 'b', 'c'];
    const result = zip(arr2)(arr1);

    expect(result).toEqual([
      [1, 'a'],
      [2, 'b'],
      [3, 'c'],
    ]);
  });

  it('should pair numbers with strings', () => {
    const names = ['Alice', 'Bob', 'Charlie'];
    const scores = [95, 87, 92];
    const result = zip(scores)(names);

    expect(result).toEqual([
      ['Alice', 95],
      ['Bob', 87],
      ['Charlie', 92],
    ]);
  });

  it('should pair arrays of equal length', () => {
    const arr1 = [1, 2];
    const arr2 = [3, 4];
    const result = zip(arr2)(arr1);

    expect(result).toEqual([
      [1, 3],
      [2, 4],
    ]);
  });

  it('should stop at shorter array when first is shorter', () => {
    const arr1 = [1, 2];
    const arr2 = ['a', 'b', 'c', 'd'];
    const result = zip(arr2)(arr1);

    expect(result).toEqual([
      [1, 'a'],
      [2, 'b'],
    ]);
  });

  it('should stop at shorter array when second is shorter', () => {
    const arr1 = [1, 2, 3, 4];
    const arr2 = ['a', 'b'];
    const result = zip(arr2)(arr1);

    expect(result).toEqual([
      [1, 'a'],
      [2, 'b'],
    ]);
  });

  it('should handle significantly different lengths', () => {
    const arr1 = [1];
    const arr2 = ['a', 'b', 'c', 'd', 'e'];
    const result = zip(arr2)(arr1);

    expect(result).toEqual([[1, 'a']]);
  });

  it('should handle both arrays empty', () => {
    const arr1: number[] = [];
    const arr2: string[] = [];
    const result = zip(arr2)(arr1);

    expect(result).toEqual([]);
  });

  it('should handle first array empty', () => {
    const arr1: number[] = [];
    const arr2 = ['a', 'b', 'c'];
    const result = zip(arr2)(arr1);

    expect(result).toEqual([]);
  });

  it('should handle second array empty', () => {
    const arr1 = [1, 2, 3];
    const arr2: string[] = [];
    const result = zip(arr2)(arr1);

    expect(result).toEqual([]);
  });

  it('should handle a single element arrays', () => {
    const arr1 = [42];
    const arr2 = ['x'];
    const result = zip(arr2)(arr1);

    expect(result).toEqual([[42, 'x']]);
  });

  it('should handle null and undefined values', () => {
    const arr1 = [1, null, undefined];
    const arr2 = ['a', 'b', 'c'];
    const result = zip(arr2)(arr1);

    expect(result).toEqual([
      [1, 'a'],
      [null, 'b'],
      [undefined, 'c'],
    ]);
  });
});
