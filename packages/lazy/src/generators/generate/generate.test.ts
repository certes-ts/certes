import { describe, expect, it } from 'vitest';
import { collect } from '../../helpers/collect';
import { take } from '../../iterators/take';
import { generate } from '.';

describe('generate', () => {
  it('should yield fn(0), fn(1), fn(2), ...', () => {
    const result = collect(take(5)(generate((i) => i * i)));

    expect(result).toEqual([0, 1, 4, 9, 16]);
  });

  it('should start from index 0', () => {
    const result = collect(take(3)(generate((i) => i)));

    expect(result).toEqual([0, 1, 2]);
  });

  it('should work with constant functions', () => {
    const result = collect(take(3)(generate(() => 'constant')));

    expect(result).toEqual(['constant', 'constant', 'constant']);
  });

  it('should work with alternating patterns', () => {
    const result = collect(take(6)(generate((i) => (i % 2 === 0 ? 1 : -1))));

    expect(result).toEqual([1, -1, 1, -1, 1, -1]);
  });

  it('should work with object generation', () => {
    const result = collect(take(3)(generate((i) => ({ id: i }))));

    expect(result).toEqual([{ id: 0 }, { id: 1 }, { id: 2 }]);
  });

  it('should be reusable across multiple iterations', () => {
    const squares = generate((i) => i * i);

    const first = collect(take(4)(squares));
    const second = collect(take(4)(squares));

    expect(first).toEqual([0, 1, 4, 9]);
    expect(second).toEqual([0, 1, 4, 9]);
  });

  // Negative space
  it('should throw TypeError when fn is not a function', () => {
    expect(() =>
      generate('not a function' as unknown as (i: number) => number),
    ).toThrow(TypeError);
    expect(() =>
      generate('not a function' as unknown as (i: number) => number),
    ).toThrow('generate() requires fn to be a function');
  });

  it('should throw TypeError when fn is null', () => {
    expect(() => generate(null as unknown as (i: number) => number)).toThrow(
      TypeError,
    );
  });

  it('should throw TypeError when fn is undefined', () => {
    expect(() =>
      generate(undefined as unknown as (i: number) => number),
    ).toThrow(TypeError);
  });

  it('should throw TypeError when fn is an object', () => {
    expect(() => generate({} as unknown as (i: number) => number)).toThrow(
      TypeError,
    );
  });
});
