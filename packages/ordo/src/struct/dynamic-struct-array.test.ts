import { describe, expect, it } from 'vitest';
import { dynamicStructArray, struct } from './factory-functions';
import { float32, uint32 } from './fields';

describe('DynamicStructArray', () => {
  describe('constructor', () => {
    it('should create an array with initial capacity', () => {
      const def = struct({ id: uint32 });
      const arr = dynamicStructArray(def, 10);

      expect(arr.capacity).toBe(10);
      expect(arr.length).toBe(0);
    });

    it('should throw on invalid capacity', () => {
      const def = struct({ id: uint32 });

      expect(() => dynamicStructArray(def, 0)).toThrow(
        'initialCapacity must be greater than 0',
      );
    });
  });

  describe('get/set after #resize', () => {
    it('should correctly get primitive fields after resize', () => {
      const def = struct({ id: uint32, value: float32 });
      const arr = dynamicStructArray(def, 2);

      arr.push({ id: 1, value: 1.1 });
      arr.push({ id: 2, value: 2.2 });
      arr.push({ id: 3, value: 3.3 });

      expect(arr.get(0, 'id')).toBe(1);
      expect(arr.get(1, 'id')).toBe(2);
      expect(arr.get(2, 'id')).toBe(3);
      expect(arr.get(0, 'value')).toBeCloseTo(1.1, 1);
      expect(arr.get(1, 'value')).toBeCloseTo(2.2, 1);
      expect(arr.get(2, 'value')).toBeCloseTo(3.3, 1);
    });

    it('should correctly set primitive fields after resize', () => {
      const def = struct({ id: uint32, value: float32 });
      const arr = dynamicStructArray(def, 2);

      arr.push({ id: 1, value: 1.1 });
      arr.push({ id: 2, value: 2.2 });
      arr.push({ id: 3, value: 3.3 }); // Triggers resize

      arr.set(0, 'value', 99.9);
      arr.set(1, 'value', 88.8);
      arr.set(2, 'value', 77.7);

      expect(arr.get(0, 'value')).toBeCloseTo(99.9, 1);
      expect(arr.get(1, 'value')).toBeCloseTo(88.8, 1);
      expect(arr.get(2, 'value')).toBeCloseTo(77.7, 1);
    });

    it('should handle multiple resizes with get/set', () => {
      const def = struct({ id: uint32 });
      const arr = dynamicStructArray(def, 1);

      // Trigger multiple resizes: 1 -> 2 -> 4 -> 8
      for (let i = 0; i < 8; i++) {
        arr.push({ id: i * 10 });
      }

      // Verify all values using get()
      for (let i = 0; i < 8; i++) {
        expect(arr.get(i, 'id')).toBe(i * 10);
      }

      // Modify using set()
      for (let i = 0; i < 8; i++) {
        arr.set(i, 'id', i * 100);
      }

      // Verify modifications
      for (let i = 0; i < 8; i++) {
        expect(arr.get(i, 'id')).toBe(i * 100);
      }
    });

    it('should handle get/set after downsize', () => {
      const def = struct({ id: uint32 });
      const arr = dynamicStructArray(def, 2);

      arr.push({ id: 1 });
      arr.push({ id: 2 });
      arr.push({ id: 3 });
      arr.push({ id: 4 });

      arr.pop();
      arr.pop();

      expect(arr.get(0, 'id')).toBe(1);
      expect(arr.get(1, 'id')).toBe(2);

      arr.set(0, 'id', 100);
      arr.set(1, 'id', 200);

      expect(arr.get(0, 'id')).toBe(100);
      expect(arr.get(1, 'id')).toBe(200);
    });
  });

  describe('push', () => {
    it('should auto-resize when the capacity is reached', () => {
      const def = struct({ id: uint32 });
      const arr = dynamicStructArray(def, 2);

      arr.push({ id: 1 });
      arr.push({ id: 2 });
      arr.push({ id: 3 });

      expect(arr.length).toBe(3);
      expect(arr.capacity).toBe(4);
    });

    it('should preserve the data after a resize', () => {
      const def = struct({ id: uint32, value: float32 });
      const arr = dynamicStructArray(def, 2);

      arr.push({ id: 1, value: 1.1 });
      arr.push({ id: 2, value: 2.2 });
      arr.push({ id: 3, value: 3.3 });

      expect(arr.at(0).get('id')).toBe(1);
      expect(arr.at(1).get('id')).toBe(2);
      expect(arr.at(2).get('id')).toBe(3);
    });
  });

  describe('pop', () => {
    it('should remove and return the last element', () => {
      const def = struct({ id: uint32 });
      const arr = dynamicStructArray(def, 10);

      arr.push({ id: 10 });
      arr.push({ id: 20 });
      arr.push({ id: 30 });

      const view = arr.pop();

      expect(view?.get('id')).toBe(30);
      expect(arr.length).toBe(2);
    });

    it('should return undefined when empty', () => {
      const def = struct({ id: uint32 });
      const arr = dynamicStructArray(def, 10);
      const result = arr.pop();

      expect(result).toBeUndefined();
    });

    it('should auto-downsize when the length drops', () => {
      const def = struct({ id: uint32 });
      const arr = dynamicStructArray(def, 2);

      arr.push({ id: 1 });
      arr.push({ id: 2 });
      arr.push({ id: 3 });
      arr.push({ id: 4 });

      expect(arr.capacity).toBe(4);

      arr.pop();
      arr.pop();

      expect(arr.length).toBe(2);
      expect(arr.capacity).toBe(2);
    });
  });

  describe('remove', () => {
    it('should remove an element and shift remaining', () => {
      const def = struct({ id: uint32 });
      const arr = dynamicStructArray(def, 10);

      arr.push({ id: 10 });
      arr.push({ id: 20 });
      arr.push({ id: 30 });
      arr.remove(1);

      expect(arr.length).toBe(2);
      expect(arr.at(0).get('id')).toBe(10);
      expect(arr.at(1).get('id')).toBe(30);
    });
  });

  describe('getRawBuffer', () => {
    it('should return a sliced buffer with only used portion', () => {
      const def = struct({ id: uint32 });
      const arr = dynamicStructArray(def, 10);

      arr.push({ id: 1 });
      arr.push({ id: 2 });

      const buffer = arr.getRawBuffer();

      expect(buffer.byteLength).toBe(2 * def.layout.stride);
    });
  });

  describe('iterator', () => {
    it('should iterate over all elements', () => {
      const def = struct({ id: uint32 });
      const arr = dynamicStructArray(def, 10);

      arr.push({ id: 10 });
      arr.push({ id: 20 });
      arr.push({ id: 30 });

      const ids: number[] = [];

      for (const view of arr) {
        ids.push(view.get('id'));
      }

      expect(ids).toEqual([10, 20, 30]);
    });
  });
});
