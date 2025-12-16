import { describe, expect, it } from 'vitest';
import { collect } from '../../helpers/collect';
import { concat } from '.';

describe('concat', () => {
  it('should append iterables after the source', () => {
    const result = collect(concat([4, 5], [6])([1, 2, 3]));

    expect(result).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('should handle empty source', () => {
    const result = collect(concat([1, 2], [3])([]));

    expect(result).toEqual([1, 2, 3]);
  });

  it('should handle empty appendages', () => {
    const result = collect(concat([] as number[], [] as number[])([1, 2, 3]));

    expect(result).toEqual([1, 2, 3]);
  });

  it('should handle no appendages', () => {
    const result = collect(concat()([1, 2, 3]));

    expect(result).toEqual([1, 2, 3]);
  });

  it('should be reusable across multiple iterations', () => {
    const concatenated = concat([3, 4])([1, 2]);

    expect(collect(concatenated)).toEqual([1, 2, 3, 4]);
    expect(collect(concatenated)).toEqual([1, 2, 3, 4]);
  });
});
