import { expect, it } from 'vitest';
import { apply } from '.';

const addSix = (a: number) => a + 6;

it('should apply the function to the given value', () => {
  expect(apply(addSix)(3)).toEqual(9);
});
