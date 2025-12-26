import { describe, expect, it } from 'vitest';
import { C } from '.';

const subtract = (a: number) => (b: number) => a - b;

describe('C Combinator', () => {
  it('should swap argument order', () => {
    const flipped = C(subtract);
    expect(flipped(3)(10)).toEqual(7); // 10 - 3, not 3 - 10
    expect(subtract(10)(3)).toEqual(7); // Verify original behavior
  });
});
