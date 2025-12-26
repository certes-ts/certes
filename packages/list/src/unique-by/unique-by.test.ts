import { describe, expect, it } from 'vitest';
import { uniqueBy } from '.';

describe('UniqueBy', () => {
  it('should remove duplicates by key function', () => {
    const users = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
      { id: 1, name: 'Alice2' },
      { id: 3, name: 'Charlie' },
    ];

    const result = uniqueBy((u: { id: number }) => u.id)(users);

    expect(result).toEqual([
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
      { id: 3, name: 'Charlie' },
    ]);
  });

  it('should use first occurrence when duplicates found', () => {
    type Result = { id: number; value: string };
    const items: Result[] = [
      { id: 1, value: 'first' },
      { id: 2, value: 'second' },
      { id: 1, value: 'duplicate' },
    ];

    const result = uniqueBy<Result, number>((item) => item.id)(items);

    expect(result[0].value).toBe('first');
    expect(result.length).toBe(2);
  });

  it('should work with string keys', () => {
    const words = ['apple', 'apricot', 'banana', 'avocado', 'blueberry'];
    const result = uniqueBy((w: string) => w[0])(words);

    expect(result).toEqual(['apple', 'banana']);
  });

  it('should work with numeric keys', () => {
    const numbers = [1, 2, 3, 4, 5, 6];
    const isEven = (x: number) => x % 2;
    const result = uniqueBy(isEven)(numbers);

    expect(result).toEqual([1, 2]);
  });

  it('should preserve order of first occurrences', () => {
    const items = [
      { type: 'a', value: 1 },
      { type: 'b', value: 2 },
      { type: 'a', value: 3 },
      { type: 'c', value: 4 },
      { type: 'b', value: 5 },
    ];

    const result = uniqueBy((item: { type: string }) => item.type)(items);

    expect(result.map((x) => x.type)).toEqual(['a', 'b', 'c']);
  });

  it('should handle an empty array', () => {
    const arr: { id: number }[] = [];
    const result = uniqueBy((x: { id: number }) => x.id)(arr);

    expect(result).toEqual([]);
  });

  it('should handle a single element array', () => {
    const arr = [{ id: 1, name: 'Alice' }];
    const result = uniqueBy((x: { id: number }) => x.id)(arr);

    expect(result).toEqual([{ id: 1, name: 'Alice' }]);
  });

  it('should handle an array with no duplicates', () => {
    const arr = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
      { id: 3, name: 'Charlie' },
    ];

    const result = uniqueBy((x: { id: number }) => x.id)(arr);

    expect(result).toEqual(arr);
  });

  it('should handle an array with all same keys', () => {
    const arr = [
      { id: 1, name: 'Alice' },
      { id: 1, name: 'Bob' },
      { id: 1, name: 'Charlie' },
    ];

    const result = uniqueBy((x: { id: number }) => x.id)(arr);

    expect(result).toEqual([{ id: 1, name: 'Alice' }]);
  });

  it('should handle null and undefined keys', () => {
    const arr = [
      { id: null, name: 'Alice' },
      { id: undefined, name: 'Bob' },
      { id: null, name: 'Charlie' },
      { id: undefined, name: 'Dave' },
    ];

    const result = uniqueBy((x: { id: null | undefined }) => x.id)(arr);

    expect(result).toEqual([
      { id: null, name: 'Alice' },
      { id: undefined, name: 'Bob' },
    ]);
  });

  it('should handle complex key extraction', () => {
    const arr = [
      { user: { id: 1 }, score: 100 },
      { user: { id: 2 }, score: 200 },
      { user: { id: 1 }, score: 150 },
    ];

    const result = uniqueBy((x: { user: { id: number } }) => x.user.id)(arr);

    expect(result).toEqual([
      { user: { id: 1 }, score: 100 },
      { user: { id: 2 }, score: 200 },
    ]);
  });

  it('should handle computed keys', () => {
    const arr = [
      { firstName: 'John', lastName: 'Doe' },
      { firstName: 'Jane', lastName: 'Smith' },
      { firstName: 'John', lastName: 'Doe' },
    ];

    const result = uniqueBy(
      (x: { firstName: string; lastName: string }) =>
        `${x.firstName}-${x.lastName}`,
    )(arr);

    expect(result).toEqual([
      { firstName: 'John', lastName: 'Doe' },
      { firstName: 'Jane', lastName: 'Smith' },
    ]);
  });
});
