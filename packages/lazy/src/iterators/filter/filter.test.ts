import { describe, expect, it, vi } from 'vitest';
import { collect } from '../../helpers/collect';
import { filter } from '.';

describe('filter', () => {
  it('should yield only elements satisfying the predicate', () => {
    const result = collect(filter((x: number) => x % 2 === 0)([1, 2, 3, 4, 5]));

    expect(result).toEqual([2, 4]);
  });

  it('should pass the index as the second argument', () => {
    const result = collect(
      filter((_: string, idx: number) => idx % 2 === 0)([
        'a',
        'b',
        'c',
        'd',
        'e',
      ]),
    );

    expect(result).toEqual(['a', 'c', 'e']);
  });

  it('should return an empty iterable when no elements match', () => {
    const result = collect(filter((x: number) => x > 100)([1, 2, 3]));

    expect(result).toEqual([]);
  });

  it('should return all elements when all match', () => {
    const result = collect(filter((x: number) => x > 0)([1, 2, 3]));

    expect(result).toEqual([1, 2, 3]);
  });

  it('should return an empty iterable for empty input', () => {
    const result = collect(filter((x: number) => x > 0)([]));

    expect(result).toEqual([]);
  });

  it('should be lazy and not evaluate until iterated', () => {
    const pred = vi.fn((x: number) => x > 1);
    const filtered = filter(pred)([1, 2, 3]);

    expect(pred).not.toHaveBeenCalled();

    collect(filtered);

    expect(pred).toHaveBeenCalledTimes(3);
  });

  it('should be reusable across multiple iterations', () => {
    const filtered = filter((x: number) => x % 2 === 0)([1, 2, 3, 4]);

    expect(collect(filtered)).toEqual([2, 4]);
    expect(collect(filtered)).toEqual([2, 4]);
  });
});
