import { describe, expect, it } from 'vitest';
import { findLast } from '.';

const isEven = (x: number) => !(x & 1);
const is100 = (x: number) => x === 100;
const arr = [1, 2, 3, 4, 5];

describe('FindLast', () => {
  it('should return the first match of the predicate', () => {
    expect(findLast(isEven)(arr)).toEqual(4);
  });

  it('should return `null` if no matches are found', () => {
    expect(findLast(is100)(arr)).toBeNull();
  });
});
