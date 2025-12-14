import { expect, it } from 'vitest';
import { fork } from '.';

const add = (a: number) => (b: number) => a + b;
const addThree = (a: number) => a + 3;
const minusTwo = (a: number) => a - 2;

it('should correctly compose the two unary functions and the binary function', () => {
  expect(fork(add)(addThree)(minusTwo)(9)).toEqual(19);
});
