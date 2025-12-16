import { describe, expect, it } from 'vitest';
import { collect } from '../../helpers/collect';
import { unique } from '.';

describe('unique', () => {
  it('should remove duplicate elements preserving first occurrence', () => {
    const result = collect(unique([1, 2, 1, 3, 2, 4]));

    expect(result).toEqual([1, 2, 3, 4]);
  });

  it('should return all elements when all are unique', () => {
    const result = collect(unique([1, 2, 3, 4]));

    expect(result).toEqual([1, 2, 3, 4]);
  });

  it('should return single element for all duplicates', () => {
    const result = collect(unique([1, 1, 1, 1]));

    expect(result).toEqual([1]);
  });

  it('should work with strings', () => {
    const result = collect(unique(['a', 'b', 'a', 'c', 'b']));

    expect(result).toEqual(['a', 'b', 'c']);
  });

  it('should return an empty iterable for empty input', () => {
    const result = collect(unique([]));

    expect(result).toEqual([]);
  });

  it('should be reusable across multiple iterations', () => {
    const uniqued = unique([1, 2, 1, 3]);

    expect(collect(uniqued)).toEqual([1, 2, 3]);
    expect(collect(uniqued)).toEqual([1, 2, 3]);
  });
});
