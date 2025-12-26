import { describe, expect, it } from 'vitest';
import { substitution } from '.';

const add = (a: number) => (b: number) => a + b;
const double = (x: number) => x * 2;

describe('S Combinator', () => {
  it('should distribute argument to both functions', () => {
    expect(substitution(add)(double)(5)).toEqual(15); // 5 + double(5) = 5 + 10 = 15
  });
});
