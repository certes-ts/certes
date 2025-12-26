import { describe, expect, it } from 'vitest';
import { BL } from '.';

const add = (a: number) => (b: number) => a + b;
const double = (x: number) => x * 2;

describe('B1 Combinator', () => {
  it('should compose binary function with unary', () => {
    expect(BL(double)(add)(3)(4)).toEqual(14); // double(add(3)(4))
  });
});
