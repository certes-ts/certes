import { describe, expect, it } from 'vitest';
import { takeEager } from '.';

describe('takeEager', () => {
  describe('positive cases', () => {
    it('should take n elements and return an array', () => {
      const result = takeEager(3)([1, 2, 3, 4, 5]);

      expect(result).toEqual([1, 2, 3]);
    });

    it('should return all elements if n exceeds length', () => {
      const result = takeEager(10)([1, 2, 3]);

      expect(result).toEqual([1, 2, 3]);
    });

    it('should return empty array when n is 0', () => {
      const result = takeEager(0)([1, 2, 3]);

      expect(result).toEqual([]);
    });
  });
});
