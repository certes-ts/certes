import { expect, it } from 'vitest';
import { Psi } from '.';

const add = (a: number) => (b: number) => a + b;
const square = (x: number) => x * x;

it('should apply function to both transformed arguments', () => {
  expect(Psi(add)(square)(3)(4)).toEqual(25); // 3² + 4² = 9 + 16
});
