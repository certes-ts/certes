import { bench, describe } from 'vitest';
import { autoCurry, type Curried } from '.';

// biome-ignore lint/suspicious/noExplicitAny: This is intended
function spreadCurry<T extends (...args: any[]) => any>(
  fn: T,
  // biome-ignore lint/suspicious/noExplicitAny: This is intended
  _args = [] as any[],
): Curried<Parameters<T>, ReturnType<T>> {
  return (...__args) =>
    ((rest) => (rest.length >= fn.length ? fn(...rest) : autoCurry(fn, rest)))([
      ..._args,
      ...__args,
    ]);
}

const addAndMultiply = (a: number, b: number, c: number) => (a + b) * c;
const curriedSpread = spreadCurry(addAndMultiply);
const curriedIterate = autoCurry(addAndMultiply);

describe('curry', () => {
  bench('spread curry', () => {
    const _r = curriedSpread(2)(3)(4);
  });

  bench('iterate curry', () => {
    const _r = curriedIterate(2)(3)(4);
  });
});
