import { describe, expect, it } from 'vitest';
import { dynamicArray, dynamicArrayFrom } from '.';

describe('DynamicArray', () => {
  describe('constructor', () => {
    it('should create an array with valid parameters', () => {
      const arr = dynamicArray('f32', 10);

      expect(arr.capacity()).toBe(10);
      expect(arr.size()).toBe(0);
    });

    it('should throw on invalid array type - empty string', () => {
      // biome-ignore lint/suspicious/noExplicitAny: Testing
      expect(() => dynamicArray('' as any, 10)).toThrow(
        'arrayType must be provided',
      );
    });

    it('should throw on invalid array type - unknown type', () => {
      // biome-ignore lint/suspicious/noExplicitAny: Testing
      expect(() => dynamicArray('bad' as any, 10)).toThrow(
        'Unknown array type',
      );
    });

    it('should throw on zero initial size', () => {
      expect(() => dynamicArray('u32', 0)).toThrow(
        'initialSize must be greater than 0',
      );
    });

    it('should throw on negative initial size', () => {
      expect(() => dynamicArray('u32', -5)).toThrow(
        'initialSize must be greater than 0',
      );
    });
  });

  describe('push', () => {
    it('should add an element to an empty array', () => {
      const arr = dynamicArray('u32', 5);

      arr.push(42);

      expect(arr.size()).toBe(1);
      expect(arr.at(0)).toBe(42);
    });

    it('should auto-resize when capacity is reached', () => {
      const arr = dynamicArray('i32', 2);

      arr.push(1);
      arr.push(2);
      arr.push(3);

      expect(arr.size()).toBe(3);
      expect(arr.capacity()).toBe(4); // 2 * SCALING_FACTOR
    });

    it('should return index from push', () => {
      const arr = dynamicArray('u32', 10);
      const idx0 = arr.push(100);
      const idx1 = arr.push(200);
      const idx2 = arr.push(300);

      expect(idx0).toBe(0);
      expect(idx1).toBe(1);
      expect(idx2).toBe(2);
      expect(arr.at(idx0)).toBe(100);
      expect(arr.at(idx1)).toBe(200);
      expect(arr.at(idx2)).toBe(300);
    });

    it('should preserve existing elements after resize', () => {
      const arr = dynamicArray('f64', 2);

      arr.push(1.5);
      arr.push(2.5);

      arr.push(3.5);

      expect(arr.at(0)).toBe(1.5);
      expect(arr.at(1)).toBe(2.5);
      expect(arr.at(2)).toBe(3.5);
    });

    it('should handle multiple resizes', () => {
      const arr = dynamicArray('u8', 2);

      // Trigger multiple resizes: 2 -> 4 -> 8 -> 16
      for (let i = 0; i < 10; i++) {
        arr.push(i);
      }

      expect(arr.size()).toBe(10);
      expect(arr.capacity()).toBe(16);
    });
  });

  describe('at', () => {
    it('should return an element at a valid index', () => {
      const arr = dynamicArray('u16', 10);

      arr.push(100);
      arr.push(200);
      arr.push(300);

      expect(arr.at(0)).toBe(100);
      expect(arr.at(1)).toBe(200);
      expect(arr.at(2)).toBe(300);
    });

    it('should throw on negative index', () => {
      const arr = dynamicArray('i8', 10);

      arr.push(5);

      expect(() => arr.at(-1)).toThrow('Index out of range');
    });

    it('should throw on index >= size', () => {
      const arr = dynamicArray('i8', 10);

      arr.push(5);

      expect(() => arr.at(1)).toThrow('Index out of range');
      expect(() => arr.at(100)).toThrow('Index out of range');
    });
  });

  describe('set', () => {
    it('should update an element at a valid index', () => {
      const arr = dynamicArray('f32', 10);

      arr.push(1.0);
      arr.push(2.0);
      arr.set(1, 99.9);

      expect(arr.at(1)).toBeCloseTo(99.9, 1);
    });

    it('should throw on out of bounds index', () => {
      const arr = dynamicArray('u32', 10);

      arr.push(1);

      expect(() => arr.set(-1, 10)).toThrow('Index out of range');
      expect(() => arr.set(5, 10)).toThrow('Index out of range');
    });
  });

  describe('remove', () => {
    it('should remove an element and shift remaining', () => {
      const arr = dynamicArray('i32', 10);

      arr.push(10);
      arr.push(20);
      arr.push(30);
      arr.push(40);

      arr.remove(1); // Remove 20

      expect(arr.size()).toBe(3);
      expect(arr.toArray()).toEqual([10, 30, 40]);
    });

    it('should remove the first element', () => {
      const arr = dynamicArray('u32', 10);

      arr.push(1);
      arr.push(2);
      arr.push(3);
      arr.remove(0);

      expect(arr.toArray()).toEqual([2, 3]);
    });

    it('should remove the last element', () => {
      const arr = dynamicArray('i16', 10);

      arr.push(1);
      arr.push(2);
      arr.push(3);
      arr.remove(2);

      expect(arr.toArray()).toEqual([1, 2]);
    });

    it('should auto-downsize when size drops', () => {
      const arr = dynamicArray('u32', 2);

      arr.push(1);
      arr.push(2);
      arr.push(3);
      arr.push(4);

      expect(arr.capacity()).toBe(4);

      arr.remove(0);
      arr.remove(0);

      expect(arr.size()).toBe(2);
      expect(arr.capacity()).toBe(2);
    });

    it('should throw on out of bounds index', () => {
      const arr = dynamicArray('f64', 10);

      arr.push(1.5);

      expect(() => arr.remove(-1)).toThrow('Index out of range');
      expect(() => arr.remove(5)).toThrow('Index out of range');
    });
  });

  describe('toArray', () => {
    it('should return a standard array of elements', () => {
      const arr = dynamicArray('i16', 10);

      arr.push(100);
      arr.push(200);
      arr.push(300);

      const result = arr.toArray();

      expect(result).toEqual([100, 200, 300]);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should return an empty array for an empty dynamic array', () => {
      const arr = dynamicArray('f32', 10);
      const result = arr.toArray();

      expect(result).toEqual([]);
    });
  });

  describe('from', () => {
    it('should create array from valid input', () => {
      const input = [1, 2, 3, 4, 5];
      const arr = dynamicArrayFrom('f32', input);

      expect(arr.size()).toBe(5);
      expect(arr.toArray()).toEqual(input);
    });

    it('should filter out NaN values', () => {
      const input = [1, Number.NaN, 3, 5] as number[];
      const arr = dynamicArrayFrom('u32', input);

      expect(arr.size()).toBe(3);
      expect(arr.toArray()).toEqual([1, 3, 5]);
    });

    it('should filter out non-numbers', () => {
      // biome-ignore lint/suspicious/noExplicitAny: Testing
      const input = [1, undefined, 3, null, 5] as any;
      const arr = dynamicArrayFrom('u32', input);

      expect(arr.size()).toBe(3);
      expect(arr.toArray()).toEqual([1, 3, 5]);
    });

    it('should throw on empty array after filtering', () => {
      // biome-ignore lint/suspicious/noExplicitAny: Testing
      const input = [Number.NaN, undefined, null] as any;

      expect(() => dynamicArrayFrom('i32', input)).toThrow(
        'arr must be an array with non-null length greater than 0',
      );
    });

    it('should throw on empty array', () => {
      expect(() => dynamicArrayFrom('u32', [])).toThrow('arr must be an array');
    });
  });

  describe('iterator', () => {
    it('should iterate over all elements', () => {
      const arr = dynamicArray('u8', 10);

      arr.push(1);
      arr.push(2);
      arr.push(3);

      const result = Array.from(arr);

      expect(result).toEqual([1, 2, 3]);
    });

    it('should work with for...of loop', () => {
      const arr = dynamicArray('f64', 5);

      arr.push(1.1);
      arr.push(2.2);
      arr.push(3.3);

      const result: number[] = [];
      for (const val of arr) {
        result.push(val);
      }

      expect(result).toEqual([1.1, 2.2, 3.3]);
    });
  });
});
