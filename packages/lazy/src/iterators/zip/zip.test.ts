import { describe, expect, it, vi } from 'vitest';
import { collect } from '../../helpers/collect';
import { map } from '../map';
import { take } from '../take';
import { zip } from '.';

describe('Zip', () => {
  it('should pair elements from two iterables', () => {
    const result = collect(zip(['a', 'b', 'c'])([1, 2, 3]));

    expect(result).toEqual([
      [1, 'a'],
      [2, 'b'],
      [3, 'c'],
    ]);
  });

  it('should stop when the shorter iterable is exhausted (source shorter)', () => {
    const result = collect(zip(['a', 'b', 'c', 'd'])([1, 2]));

    expect(result).toEqual([
      [1, 'a'],
      [2, 'b'],
    ]);
  });

  it('should stop when the shorter iterable is exhausted (other shorter)', () => {
    const result = collect(zip(['a', 'b'])([1, 2, 3, 4]));

    expect(result).toEqual([
      [1, 'a'],
      [2, 'b'],
    ]);
  });

  it('should return an empty iterable when source is empty', () => {
    const result = collect(zip(['a', 'b'])([] as number[]));

    expect(result).toEqual([]);
  });

  it('should return an empty iterable when other is empty', () => {
    const result = collect(zip([] as string[])([1, 2, 3]));

    expect(result).toEqual([]);
  });

  it('should be reusable across multiple iterations', () => {
    const zipped = zip(['a', 'b'])([1, 2]);

    expect(collect(zipped)).toEqual([
      [1, 'a'],
      [2, 'b'],
    ]);
    expect(collect(zipped)).toEqual([
      [1, 'a'],
      [2, 'b'],
    ]);
  });

  it('should be lazy and not consume more elements than needed', () => {
    const fn = vi.fn((x: number) => x);
    const source = map(fn)([1, 2, 3, 4, 5]);

    collect(take(2)(zip(['a', 'b', 'c'])(source)));

    expect(fn).toHaveBeenCalledTimes(2);
  });
});
