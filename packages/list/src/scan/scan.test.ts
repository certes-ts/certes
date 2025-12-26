import { describe, expect, it } from 'vitest';
import { scan } from '.';

describe('Scan', () => {
  it('should return all intermediate accumulator values', () => {
    const add = (acc: number, x: number) => acc + x;
    const arr = [1, 2, 3, 4];
    const result = scan(add)(0)(arr);

    expect(result).toEqual([0, 1, 3, 6, 10]);
  });

  it('should handle string concatenation', () => {
    const concat = (acc: string, x: string) => acc + x;
    const arr = ['a', 'b', 'c'];
    const result = scan(concat)('')(arr);

    expect(result).toEqual(['', 'a', 'ab', 'abc']);
  });

  it('should handle multiplication', () => {
    const multiply = (acc: number, x: number) => acc * x;
    const arr = [2, 3, 4];
    const result = scan(multiply)(1)(arr);

    expect(result).toEqual([1, 2, 6, 24]);
  });

  it('should handle array accumulation', () => {
    const append = (acc: number[], x: number) => [...acc, x];
    const arr = [1, 2, 3];
    const result = scan(append)([])(arr);

    expect(result).toEqual([[], [1], [1, 2], [1, 2, 3]]);
  });

  it('should handle an empty array', () => {
    const add = (acc: number, x: number) => acc + x;
    const arr: number[] = [];
    const result = scan(add)(0)(arr);

    expect(result).toEqual([0]);
  });

  it('should handle a single element array', () => {
    const add = (acc: number, x: number) => acc + x;
    const arr = [5];
    const result = scan(add)(0)(arr);

    expect(result).toEqual([0, 5]);
  });

  it('should handle different initial value types', () => {
    const count = (acc: number, _x: string) => acc + 1;
    const arr = ['a', 'b', 'c'];
    const result = scan(count)(0)(arr);

    expect(result).toEqual([0, 1, 2, 3]);
  });

  it('should always include initial value', () => {
    const add = (acc: number, x: number) => acc + x;
    const arr = [1, 2, 3];
    const result = scan(add)(10)(arr);

    expect(result[0]).toBe(10);
    expect(result).toEqual([10, 11, 13, 16]);
  });
});
