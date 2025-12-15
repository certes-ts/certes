import { describe, expect, it } from 'vitest';
import { indexOf } from '.';

const arr = [1, 2, 3, 4, 5];

describe('indexOf', () => {
  it('should return the index of the first match of the predicate', () => {
    expect(indexOf(3)(arr)).toEqual(2);
  });

  it('should return `-1` if no matches are found', () => {
    expect(indexOf(53)(arr)).toEqual(-1);
  });
});
