import { describe, expect, it } from 'vitest';
import { collect } from '../../helpers/collect';
import { enumerate } from '.';

describe('Enumerate', () => {
  it('should pair each element with its index', () => {
    const result = collect(enumerate(['a', 'b', 'c']));

    expect(result).toEqual([
      [0, 'a'],
      [1, 'b'],
      [2, 'c'],
    ]);
  });

  it('should return an empty iterable for empty input', () => {
    const result = collect(enumerate([]));

    expect(result).toEqual([]);
  });

  it('should be reusable across multiple iterations', () => {
    const enumerated = enumerate(['x', 'y']);

    expect(collect(enumerated)).toEqual([
      [0, 'x'],
      [1, 'y'],
    ]);
    expect(collect(enumerated)).toEqual([
      [0, 'x'],
      [1, 'y'],
    ]);
  });
});
