import { describe, expect, it } from 'vitest';
import { collect } from '../../helpers/collect';
import { flatten } from '.';

describe('Flatten', () => {
  it('should flatten nested iterables by one level', () => {
    const result = collect(flatten([[1, 2], [3, 4], [5]]));

    expect(result).toEqual([1, 2, 3, 4, 5]);
  });

  it('should handle empty inner iterables', () => {
    const result = collect(flatten([[1], [], [2, 3], []]));

    expect(result).toEqual([1, 2, 3]);
  });

  it('should return an empty iterable for empty input', () => {
    const result = collect(flatten([]));

    expect(result).toEqual([]);
  });

  it('should return an empty iterable when all inner iterables are empty', () => {
    const result = collect(flatten([[], [], []]));

    expect(result).toEqual([]);
  });

  it('should be reusable across multiple iterations', () => {
    const flattened = flatten([[1, 2], [3]]);

    expect(collect(flattened)).toEqual([1, 2, 3]);
    expect(collect(flattened)).toEqual([1, 2, 3]);
  });
});
