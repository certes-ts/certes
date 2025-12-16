import { describe, expect, it } from 'vitest';
import { collect } from '../../helpers/collect';
import { dropWhile } from '.';

describe('dropWhile', () => {
  it('should skip elements while predicate is true', () => {
    const result = collect(dropWhile((x: number) => x < 3)([1, 2, 3, 4, 1, 2]));

    expect(result).toEqual([3, 4, 1, 2]);
  });

  it('should yield all elements if first fails predicate', () => {
    const result = collect(dropWhile((x: number) => x > 10)([1, 2, 3]));

    expect(result).toEqual([1, 2, 3]);
  });

  it('should yield nothing if all pass predicate', () => {
    const result = collect(dropWhile((x: number) => x < 10)([1, 2, 3]));

    expect(result).toEqual([]);
  });

  it('should pass the index as the second argument', () => {
    const result = collect(
      dropWhile((_: number, idx: number) => idx < 2)([10, 20, 30, 40]),
    );

    expect(result).toEqual([30, 40]);
  });

  it('should return an empty iterable for empty input', () => {
    const result = collect(dropWhile((x: number) => x > 0)([]));

    expect(result).toEqual([]);
  });

  it('should be reusable across multiple iterations', () => {
    const dropped = dropWhile((x: number) => x < 3)([1, 2, 3, 4]);

    expect(collect(dropped)).toEqual([3, 4]);
    expect(collect(dropped)).toEqual([3, 4]);
  });
});
