import { describe, expect, it } from 'vitest';
import { every } from '.';

const isEven = (x: number) => !(x & 1);
const emptyArr: number[] = [];
const evenArr = [2, 4, 6, 8, 10];
const oddArr = [0, 3, 5, 7, 9, 11];

describe('every', () => {
  it('should return true for an empty array', () => {
    const everyBool = every(Boolean);
    const everyMod = every(isEven);

    expect(everyBool(emptyArr)).toBeTruthy();
    expect(everyMod(emptyArr)).toBeTruthy();
  });

  it('should return true for truthy predicates', () => {
    const everyBool = every(Boolean);
    const everyMod = every(isEven);

    expect(everyBool(evenArr)).toBeTruthy();
    expect(everyMod(evenArr)).toBeTruthy();
  });

  it('should return false for falsey predicates', () => {
    const everyBool = every(Boolean);
    const everyMod = every(isEven);

    expect(everyBool(oddArr)).not.toBeTruthy();
    expect(everyMod(oddArr)).not.toBeTruthy();
  });
});
