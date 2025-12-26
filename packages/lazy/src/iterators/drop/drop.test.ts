import { describe, expect, it } from 'vitest';
import { collect } from '../../helpers/collect';
import { drop } from '.';

describe('Drop', () => {
  it('should skip the first n elements', () => {
    const result = collect(drop(2)([1, 2, 3, 4, 5]));

    expect(result).toEqual([3, 4, 5]);
  });

  it('should yield nothing if n exceeds length', () => {
    const result = collect(drop(10)([1, 2, 3]));

    expect(result).toEqual([]);
  });

  it('should yield all elements when n is zero', () => {
    const result = collect(drop(0)([1, 2, 3]));

    expect(result).toEqual([1, 2, 3]);
  });

  it('should return an empty iterable for empty input', () => {
    const result = collect(drop(5)([]));

    expect(result).toEqual([]);
  });

  it('should be reusable across multiple iterations', () => {
    const dropped = drop(2)([1, 2, 3, 4]);

    expect(collect(dropped)).toEqual([3, 4]);
    expect(collect(dropped)).toEqual([3, 4]);
  });

  // Negative space
  it('should throw TypeError when n is negative', () => {
    expect(() => drop(-1)).toThrow(TypeError);
    expect(() => drop(-1)).toThrow(
      'drop() requires n to be a non-negative safe integer',
    );
  });

  it('should throw TypeError when n is not an integer', () => {
    expect(() => drop(2.5)).toThrow(TypeError);
  });

  it('should throw TypeError when n is Infinity', () => {
    expect(() => drop(Number.POSITIVE_INFINITY)).toThrow(TypeError);
  });

  it('should throw TypeError when n is NaN', () => {
    expect(() => drop(Number.NaN)).toThrow(TypeError);
  });
});
