import { describe, expect, it } from 'vitest';
import { includes } from '.';

const arr = [1, 2, 3, 4, 5];

describe('includes', () => {
  it('should return true if the array contains the value', () => {
    expect(includes(3)(arr)).toBeTruthy();
  });

  it("should return false if the array doesn't contains the value", () => {
    expect(includes(53)(arr)).toBeFalsy();
  });
});
