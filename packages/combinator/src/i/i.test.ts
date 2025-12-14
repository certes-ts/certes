import { expect, it } from 'vitest';
import { identity } from '.';

const addThree = (a: number) => a + 3;

it('should always return the value, unchanged', () => {
  expect(identity(1)).toEqual(1);
  expect(identity(addThree)).toEqual(addThree);
  expect(identity('test')).toEqual('test');
});
