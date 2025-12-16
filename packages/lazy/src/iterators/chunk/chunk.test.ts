import { describe, expect, it } from 'vitest';
import { collect } from '../../helpers/collect';
import { chunk } from '.';

describe('chunk', () => {
  it('should group elements into fixed-size arrays', () => {
    const result = collect(chunk(2)([1, 2, 3, 4, 5, 6]));

    expect(result).toEqual([
      [1, 2],
      [3, 4],
      [5, 6],
    ]);
  });

  it('should include a smaller final chunk if elements do not divide evenly', () => {
    const result = collect(chunk(2)([1, 2, 3, 4, 5]));

    expect(result).toEqual([[1, 2], [3, 4], [5]]);
  });

  it('should return single-element chunks when size is 1', () => {
    const result = collect(chunk(1)([1, 2, 3]));

    expect(result).toEqual([[1], [2], [3]]);
  });

  it('should return one chunk when size exceeds length', () => {
    const result = collect(chunk(10)([1, 2, 3]));

    expect(result).toEqual([[1, 2, 3]]);
  });

  it('should return an empty iterable for empty input', () => {
    const result = collect(chunk(3)([]));

    expect(result).toEqual([]);
  });

  it('should be reusable across multiple iterations', () => {
    const chunked = chunk(2)([1, 2, 3, 4]);

    expect(collect(chunked)).toEqual([
      [1, 2],
      [3, 4],
    ]);
    expect(collect(chunked)).toEqual([
      [1, 2],
      [3, 4],
    ]);
  });

  // Negative space
  it('should throw TypeError when size is zero', () => {
    expect(() => chunk(0)).toThrow(TypeError);
    expect(() => chunk(0)).toThrow(
      'chunk() requires size to be a positive safe integer',
    );
  });

  it('should throw TypeError when size is negative', () => {
    expect(() => chunk(-1)).toThrow(TypeError);
  });

  it('should throw TypeError when size is not an integer', () => {
    expect(() => chunk(2.5)).toThrow(TypeError);
  });

  it('should throw TypeError when size is Infinity', () => {
    expect(() => chunk(Number.POSITIVE_INFINITY)).toThrow(TypeError);
  });

  it('should throw TypeError when size is NaN', () => {
    expect(() => chunk(Number.NaN)).toThrow(TypeError);
  });
});
