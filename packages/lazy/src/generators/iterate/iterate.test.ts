import { describe, expect, it } from 'vitest';
import { collect } from '../../helpers/collect';
import { take } from '../../iterators/take';
import { iterate } from '.';

describe('iterate', () => {
  it('should yield seed then successive applications of fn', () => {
    const result = collect(take(5)(iterate((x: number) => x * 2)(1)));

    expect(result).toEqual([1, 2, 4, 8, 16]);
  });

  it('should yield seed as the first value', () => {
    const result = collect(take(1)(iterate((x: number) => x + 1)(100)));

    expect(result).toEqual([100]);
  });

  it('should work with string transformations', () => {
    // biome-ignore lint/style/useTemplate: For testing
    const result = collect(take(4)(iterate((s: string) => s + 'a')('')));

    expect(result).toEqual(['', 'a', 'aa', 'aaa']);
  });

  it('should work with tuple transformations (Fibonacci)', () => {
    const fibs = iterate(
      ([a, b]: [number, number]) => [b, a + b] as [number, number],
    )([0, 1]);

    const result = collect(take(7)(fibs)).map(([a]) => a);

    expect(result).toEqual([0, 1, 1, 2, 3, 5, 8]);
  });

  it('should be reusable across multiple iterations', () => {
    const powers = iterate((x: number) => x * 2)(1);

    const first = collect(take(4)(powers));
    const second = collect(take(4)(powers));

    expect(first).toEqual([1, 2, 4, 8]);
    expect(second).toEqual([1, 2, 4, 8]);
  });

  // Negative space
  it('should throw TypeError when fn is not a function', () => {
    expect(() =>
      iterate('not a function' as unknown as (x: number) => number),
    ).toThrow(TypeError);
    expect(() =>
      iterate('not a function' as unknown as (x: number) => number),
    ).toThrow('iterate() requires fn to be a function');
  });

  it('should throw TypeError when fn is null', () => {
    expect(() => iterate(null as unknown as (x: number) => number)).toThrow(
      TypeError,
    );
  });

  it('should throw TypeError when fn is undefined', () => {
    expect(() =>
      iterate(undefined as unknown as (x: number) => number),
    ).toThrow(TypeError);
  });

  it('should throw TypeError when fn is a number', () => {
    expect(() => iterate(42 as unknown as (x: number) => number)).toThrow(
      TypeError,
    );
  });
});
