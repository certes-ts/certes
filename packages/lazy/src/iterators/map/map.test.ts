import { describe, expect, it, vi } from 'vitest';
import { collect } from '../../helpers/collect';
import { map } from '.';

describe('Map', () => {
  it('should transform each element using the mapping function', () => {
    const result = collect(map((x: number) => x * 2)([1, 2, 3]));

    expect(result).toEqual([2, 4, 6]);
  });

  it('should pass the index as the second argument', () => {
    const result = collect(
      map((x: number, idx: number) => `${idx}:${x}`)([10, 20, 30]),
    );

    expect(result).toEqual(['0:10', '1:20', '2:30']);
  });

  it('should return an empty iterable for empty input', () => {
    const result = collect(map((x: number) => x * 2)([]));

    expect(result).toEqual([]);
  });

  it('should be lazy and not evaluate until iterated', () => {
    const fn = vi.fn((x: number) => x * 2);
    const mapped = map(fn)([1, 2, 3]);

    expect(fn).not.toHaveBeenCalled();

    collect(mapped);

    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('should be reusable across multiple iterations', () => {
    const mapped = map((x: number) => x * 2)([1, 2, 3]);

    expect(collect(mapped)).toEqual([2, 4, 6]);
    expect(collect(mapped)).toEqual([2, 4, 6]);
  });
});
