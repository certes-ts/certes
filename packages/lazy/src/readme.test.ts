import { compose, pipe } from '@certes/composition';
import { describe, expect, it } from 'vitest';
import {
  chunk,
  collect,
  filter,
  generate,
  iterate,
  map,
  range,
  repeat,
  replicate,
  scan,
  take,
  zip,
} from '.';

describe('@certes/lazy - README Examples', () => {
  describe('Quick Start', () => {
    it('should process data lazily through a pipeline', () => {
      const result = pipe(
        filter((x: number) => x % 2 === 0),
        map((x: number) => x * x),
        take(5),
        collect,
      )(range(1, 1000));

      expect(result).toEqual([4, 16, 36, 64, 100]);
    });

    it('should create reusable iterables', () => {
      const evens = filter((x: number) => x % 2 === 0)([1, 2, 3, 4, 5, 6]);

      expect([...evens]).toEqual([2, 4, 6]);
      expect([...evens]).toEqual([2, 4, 6]); // Second iteration
    });
  });

  describe('Generators', () => {
    describe('generate', () => {
      it('should generate squares from index function', () => {
        const result = collect(take(5)(generate((i) => i * i)));
        expect(result).toEqual([0, 1, 4, 9, 16]);
      });
    });

    describe('iterate', () => {
      it('should generate powers of 2 by repeated application', () => {
        const result = collect(take(5)(iterate((x: number) => x * 2)(1)));
        expect(result).toEqual([1, 2, 4, 8, 16]);
      });
    });

    describe('range', () => {
      it('should create inclusive range of integers', () => {
        const result = [...range(1, 5)];
        expect(result).toEqual([1, 2, 3, 4, 5]);
      });
    });

    describe('repeat', () => {
      it('should infinitely repeat a value (with take)', () => {
        const result = collect(take(3)(repeat('x')));
        expect(result).toEqual(['x', 'x', 'x']);
      });
    });

    describe('replicate', () => {
      it('should finitely repeat a value', () => {
        const result = [...replicate(4)(0)];
        expect(result).toEqual([0, 0, 0, 0]);
      });
    });
  });

  describe('Transformers', () => {
    describe('scan', () => {
      it('should compute running sum', () => {
        const result = collect(
          scan((acc: number, x: number) => acc + x, 0)(range(1, 5)),
        );
        expect(result).toEqual([1, 3, 6, 10, 15]);
      });
    });

    describe('chunk', () => {
      it('should chunk into pairs', () => {
        const result = collect(chunk(2)(range(1, 6)));
        expect(result).toEqual([
          [1, 2],
          [3, 4],
          [5, 6],
        ]);
      });
    });

    describe('zip', () => {
      it('should zip two iterables', () => {
        const result = collect(zip(['a', 'b', 'c'])([1, 2, 3]));
        expect(result).toEqual([
          [1, 'a'],
          [2, 'b'],
          [3, 'c'],
        ]);
      });
    });

    describe('complex pipeline', () => {
      it('should filter, map, and chunk', () => {
        const result = pipe(
          filter((x: number) => x % 3 === 0),
          map((x: number) => x * 2),
          chunk(5),
          collect,
        )(range(1, 100));

        expect(result[0]).toEqual([6, 12, 18, 24, 30]);
        expect(result[1]).toEqual([36, 42, 48, 54, 60]);
      });
    });
  });

  describe('Terminals', () => {
    describe('collect', () => {
      it('should collect filtered results', () => {
        const result = collect(filter((x: number) => x > 3)(range(1, 5)));
        expect(result).toStrictEqual([4, 5]);
      });
    });
  });

  describe('Composition ', () => {
    describe('pipe', () => {
      it('should compute sum of squared evens', () => {
        const scanOfSquaredEvens = pipe(
          filter((x: number) => x % 2 === 0),
          map((x: number) => x * x),
          scan((acc: number, x: number) => acc + x, 0),
          collect,
        );

        const result = scanOfSquaredEvens(range(1, 10));

        expect(result).toStrictEqual([4, 20, 56, 120, 220]);
      });
    });

    describe('compose', () => {
      it('should get first three doubled', () => {
        const takeThree = take(3);
        const mapDouble = map((x: number) => x * 2);

        const firstThreeDoubled = compose(collect, mapDouble, takeThree);

        const result = firstThreeDoubled(range(1, 100));
        expect(result).toEqual([2, 4, 6]);
      });
    });
  });

  describe('Infinite Iterables', () => {
    it('should generate Fibonacci sequence', () => {
      const fibs = iterate(
        ([a, b]: [number, number]) => [b, a + b] as [number, number],
      )([0, 1]);

      const result = collect(take(10)(map(([a]: [number, number]) => a)(fibs)));
      expect(result).toEqual([0, 1, 1, 2, 3, 5, 8, 13, 21, 34]);
    });
  });

  describe('Performance - Short-circuit', () => {
    it('should only process 3 elements from large range', () => {
      const result = pipe(
        filter((x: number) => x % 2 === 0),
        take(3),
        collect,
      )(range(1, 1_000_000));

      expect(result).toEqual([2, 4, 6]);
    });
  });
});
