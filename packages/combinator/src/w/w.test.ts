import { describe, expect, it } from 'vitest';
import { duplication } from '.';

const multiply = (a: number) => (b: number) => a * b;

describe('W Combinator', () => {
  it('should apply binary function to same argument twice', () => {
    expect(duplication(multiply)(7)).toEqual(49); // 7 * 7 = 49
  });
});
