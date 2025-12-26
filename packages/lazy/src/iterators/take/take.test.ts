import { describe, expect, it, vi } from 'vitest';
import { collect } from '../../helpers/collect';
import { map } from '../map';
import { take } from '.';

describe('Take', () => {
  it('should yield at most n elements', () => {
    const result = collect(take(3)([1, 2, 3, 4, 5]));

    expect(result).toEqual([1, 2, 3]);
  });

  it('should yield all elements if n exceeds length', () => {
    const result = collect(take(10)([1, 2, 3]));

    expect(result).toEqual([1, 2, 3]);
  });

  it('should yield nothing when n is zero', () => {
    const result = collect(take(0)([1, 2, 3]));

    expect(result).toEqual([]);
  });

  it('should return an empty iterable for empty input', () => {
    const result = collect(take(5)([]));

    expect(result).toEqual([]);
  });

  it('should be lazy and stop iteration early', () => {
    const fn = vi.fn((x: number) => x);
    const mapped = map(fn)([1, 2, 3, 4, 5]);

    collect(take(2)(mapped));

    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('should be reusable across multiple iterations', () => {
    const taken = take(2)([1, 2, 3, 4]);

    expect(collect(taken)).toEqual([1, 2]);
    expect(collect(taken)).toEqual([1, 2]);
  });

  // Negative space
  it('should throw TypeError when n is negative', () => {
    expect(() => take(-1)).toThrow(TypeError);
    expect(() => take(-1)).toThrow(
      'take() requires n to be a non-negative safe integer',
    );
  });

  it('should throw TypeError when n is not an integer', () => {
    expect(() => take(2.5)).toThrow(TypeError);
  });

  it('should throw TypeError when n is Infinity', () => {
    expect(() => take(Number.POSITIVE_INFINITY)).toThrow(TypeError);
  });

  it('should throw TypeError when n is NaN', () => {
    expect(() => take(Number.NaN)).toThrow(TypeError);
  });
});
