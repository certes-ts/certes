import { describe, expect, it } from 'vitest';
import { collect } from '../../helpers/collect';
import { zipWith } from '.';

describe('ZipWith', () => {
  it('should combine elements using the provided function', () => {
    const result = collect(
      zipWith([10, 20, 30], (a: number, b: number) => a + b)([1, 2, 3]),
    );

    expect(result).toEqual([11, 22, 33]);
  });

  it('should stop when the shorter iterable is exhausted', () => {
    const result = collect(
      zipWith([10, 20], (a: number, b: number) => a + b)([1, 2, 3, 4]),
    );

    expect(result).toEqual([11, 22]);
  });

  it('should return an empty iterable when either input is empty', () => {
    const result = collect(
      zipWith([] as number[], (a: number, b: number) => a + b)([1, 2, 3]),
    );

    expect(result).toEqual([]);
  });

  it('should be reusable across multiple iterations', () => {
    const zipped = zipWith([10, 20], (a: number, b: number) => a * b)([2, 3]);

    expect(collect(zipped)).toEqual([20, 60]);
    expect(collect(zipped)).toEqual([20, 60]);
  });
});
