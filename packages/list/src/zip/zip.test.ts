import { describe, expect, it } from 'vitest';
import { zip } from '.';

describe('zip', () => {
  it('should pair corresponding elements', () => {
    // Arrange
    const arr1 = [1, 2, 3];
    const arr2 = ['a', 'b', 'c'];

    // Act
    const result = zip(arr2)(arr1);

    // Assert
    expect(result).toEqual([
      [1, 'a'],
      [2, 'b'],
      [3, 'c'],
    ]);
  });

  it('should pair numbers with strings', () => {
    // Arrange
    const names = ['Alice', 'Bob', 'Charlie'];
    const scores = [95, 87, 92];

    // Act
    const result = zip(scores)(names);

    // Assert
    expect(result).toEqual([
      ['Alice', 95],
      ['Bob', 87],
      ['Charlie', 92],
    ]);
  });

  it('should pair arrays of equal length', () => {
    // Arrange
    const arr1 = [1, 2];
    const arr2 = [3, 4];

    // Act
    const result = zip(arr2)(arr1);

    // Assert
    expect(result).toEqual([
      [1, 3],
      [2, 4],
    ]);
  });

  it('should stop at shorter array when first is shorter', () => {
    // Arrange
    const arr1 = [1, 2];
    const arr2 = ['a', 'b', 'c', 'd'];

    // Act
    const result = zip(arr2)(arr1);

    // Assert
    expect(result).toEqual([
      [1, 'a'],
      [2, 'b'],
    ]);
  });

  it('should stop at shorter array when second is shorter', () => {
    // Arrange
    const arr1 = [1, 2, 3, 4];
    const arr2 = ['a', 'b'];

    // Act
    const result = zip(arr2)(arr1);

    // Assert
    expect(result).toEqual([
      [1, 'a'],
      [2, 'b'],
    ]);
  });

  it('should handle significantly different lengths', () => {
    // Arrange
    const arr1 = [1];
    const arr2 = ['a', 'b', 'c', 'd', 'e'];

    // Act
    const result = zip(arr2)(arr1);

    // Assert
    expect(result).toEqual([[1, 'a']]);
  });

  it('should handle both arrays empty', () => {
    // Arrange
    const arr1: number[] = [];
    const arr2: string[] = [];

    // Act
    const result = zip(arr2)(arr1);

    // Assert
    expect(result).toEqual([]);
  });

  it('should handle first array empty', () => {
    // Arrange
    const arr1: number[] = [];
    const arr2 = ['a', 'b', 'c'];

    // Act
    const result = zip(arr2)(arr1);

    // Assert
    expect(result).toEqual([]);
  });

  it('should handle second array empty', () => {
    // Arrange
    const arr1 = [1, 2, 3];
    const arr2: string[] = [];

    // Act
    const result = zip(arr2)(arr1);

    // Assert
    expect(result).toEqual([]);
  });

  it('should handle a single element arrays', () => {
    // Arrange
    const arr1 = [42];
    const arr2 = ['x'];

    // Act
    const result = zip(arr2)(arr1);

    // Assert
    expect(result).toEqual([[42, 'x']]);
  });

  it('should handle null and undefined values', () => {
    // Arrange
    const arr1 = [1, null, undefined];
    const arr2 = ['a', 'b', 'c'];

    // Act
    const result = zip(arr2)(arr1);

    // Assert
    expect(result).toEqual([
      [1, 'a'],
      [null, 'b'],
      [undefined, 'c'],
    ]);
  });
});
