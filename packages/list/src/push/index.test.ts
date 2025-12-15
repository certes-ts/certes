import { describe, expect, it } from 'vitest';
import { push } from '.';

const input = [1, 2, 3, 4];
const expected = [1, 2, 3, 4, 5];

describe('push', () => {
  it('should push the item onto the end of the array', () => {
    expect(push(input)(5)).toEqual(expected);
  });

  it('should push onto empty array', () => {
    const result = push([] as number[])(1);

    expect(result).toStrictEqual([1]);
  });

  it('should not mutate original array', () => {
    const original = [1, 2, 3];
    const pushToOriginal = push(original);

    pushToOriginal(4);

    expect(original).toStrictEqual([1, 2, 3]);
  });
});
