import { describe, expect, it } from 'vitest';
import { collect } from '../../helpers/collect';
import { uniqueBy } from '.';

describe('UniqueBy', () => {
  it('should remove duplicates based on key function', () => {
    const users = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
      { id: 1, name: 'Alicia' },
    ];

    const result = collect(uniqueBy((u: { id: number }) => u.id)(users));

    expect(result).toEqual([
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ]);
  });

  it('should preserve first occurrence when keys collide', () => {
    const result = collect(uniqueBy((x: number) => x % 2)([1, 2, 3, 4, 5]));

    expect(result).toEqual([1, 2]);
  });

  it('should return all elements when all keys are unique', () => {
    const result = collect(uniqueBy((x: number) => x)([1, 2, 3]));

    expect(result).toEqual([1, 2, 3]);
  });

  it('should return an empty iterable for empty input', () => {
    const result = collect(uniqueBy((x: number) => x)([]));

    expect(result).toEqual([]);
  });

  it('should be reusable across multiple iterations', () => {
    const uniqued = uniqueBy((x: number) => x % 2)([1, 2, 3, 4]);

    expect(collect(uniqued)).toEqual([1, 2]);
    expect(collect(uniqued)).toEqual([1, 2]);
  });
});
