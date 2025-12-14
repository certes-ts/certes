import { expect, it } from 'vitest';
import { curry } from './';

const addAndMultiply = (a: number, b: number, c: number) => (a + b) * c;
const curriedFn = curry(addAndMultiply);

it('should correctly allow any combination of parameters', () => {
  expect(curriedFn(2)(3)(4)).toEqual(20);
  expect(curriedFn(2, 3)(4)).toEqual(20);
  expect(curriedFn(2)(3, 4)).toEqual(20);
  expect(curriedFn(2, 3, 4)).toEqual(20);
});
