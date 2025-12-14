import { expect, it } from 'vitest';
import { applyTo } from '.';

const addSix = (a: number) => a + 6;

it('should apply the value the given function', () => {
  expect(applyTo(3)(addSix)).toEqual(9);
});
