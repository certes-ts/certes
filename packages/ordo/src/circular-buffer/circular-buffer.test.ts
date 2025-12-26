import { describe, expect, it } from 'vitest';
import { circularBuffer, circularBufferFrom } from '.';

describe('CircularBuffer', () => {
  describe('constructor', () => {
    it('should create a buffer with valid parameters', () => {
      const buf = circularBuffer('f32', 10);

      expect(buf.capacity()).toBe(10);
      expect(buf.size()).toBe(0);
    });

    it('should throw on invalid buffer type - empty string', () => {
      // biome-ignore lint/suspicious/noExplicitAny: Testing
      expect(() => circularBuffer('' as any, 10)).toThrow(
        'bufferType must be provided',
      );
    });

    it('should throw on invalid buffer type - unknown type', () => {
      // biome-ignore lint/suspicious/noExplicitAny: Testing
      expect(() => circularBuffer('invalid' as any, 10)).toThrow(
        'Unknown buffer type',
      );
    });

    it('should throw on zero capacity', () => {
      expect(() => circularBuffer('f32', 0)).toThrow(
        'capacity must be greater than 0',
      );
    });

    it('should throw on negative capacity', () => {
      expect(() => circularBuffer('f32', -1)).toThrow(
        'capacity must be greater than 0',
      );
    });
  });

  describe('enqueue', () => {
    it('should add elements to the empty buffer', () => {
      const buf = circularBuffer('u32', 5);

      buf.enqueue(10);
      buf.enqueue(20);

      expect(buf.size()).toBe(2);
      expect(buf.peek()).toBe(10);
    });

    it('should wrap around when full', () => {
      const buf = circularBuffer('u32', 3);

      buf.enqueue(1);
      buf.enqueue(2);
      buf.enqueue(3);
      buf.enqueue(4);

      expect(buf.size()).toBe(3);
      expect(buf.toArray()).toEqual([2, 3, 4]);
    });

    it('should maintain FIFO order', () => {
      const buf = circularBuffer('i32', 10);

      for (let i = 0; i < 5; i++) {
        buf.enqueue(i);
      }

      expect(buf.toArray()).toEqual([0, 1, 2, 3, 4]);
    });

    it('should handle multiple wraparounds', () => {
      const buf = circularBuffer('u8', 3);

      for (let i = 0; i < 10; i++) {
        buf.enqueue(i);
      }

      expect(buf.size()).toBe(3);
      expect(buf.toArray()).toEqual([7, 8, 9]);
    });
  });

  describe('dequeue', () => {
    it('should remove and return oldest element', () => {
      const buf = circularBuffer('f64', 5);

      buf.enqueue(1.5);
      buf.enqueue(2.5);

      const result = buf.dequeue();

      expect(result).toBe(1.5);
      expect(buf.size()).toBe(1);
    });

    it('should throw when empty', () => {
      const buf = circularBuffer('u8', 5);

      expect(() => buf.dequeue()).toThrow('Cannot dequeue from empty buffer');
    });

    it('should handle multiple dequeues', () => {
      const buf = circularBuffer('i16', 5);

      buf.enqueue(10);
      buf.enqueue(20);
      buf.enqueue(30);

      const first = buf.dequeue();
      const second = buf.dequeue();
      const third = buf.dequeue();

      expect(first).toBe(10);
      expect(second).toBe(20);
      expect(third).toBe(30);
      expect(buf.size()).toBe(0);
    });
  });

  describe('peek', () => {
    it('should return oldest element without removing', () => {
      const buf = circularBuffer('i16', 5);

      buf.enqueue(100);
      buf.enqueue(200);

      const result = buf.peek();

      expect(result).toBe(100);
      expect(buf.size()).toBe(2);
    });

    it('should throw when empty', () => {
      const buf = circularBuffer('u16', 5);

      expect(() => buf.peek()).toThrow('Cannot peek into empty buffer');
    });

    it('should always return head element', () => {
      const buf = circularBuffer('u32', 3);

      buf.enqueue(1);
      buf.enqueue(2);
      buf.enqueue(3);
      buf.enqueue(4); // Overwrites 1

      expect(buf.peek()).toBe(2); // New head
    });
  });

  describe('clear', () => {
    it('should reset the buffer to an empty state', () => {
      const buf = circularBuffer('f32', 5);

      buf.enqueue(1);
      buf.enqueue(2);
      buf.enqueue(3);

      buf.clear();

      expect(buf.size()).toBe(0);
      expect(buf.toArray()).toEqual([]);
    });

    it('should allow reuse after cleared', () => {
      const buf = circularBuffer('u32', 3);

      buf.enqueue(1);
      buf.enqueue(2);
      buf.clear();

      buf.enqueue(10);
      buf.enqueue(20);

      expect(buf.toArray()).toEqual([10, 20]);
    });
  });

  describe('toArray', () => {
    it('should return elements in FIFO order', () => {
      const buf = circularBuffer('u32', 5);

      buf.enqueue(10);
      buf.enqueue(20);
      buf.enqueue(30);

      const result = buf.toArray();

      expect(result).toEqual([10, 20, 30]);
    });

    it('should handle wrapped buffer', () => {
      const buf = circularBuffer('i32', 3);

      buf.enqueue(1);
      buf.enqueue(2);
      buf.enqueue(3);
      buf.enqueue(4);
      buf.enqueue(5);

      const result = buf.toArray();

      expect(result).toEqual([3, 4, 5]);
    });

    it('should return an empty array for an empty buffer', () => {
      const buf = circularBuffer('f64', 5);
      const result = buf.toArray();

      expect(result).toEqual([]);
    });
  });

  describe('from', () => {
    it('should create a buffer from an array', () => {
      const arr = [1, 2, 3, 4, 5];
      const buf = circularBufferFrom('f64', arr);

      expect(buf.size()).toBe(5);
      expect(buf.toArray()).toEqual(arr);
    });

    it('should throw on empty array', () => {
      expect(() => circularBufferFrom('u32', [])).toThrow(
        'arr must be an array with length greater than 0',
      );
    });

    it('should set capacity equal to the array length', () => {
      const arr = [10, 20, 30];
      const buf = circularBufferFrom('i32', arr);

      expect(buf.capacity()).toBe(3);
      expect(buf.size()).toBe(3);
    });
  });

  describe('iterator', () => {
    it('should iterate in FIFO order', () => {
      const buf = circularBuffer('i32', 5);

      buf.enqueue(10);
      buf.enqueue(20);
      buf.enqueue(30);

      const result = Array.from(buf);

      expect(result).toEqual([10, 20, 30]);
    });

    it('should handle wrapped buffer', () => {
      const buf = circularBuffer('u32', 3);

      buf.enqueue(1);
      buf.enqueue(2);
      buf.enqueue(3);
      buf.enqueue(4);

      const result = Array.from(buf);

      expect(result).toEqual([2, 3, 4]);
    });

    it('should work with a for...of loop', () => {
      const buf = circularBuffer('f32', 5);

      buf.enqueue(1);
      buf.enqueue(2);
      buf.enqueue(3);

      const result: number[] = [];
      for (const val of buf) {
        result.push(val);
      }

      expect(result).toEqual([1, 2, 3]);
    });
  });

  describe('Type Support', () => {
    it('should support all numeric types', () => {
      const u8 = circularBuffer('u8', 2);
      const i8 = circularBuffer('i8', 2);
      const u16 = circularBuffer('u16', 2);
      const i16 = circularBuffer('i16', 2);
      const u32 = circularBuffer('u32', 2);
      const i32 = circularBuffer('i32', 2);
      const f32 = circularBuffer('f32', 2);
      const f64 = circularBuffer('f64', 2);

      expect(u8.capacity()).toBe(2);
      expect(i8.capacity()).toBe(2);
      expect(u16.capacity()).toBe(2);
      expect(i16.capacity()).toBe(2);
      expect(u32.capacity()).toBe(2);
      expect(i32.capacity()).toBe(2);
      expect(f32.capacity()).toBe(2);
      expect(f64.capacity()).toBe(2);
    });
  });
});
