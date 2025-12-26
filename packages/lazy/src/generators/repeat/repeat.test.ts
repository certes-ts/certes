import { describe, expect, it } from 'vitest';
import { collect } from '../../helpers/collect';
import { take } from '../../iterators/take';
import { repeat } from '.';

describe('Repeat', () => {
  it('should yield the same value indefinitely', () => {
    const result = collect(take(5)(repeat('x')));

    expect(result).toEqual(['x', 'x', 'x', 'x', 'x']);
  });

  it('should work with numbers', () => {
    const result = collect(take(3)(repeat(42)));

    expect(result).toEqual([42, 42, 42]);
  });

  it('should work with objects (same reference)', () => {
    const obj = { a: 1 };

    const result = collect(take(3)(repeat(obj)));

    expect(result).toEqual([obj, obj, obj]);
    expect(result[0]).toBe(obj);
    expect(result[1]).toBe(obj);
    expect(result[2]).toBe(obj);
  });

  it('should work with null', () => {
    const result = collect(take(2)(repeat(null)));

    expect(result).toEqual([null, null]);
  });

  it('should work with undefined', () => {
    const result = collect(take(2)(repeat(undefined)));

    expect(result).toEqual([undefined, undefined]);
  });

  it('should be reusable across multiple iterations', () => {
    const r = repeat('a');

    const first = collect(take(3)(r));
    const second = collect(take(3)(r));

    expect(first).toEqual(['a', 'a', 'a']);
    expect(second).toEqual(['a', 'a', 'a']);
  });
});
