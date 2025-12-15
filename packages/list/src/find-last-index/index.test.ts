import { describe, expect, it } from 'vitest';
import { findLastIndex } from '.';

const isEven = (x: number) => !(x & 1);
const is100 = (x: number) => x === 100;
const arr = [1, 2, 3, 4, 5];

describe('findLastIndex', () => {
  it('should return the first match of the predicate', () => {
    expect(findLastIndex(isEven)(arr)).toEqual(3);
  });

  it('should return `-1` if no matches are found', () => {
    expect(findLastIndex(is100)(arr)).toEqual(-1);
  });
});
