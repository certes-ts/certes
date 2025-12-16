import { describe, expect, it } from 'vitest';
import { collect } from '../../helpers/collect';
import { flatMap } from '.';

describe('flatMap', () => {
  it('should map and flatten results', () => {
    const result = collect(flatMap((x: number) => [x, x * 2])([1, 2, 3]));

    expect(result).toEqual([1, 2, 2, 4, 3, 6]);
  });

  it('should handle empty inner iterables', () => {
    const result = collect(
      flatMap((x: number) => (x % 2 === 0 ? [x] : []))([1, 2, 3, 4]),
    );

    expect(result).toEqual([2, 4]);
  });

  it('should pass the index as the second argument', () => {
    const result = collect(
      flatMap((x: number, idx: number) => [`${idx}:${x}`])([10, 20]),
    );

    expect(result).toEqual(['0:10', '1:20']);
  });

  it('should return an empty iterable for empty input', () => {
    const result = collect(flatMap((x: number) => [x, x])([]));

    expect(result).toEqual([]);
  });

  it('should be reusable across multiple iterations', () => {
    const flatMapped = flatMap((x: number) => [x, x])([1, 2]);

    expect(collect(flatMapped)).toEqual([1, 1, 2, 2]);
    expect(collect(flatMapped)).toEqual([1, 1, 2, 2]);
  });
});
