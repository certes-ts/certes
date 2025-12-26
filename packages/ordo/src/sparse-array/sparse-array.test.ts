import { describe, expect, it } from 'vitest';
import { sparseArray, sparseArrayFrom } from '.';

describe('SparseArray', () => {
  describe('constructor', () => {
    it('should create an array with valid parameters', () => {
      const arr = sparseArray('u32', 10);

      expect(arr.capacity()).toBe(10);
      expect(arr.size()).toBe(0);
    });
  });

  describe('push', () => {
    it('should add elements sequentially', () => {
      const arr = sparseArray('u32', 10);

      arr.push(100);
      arr.push(200);
      arr.push(300);

      expect(arr.size()).toBe(3);
      expect(arr.at(0)).toBe(100);
      expect(arr.at(1)).toBe(200);
      expect(arr.at(2)).toBe(300);
    });

    it('should auto-resize when capacity is reached', () => {
      const arr = sparseArray('i32', 2);

      arr.push(1);
      arr.push(2);
      arr.push(3);

      expect(arr.size()).toBe(3);
      expect(arr.capacity()).toBe(4);
    });

    it('should return index from push', () => {
      const arr = sparseArray('u32', 10);
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
  });

  describe('remove', () => {
    it('should set a removed element to 0 without shifting', () => {
      const arr = sparseArray('u32', 10);

      arr.push(10);
      arr.push(20);
      arr.push(30);
      arr.remove(1);

      expect(arr.size()).toBe(3); // Size unchanged
      expect(arr.at(0)).toBe(10);
      expect(arr.at(1)).toBe(0); // Set to 0
      expect(arr.at(2)).toBe(30);
    });

    it('should maintain stable indices', () => {
      const arr = sparseArray('i32', 10);

      arr.push(100);
      arr.push(200);
      arr.push(300);
      arr.push(400);
      arr.remove(1);
      arr.remove(2);

      expect(arr.at(0)).toBe(100);
      expect(arr.at(1)).toBe(0);
      expect(arr.at(2)).toBe(0);
      expect(arr.at(3)).toBe(400);
    });

    it('should throw on out of bounds index', () => {
      const arr = sparseArray('u16', 10);

      arr.push(1);

      expect(() => arr.remove(-1)).toThrow('Index out of range');
      expect(() => arr.remove(5)).toThrow('Index out of range');
    });
  });

  describe('toArray', () => {
    it('should include zeros for removed elements', () => {
      const arr = sparseArray('u32', 10);

      arr.push(10);
      arr.push(20);
      arr.push(30);
      arr.remove(1);

      const result = arr.toArray();

      expect(result).toEqual([10, 0, 30]);
    });
  });

  describe('from', () => {
    it('should create a sparse array from array input', () => {
      const input = [1, 2, 3, 4];
      const arr = sparseArrayFrom('i32', input);

      expect(arr.size()).toBe(4);
      expect(arr.toArray()).toEqual(input);
    });

    it('should throw on empty array', () => {
      expect(() => sparseArrayFrom('u32', [])).toThrow(
        'arr must be an array with length greater than 0',
      );
    });
  });
});
