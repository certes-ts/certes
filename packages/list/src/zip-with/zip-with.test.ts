import { describe, expect, it } from 'vitest';
import { zipWith } from '.';

describe('ZipWith', () => {
  it('should combine elements with addition', () => {
    const add = (a: number, b: number) => a + b;
    const arr1 = [1, 2, 3];
    const arr2 = [10, 20, 30];
    const result = zipWith(arr2)(add)(arr1);

    expect(result).toEqual([11, 22, 33]);
  });

  it('should combine elements with multiplication', () => {
    const multiply = (a: number, b: number) => a * b;
    const arr1 = [2, 3, 4];
    const arr2 = [5, 6, 7];
    const result = zipWith(arr2)(multiply)(arr1);

    expect(result).toEqual([10, 18, 28]);
  });

  it('should combine strings with concatenation', () => {
    const concat = (a: string, b: string) => `${a}-${b}`;
    const arr1 = ['a', 'b', 'c'];
    const arr2 = ['x', 'y', 'z'];
    const result = zipWith(arr2)(concat)(arr1);

    expect(result).toEqual(['a-x', 'b-y', 'c-z']);
  });

  it('should create objects from pairs', () => {
    const makeObj = (name: string, age: number) => ({ name, age });
    const names = ['Alice', 'Bob', 'Charlie'];
    const ages = [25, 30, 35];
    const result = zipWith(ages)(makeObj)(names);

    expect(result).toEqual([
      { name: 'Alice', age: 25 },
      { name: 'Bob', age: 30 },
      { name: 'Charlie', age: 35 },
    ]);
  });

  it('should compute with different types', () => {
    const repeat = (s: string, n: number) => s.repeat(n);
    const strs = ['a', 'b', 'c'];
    const counts = [3, 2, 4];
    const result = zipWith(counts)(repeat)(strs);

    expect(result).toEqual(['aaa', 'bb', 'cccc']);
  });

  it('should stop at shorter array when first is shorter', () => {
    const add = (a: number, b: number) => a + b;
    const arr1 = [1, 2];
    const arr2 = [10, 20, 30, 40];
    const result = zipWith(arr2)(add)(arr1);

    expect(result).toEqual([11, 22]);
  });

  it('should stop at shorter array when second is shorter', () => {
    const add = (a: number, b: number) => a + b;
    const arr1 = [1, 2, 3, 4];
    const arr2 = [10, 20];
    const result = zipWith(arr2)(add)(arr1);

    expect(result).toEqual([11, 22]);
  });

  it('should handle significantly different lengths', () => {
    const concat = (a: string, b: string) => a + b;
    const arr1 = ['x'];
    const arr2 = ['a', 'b', 'c', 'd', 'e'];
    const result = zipWith(arr2)(concat)(arr1);

    expect(result).toEqual(['xa']);
  });

  it('should handle both arrays empty', () => {
    const add = (a: number, b: number) => a + b;
    const arr1: number[] = [];
    const arr2: number[] = [];
    const result = zipWith(arr2)(add)(arr1);

    expect(result).toEqual([]);
  });

  it('should handle first array empty', () => {
    const add = (a: number, b: number) => a + b;
    const arr1: number[] = [];
    const arr2 = [1, 2, 3];
    const result = zipWith(arr2)(add)(arr1);

    expect(result).toEqual([]);
  });

  it('should handle second array empty', () => {
    const add = (a: number, b: number) => a + b;
    const arr1 = [1, 2, 3];
    const arr2: number[] = [];
    const result = zipWith(arr2)(add)(arr1);

    expect(result).toEqual([]);
  });

  it('should handle a single element arrays', () => {
    const add = (a: number, b: number) => a + b;
    const arr1 = [5];
    const arr2 = [10];
    const result = zipWith(arr2)(add)(arr1);

    expect(result).toEqual([15]);
  });

  it('should handle null and undefined', () => {
    const pair = (a: number | null, b: string | undefined) => [a, b];
    const arr1 = [1, null, 3];
    const arr2 = ['a', undefined, 'c'];
    const result = zipWith(arr2)(pair)(arr1);

    expect(result).toEqual([
      [1, 'a'],
      [null, undefined],
      [3, 'c'],
    ]);
  });
});
