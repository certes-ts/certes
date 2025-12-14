import { expect, it } from 'vitest';
import { pipe } from '.';

const double = (x: number) => x * 2;
const addThree = (x: number) => x + 3;

it('should compose functions left-to-right', () => {
  expect(pipe(double)(addThree)(5)).toEqual(13); // (5 * 2) + 3 = 13
});
