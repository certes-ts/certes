import { describe, expect, it } from 'vitest';
import { compose } from '.';

const addEight = (a: number) => a + 8;
const timesThree = (a: number) => a * 3;

describe('B Combinator', () => {
  it('should correctly compose the functions', () => {
    expect(compose(addEight)(timesThree)(4)).toEqual(20);
  });
});
