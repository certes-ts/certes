import { describe, expect, it } from 'vitest';
import { collect } from '.';

describe('Collect', () => {
  it('should convert an iterable to an array', () => {
    const result = collect([1, 2, 3]);

    expect(result).toEqual([1, 2, 3]);
  });

  it('should return an empty array for empty input', () => {
    const result = collect([]);

    expect(result).toEqual([]);
  });

  it('should work with Set', () => {
    const result = collect(new Set([1, 2, 3]));

    expect(result).toEqual([1, 2, 3]);
  });

  it('should work with Map keys', () => {
    const map = new Map([
      ['a', 1],
      ['b', 2],
    ]);

    const result = collect(map.keys());

    expect(result).toEqual(['a', 'b']);
  });
});
