import { describe, expect, it } from 'vitest';
import { struct, structView } from './factory-functions';
import {
  array,
  circular,
  float32,
  float64,
  int8,
  int16,
  int32,
  uint8,
  uint16,
  uint32,
  utf8,
} from './fields';

describe('StructView', () => {
  describe('get/set primitives', () => {
    it('should get and set primitive fields', () => {
      const def = struct({
        id: uint32,
        value: float32,
      });

      const view = structView(def);

      view.set('id', 42);
      view.set('value', 3.14);

      expect(view.get('id')).toBe(42);
      expect(view.get('value')).toBeCloseTo(3.14, 2);
    });

    it('should handle all primitive types', () => {
      const def = struct({
        i8: int8,
        u8: uint8,
        i16: int16,
        u16: uint16,
        i32: int32,
        u32: uint32,
        f32: float32,
        f64: float64,
      });

      const view = structView(def);

      view.set('i8', -100);
      view.set('u8', 200);
      view.set('i16', -30000);
      view.set('u16', 60000);
      view.set('i32', -2000000000);
      view.set('u32', 4000000000);
      view.set('f32', 3.14);
      view.set('f64', 4.718281828);

      expect(view.get('i8')).toBe(-100);
      expect(view.get('u8')).toBe(200);
      expect(view.get('i16')).toBe(-30000);
      expect(view.get('u16')).toBe(60000);
      expect(view.get('i32')).toBe(-2000000000);
      expect(view.get('u32')).toBe(4000000000);
      expect(view.get('f32')).toBeCloseTo(3.14, 2);
      expect(view.get('f64')).toBeCloseTo(4.718281828, 9);
    });
  });

  describe('get arrays', () => {
    it('should return a TypedArray view for array fields', () => {
      const def = struct({
        position: array('f32', 3),
      });

      const view = structView(def);
      const pos = view.get('position');

      pos[0] = 10.5;
      pos[1] = 20.3;
      pos[2] = 30.1;

      expect(pos).toBeInstanceOf(Float32Array);
      expect(pos.length).toBe(3);
      expect(view.get('position')[0]).toBe(10.5);
    });

    it('should support multiple array types', () => {
      const def = struct({
        bytes: array('u8', 4),
        floats: array('f32', 3),
        doubles: array('f64', 2),
      });

      const view = structView(def);
      const bytes = view.get('bytes');
      const floats = view.get('floats');
      const doubles = view.get('doubles');

      bytes[0] = 255;
      floats[0] = 1.23;
      doubles[0] = 5.432;

      expect(bytes).toBeInstanceOf(Uint8Array);
      expect(floats).toBeInstanceOf(Float32Array);
      expect(doubles).toBeInstanceOf(Float64Array);
      expect(view.get('bytes')[0]).toBe(255);
      expect(view.get('floats')[0]).toBeCloseTo(1.23, 2);
      expect(view.get('doubles')[0]).toBeCloseTo(5.432, 3);
    });
  });

  describe('get/set utf8', () => {
    it('should get and set utf8 fields', () => {
      const def = struct({
        name: utf8(32),
      });

      const view = structView(def);
      const nameField = view.get('name');

      nameField.set('TestName');

      expect(nameField.get()).toBe('TestName');
    });

    it('should truncate strings exceeding the byte length', () => {
      const def = struct({
        tag: utf8(4),
      });

      const view = structView(def);
      const field = view.get('tag');

      field.set('VeryLongString');

      expect(field.get().length).toBeLessThanOrEqual(4);
    });

    it('should pad with nulls', () => {
      const def = struct({
        name: utf8(16),
      });

      const view = structView(def);
      const field = view.get('name');

      field.set('Hi');

      expect(field.get()).toBe('Hi');
      expect(field.getRaw().length).toBe(16);
    });

    it('should handle empty strings', () => {
      const def = struct({
        name: utf8(16),
      });

      const view = structView(def);
      const field = view.get('name');

      field.set('');

      expect(field.get()).toBe('');
    });
  });

  describe('get circular buffer', () => {
    it('should get circular buffer field', () => {
      const def = struct({
        history: circular('f32', 5),
      });

      const view = structView(def);
      const hist = view.get('history');

      hist.enqueue(1.0);
      hist.enqueue(2.0);
      hist.enqueue(3.0);

      expect(hist.size()).toBe(3);
      expect(hist.toArray()).toEqual([1.0, 2.0, 3.0]);
    });

    it('should handle buffer wraparound', () => {
      const def = struct({
        readings: circular('u32', 3),
      });

      const view = structView(def);
      const readings = view.get('readings');

      readings.enqueue(1);
      readings.enqueue(2);
      readings.enqueue(3);
      readings.enqueue(4); // Overwrites 1

      expect(readings.toArray()).toEqual([2, 3, 4]);
    });
  });

  describe('set on complex fields', () => {
    it('should throw when trying to set an array field', () => {
      const def = struct({
        position: array('f32', 3),
      });

      const view = structView(def);

      // biome-ignore lint/suspicious/noExplicitAny: For testing
      expect(() => view.set('position', 123 as any)).toThrow(
        "Cannot use set() on complex field 'position'",
      );
    });

    it('should throw when trying to set a utf8 field', () => {
      const def = struct({
        name: utf8(16),
      });

      const view = structView(def);

      // biome-ignore lint/suspicious/noExplicitAny: For testing
      expect(() => view.set('name', 123 as any)).toThrow(
        "Cannot use set() on complex field 'name'",
      );
    });

    it('should throw when trying to set a circular buffer field', () => {
      const def = struct({
        history: circular('f32', 5),
      });

      const view = structView(def);

      // biome-ignore lint/suspicious/noExplicitAny: For testing
      expect(() => view.set('history', 123 as any)).toThrow(
        "Cannot use set() on complex field 'history'",
      );
    });
  });

  describe('init', () => {
    it('should initialize multiple primitive fields', () => {
      const def = struct({
        id: uint32,
        health: float32,
        mana: float32,
      });

      const view = structView(def);

      view.init({
        id: 42,
        health: 100.0,
        mana: 50.0,
      });

      expect(view.get('id')).toBe(42);
      expect(view.get('health')).toBe(100.0);
      expect(view.get('mana')).toBe(50.0);
    });

    it('should skip undefined values', () => {
      const def = struct({
        a: uint32,
        b: uint32,
      });

      const view = structView(def);

      view.set('a', 10);
      view.set('b', 20);
      view.init({ a: 999 });

      expect(view.get('a')).toBe(999);
      expect(view.get('b')).toBe(20); // Unchanged
    });
  });

  describe('copyFrom', () => {
    it('should copy all fields from another view', () => {
      const def = struct({
        id: uint32,
        value: float32,
        position: array('f32', 3),
      });

      const src = structView(def);
      const dst = structView(def);

      src.set('id', 42);
      src.set('value', 3.14);
      src.get('position')[0] = 10.5;
      dst.copyFrom(src);

      expect(dst.get('id')).toBe(42);
      expect(dst.get('value')).toBeCloseTo(3.14, 2);
      expect(dst.get('position')[0]).toBe(10.5);
    });
  });
});
