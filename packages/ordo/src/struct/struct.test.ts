import { describe, expect, it } from 'vitest';
import { struct } from './factory-functions';
import { array, float32, float64, uint8, uint16, uint32 } from './fields';

describe('Struct', () => {
  describe('Memory Layout', () => {
    it('should calculate correct stride with padding', () => {
      const def = struct({
        a: uint8,
        b: float64,
        c: uint8,
      });

      // a: 1 byte at offset 0
      // [7 bytes padding]
      // b: 8 bytes at offset 8
      // c: 1 byte at offset 16
      // [7 bytes padding]
      // stride: 24
      expect(def.layout.stride).toBe(24);
      expect(def.layout.alignment).toBe(8);
    });

    it('should handle arrays with proper alignment', () => {
      const def = struct({
        position: array('f64', 3),
        id: uint32,
      });

      // position: 24 bytes at offset 0
      // id: 4 bytes at offset 24
      // [4 bytes padding]
      // stride: 32
      expect(def.layout.stride).toBe(32);
    });

    it('should calculate optimal layout for well-ordered fields', () => {
      const def = struct({
        timestamp: float64,
        position: array('f64', 3),
        health: uint16,
        active: uint8,
        team: uint8,
      });

      const wastedBytes = def.layout.stride - (8 + 24 + 2 + 1 + 1);

      expect(wastedBytes).toBeLessThanOrEqual(8);
    });

    it('should calculate poor layout for badly-ordered fields', () => {
      const badDef = struct({
        active: uint8, // 1 byte
        position: array('f64', 3), // needs 8-byte alignment
        team: uint8, // 1 byte
        rotation: array('f64', 4), // needs 8-byte alignment
      });

      // Should have significant padding
      const totalData = 1 + 24 + 1 + 32; // 58 bytes
      expect(badDef.layout.stride).toBeGreaterThan(totalData);
    });
  });

  describe('getField', () => {
    it('should return a field descriptor for a valid name', () => {
      const def = struct({
        id: uint32,
        value: float32,
      });

      const field = def.getField('id');

      expect(field.name).toBe('id');
      expect(field.type).toBe(uint32);
      expect(field.offset).toBe(0);
    });

    it('should throw for an unknown field', () => {
      const def = struct({
        id: uint32,
      });

      expect(() => def.getField('unknown')).toThrow('Unknown field: unknown');
    });
  });

  describe('inspect', () => {
    it('should not throw when called', () => {
      const def = struct({
        id: uint32,
        value: float32,
      });

      expect(() => def.inspect()).not.toThrow();
    });
  });
});
