import { expect, it } from 'vitest';
import { second } from '.';

it('should always return the second value', () => {
  expect(second(1)(2)).toEqual(2);
  expect(second(9)(7)).toEqual(7);
  expect(second(4)(8)).toEqual(8);
});
