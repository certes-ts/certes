import { describe, expect, it } from 'vitest';
import { collect } from '../../helpers/collect';
import { slice } from '.';

describe('slice', () => {
  it('should yield elements from start to end (exclusive)', () => {
    const result = collect(slice(1, 4)([0, 1, 2, 3, 4, 5]));

    expect(result).toEqual([1, 2, 3]);
  });

  it('should yield from start to end of iterable when end is omitted', () => {
    const result = collect(slice(2)([0, 1, 2, 3, 4]));

    expect(result).toEqual([2, 3, 4]);
  });

  it('should yield nothing when start equals end', () => {
    const result = collect(slice(2, 2)([0, 1, 2, 3, 4]));

    expect(result).toEqual([]);
  });

  it('should yield nothing when start exceeds length', () => {
    const result = collect(slice(10, 15)([0, 1, 2]));

    expect(result).toEqual([]);
  });

  it('should return an empty iterable for empty input', () => {
    const result = collect(slice(0, 5)([]));

    expect(result).toEqual([]);
  });

  it('should be reusable across multiple iterations', () => {
    const sliced = slice(1, 3)([0, 1, 2, 3, 4]);

    expect(collect(sliced)).toEqual([1, 2]);
    expect(collect(sliced)).toEqual([1, 2]);
  });

  // Negative space
  it('should throw TypeError when start is negative', () => {
    expect(() => slice(-1, 5)).toThrow(TypeError);
    expect(() => slice(-1, 5)).toThrow(
      'slice() requires start to be a non-negative safe integer',
    );
  });

  it('should throw TypeError when end is negative', () => {
    expect(() => slice(0, -1)).toThrow(TypeError);
    expect(() => slice(0, -1)).toThrow(
      'slice() requires end to be a non-negative safe integer',
    );
  });

  it('should throw TypeError when start is not an integer', () => {
    expect(() => slice(1.5, 5)).toThrow(TypeError);
  });

  it('should throw TypeError when end is not an integer', () => {
    expect(() => slice(0, 3.5)).toThrow(TypeError);
  });

  it('should throw TypeError when start is Infinity', () => {
    expect(() => slice(Number.POSITIVE_INFINITY, 5)).toThrow(TypeError);
  });

  it('should throw TypeError when end is Infinity', () => {
    expect(() => slice(0, Number.POSITIVE_INFINITY)).toThrow(TypeError);
  });

  it('should throw TypeError when start is NaN', () => {
    expect(() => slice(Number.NaN, 5)).toThrow(TypeError);
  });

  it('should throw TypeError when end is NaN', () => {
    expect(() => slice(0, Number.NaN)).toThrow(TypeError);
  });

  it('should yield nothing when end is less than start', () => {
    const result = collect(slice(5, 2)([0, 1, 2, 3, 4, 5, 6, 7]));

    expect(result).toEqual([]);
  });
});
