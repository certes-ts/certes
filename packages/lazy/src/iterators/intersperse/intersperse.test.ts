import { describe, expect, it } from 'vitest';
import { collect } from '../../helpers/collect';
import { intersperse } from '.';

describe('Intersperse', () => {
  it('should insert separator between elements', () => {
    const result = collect(intersperse(0)([1, 2, 3]));

    expect(result).toEqual([1, 0, 2, 0, 3]);
  });

  it('should return single element unchanged', () => {
    const result = collect(intersperse(0)([1]));

    expect(result).toEqual([1]);
  });

  it('should return an empty iterable for empty input', () => {
    const result = collect(intersperse(0)([]));

    expect(result).toEqual([]);
  });

  it('should work with string separators', () => {
    const result = collect(intersperse('-')(['a', 'b', 'c']));

    expect(result).toEqual(['a', '-', 'b', '-', 'c']);
  });

  it('should be reusable across multiple iterations', () => {
    const interspersed = intersperse(0)([1, 2, 3]);

    expect(collect(interspersed)).toEqual([1, 0, 2, 0, 3]);
    expect(collect(interspersed)).toEqual([1, 0, 2, 0, 3]);
  });
});
