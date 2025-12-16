import { describe, expect, it } from 'vitest';
import { collect } from '../../helpers/collect';
import { takeWhile } from '.';

describe('takeWhile', () => {
  it('should yield elements while predicate is true', () => {
    const result = collect(takeWhile((x: number) => x < 4)([1, 2, 3, 4, 5]));

    expect(result).toEqual([1, 2, 3]);
  });

  it('should yield nothing if first element fails predicate', () => {
    const result = collect(takeWhile((x: number) => x > 10)([1, 2, 3]));

    expect(result).toEqual([]);
  });

  it('should yield all elements if all pass predicate', () => {
    const result = collect(takeWhile((x: number) => x < 10)([1, 2, 3]));

    expect(result).toEqual([1, 2, 3]);
  });

  it('should pass the index as the second argument', () => {
    const result = collect(
      takeWhile((_: number, idx: number) => idx < 2)([10, 20, 30, 40]),
    );

    expect(result).toEqual([10, 20]);
  });

  it('should return an empty iterable for empty input', () => {
    const result = collect(takeWhile((x: number) => x > 0)([]));

    expect(result).toEqual([]);
  });

  it('should be reusable across multiple iterations', () => {
    const taken = takeWhile((x: number) => x < 3)([1, 2, 3, 4]);

    expect(collect(taken)).toEqual([1, 2]);
    expect(collect(taken)).toEqual([1, 2]);
  });
});
