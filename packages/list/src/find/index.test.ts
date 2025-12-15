import { describe, expect, it } from 'vitest';
import { find } from '.';

const isEven = (x: number) => !(x & 1);
const is100 = (x: number) => x === 100;
const arr = [1, 2, 3, 4, 5];

describe('find', () => {
  it('should return the first match of the predicate', () => {
    expect(find(isEven)(arr)).toEqual(2);
  });

  it('should return `null` if no matches are found', () => {
    expect(find(is100)(arr)).toBeNull();
  });
});
