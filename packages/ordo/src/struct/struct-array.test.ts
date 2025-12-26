import { describe, expect, it } from 'vitest';
import { struct, structArray } from './factory-functions';
import { array, float32, uint32 } from './fields';

describe('StructArray', () => {
  describe('constructor', () => {
    it('should create an array with capacity', () => {
      const def = struct({ id: uint32 });
      const arr = structArray(def, 100);

      expect(arr.capacity).toBe(100);
      expect(arr.length).toBe(0);
    });
  });

  describe('push', () => {
    it('should add an empty struct to the array', () => {
      const def = struct({ id: uint32, value: float32 });
      const arr = structArray(def, 10);
      const idx = arr.push();

      arr.at(idx).set('id', 42);

      expect(arr.length).toBe(1);
      expect(arr.at(0).get('id')).toBe(42);
    });

    it('should add an initialized struct from values object', () => {
      const def = struct({ id: uint32, value: float32 });
      const arr = structArray(def, 10);
      const idx = arr.push({ id: 99, value: 3.14 });

      expect(arr.at(idx).get('id')).toBe(99);
      expect(arr.at(idx).get('value')).toBeCloseTo(3.14, 2);
    });

    it('should throw when capacity is exceeded', () => {
      const def = struct({ id: uint32 });
      const arr = structArray(def, 2);

      arr.push();
      arr.push();

      expect(() => arr.push()).toThrow('StructArray capacity exceeded');
    });
  });

  describe('at', () => {
    it('should return the view at valid index', () => {
      const def = struct({ id: uint32 });
      const arr = structArray(def, 10);

      arr.push({ id: 100 });
      arr.push({ id: 200 });

      const view = arr.at(1);

      expect(view.get('id')).toBe(200);
    });

    it('should throw on out of bounds index', () => {
      const def = struct({ id: uint32 });
      const arr = structArray(def, 10);

      arr.push();

      expect(() => arr.at(-1)).toThrow('Index out of bounds');
      expect(() => arr.at(5)).toThrow('Index out of bounds');
    });
  });

  describe('get/set primitives', () => {
    it('should get a primitive field directly', () => {
      const def = struct({ id: uint32, value: float32 });
      const arr = structArray(def, 10);

      arr.push({ id: 42, value: 3.14 });

      const id = arr.get(0, 'id');

      expect(id).toBe(42);
    });

    it('should set a primitive field directly', () => {
      const def = struct({ id: uint32, value: float32 });
      const arr = structArray(def, 10);

      arr.push();
      arr.set(0, 'id', 999);

      expect(arr.get(0, 'id')).toBe(999);
    });

    it('should throw when getting a complex field', () => {
      const def = struct({ position: array('f32', 3) });
      const arr = structArray(def, 10);

      arr.push();

      expect(() => arr.get(0, 'position')).toThrow(
        "Cannot use array.get() on complex field 'position'",
      );
    });

    it('should throw when setting a complex field', () => {
      const def = struct({ position: array('f32', 3) });
      const arr = structArray(def, 10);

      arr.push();

      // biome-ignore lint/suspicious/noExplicitAny: For testing
      expect(() => arr.set(0, 'position', 123 as any)).toThrow(
        "Cannot use array.set() on complex field 'position'",
      );
    });
  });

  describe('forEach', () => {
    it('should iterate over all elements', () => {
      const def = struct({ id: uint32 });
      const arr = structArray(def, 10);

      arr.push({ id: 10 });
      arr.push({ id: 20 });
      arr.push({ id: 30 });

      const ids: number[] = [];

      arr.forEach((view) => {
        ids.push(view.get('id'));
      });

      expect(ids).toEqual([10, 20, 30]);
    });
  });

  describe('clear', () => {
    it('should reset length to 0', () => {
      const def = struct({ id: uint32 });
      const arr = structArray(def, 10);

      arr.push();
      arr.push();
      arr.push();
      arr.clear();

      expect(arr.length).toBe(0);
    });
  });
});
