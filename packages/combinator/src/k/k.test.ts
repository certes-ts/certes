import { expect, it } from 'vitest';
import { constant } from '.';

it('should always return the first value', () => {
  expect(constant(1)(2)).toEqual(1);
  expect(constant(9)(7)).toEqual(9);
  expect(constant(4)(8)).toEqual(4);
});
