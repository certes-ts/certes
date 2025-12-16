import { describe, expect, it } from 'vitest';
import { collect } from '../../helpers/collect';
import { interleave } from '.';

describe('interleave', () => {
  it('should alternate elements from two iterables', () => {
    const result = collect(interleave([4, 5, 6])([1, 2, 3]));

    expect(result).toEqual([1, 4, 2, 5, 3, 6]);
  });

  it('should include remaining elements when source is longer', () => {
    const result = collect(interleave([4])([1, 2, 3]));

    expect(result).toEqual([1, 4, 2, 3]);
  });

  it('should include remaining elements when other is longer', () => {
    const result = collect(interleave([4, 5, 6])([1]));

    expect(result).toEqual([1, 4, 5, 6]);
  });

  it('should return other when source is empty', () => {
    const result = collect(interleave([1, 2, 3])([] as number[]));

    expect(result).toEqual([1, 2, 3]);
  });

  it('should return source when other is empty', () => {
    const result = collect(interleave([] as number[])([1, 2, 3]));

    expect(result).toEqual([1, 2, 3]);
  });

  it('should be reusable across multiple iterations', () => {
    const interleaved = interleave([3, 4])([1, 2]);

    expect(collect(interleaved)).toEqual([1, 3, 2, 4]);
    expect(collect(interleaved)).toEqual([1, 3, 2, 4]);
  });

  it('should return empty when both iterables are empty', () => {
    const result = collect(interleave([] as number[])([] as number[]));

    expect(result).toEqual([]);
  });
});
