import { describe, expect, it } from 'vitest';
import { flatMap } from '.';

describe('flatMap', () => {
  it('shoudl map and flatten in one operation', () => {
    const duplicate = (x: number) => [x, x];
    const arr = [1, 2, 3];
    const result = flatMap(duplicate)(arr);

    expect(result).toEqual([1, 1, 2, 2, 3, 3]);
  });

  it('should handle string splitting', () => {
    const explode = (s: string) => s.split('');
    const arr = ['hi', 'yo'];
    const result = flatMap(explode)(arr);

    expect(result).toEqual(['h', 'i', 'y', 'o']);
  });

  it('should pass an index to mapping function', () => {
    const withIndex = (x: number, idx?: number) => [x, idx ?? -1];
    const arr = [10, 20, 30];
    const result = flatMap(withIndex)(arr);

    expect(result).toEqual([10, 0, 20, 1, 30, 2]);
  });

  it('should handle an empty array', () => {
    const duplicate = (x: number) => [x, x];
    const arr: number[] = [];
    const result = flatMap(duplicate)(arr);

    expect(result).toEqual([]);
  });

  it('should handle mapping to empty arrays', () => {
    const toEmpty = (_x: number) => [];
    const arr = [1, 2, 3];
    const result = flatMap(toEmpty)(arr);

    expect(result).toEqual([]);
  });

  it('should handle mixed result lengths', () => {
    const variadic = (x: number) => (x % 2 === 0 ? [x] : [x, x, x]);
    const arr = [1, 2, 3, 4];
    const result = flatMap(variadic)(arr);

    expect(result).toEqual([1, 1, 1, 2, 3, 3, 3, 4]);
  });

  it('should handle a single element array', () => {
    const triple = (x: number) => [x, x, x];
    const arr = [5];
    const result = flatMap(triple)(arr);

    expect(result).toEqual([5, 5, 5]);
  });
});
