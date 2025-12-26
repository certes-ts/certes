import { describe, expect, it } from 'vitest';
import { findIndex } from '.';

const isEven = (x: number) => !(x & 1);
const is100 = (x: number) => x === 100;
const arr = [1, 2, 3, 4, 5];

describe('FindIndex', () => {
  it('should return the first match of the predicate', () => {
    expect(findIndex(isEven)(arr)).toEqual(1);
  });

  it('should return `-1` if no matches are found', () => {
    expect(findIndex(is100)(arr)).toEqual(-1);
  });
});
