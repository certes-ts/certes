import { describe, expect, it } from 'vitest';
import { V } from '.';

const multiply = (a: number) => (b: number) => a * b;

describe('V Combinator', () => {
  it('should pair arguments for function application', () => {
    expect(V(3)(4)(multiply)).toEqual(12);
  });
});
