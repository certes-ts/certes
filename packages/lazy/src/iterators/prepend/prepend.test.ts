import { describe, expect, it } from 'vitest';
import { collect } from '../../helpers/collect';
import { prepend } from '.';

describe('prepend', () => {
  it('should prepend iterables before the source', () => {
    const result = collect(prepend([1, 2], [3])([4, 5, 6]));

    expect(result).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('should handle empty source', () => {
    const result = collect(prepend([1, 2])([]));

    expect(result).toEqual([1, 2]);
  });

  it('should handle empty prependages', () => {
    const result = collect(prepend([] as number[], [] as number[])([1, 2, 3]));

    expect(result).toEqual([1, 2, 3]);
  });

  it('should handle no prependages', () => {
    const result = collect(prepend()([1, 2, 3]));

    expect(result).toEqual([1, 2, 3]);
  });

  it('should be reusable across multiple iterations', () => {
    const prepended = prepend([1, 2])([3, 4]);

    expect(collect(prepended)).toEqual([1, 2, 3, 4]);
    expect(collect(prepended)).toEqual([1, 2, 3, 4]);
  });
});
