import { describe, expect, it } from 'vitest';
import { pipeAsync } from '.';

// Async helpers
const asyncAdd3 = async (x: number): Promise<number> => x + 3;
const asyncMultiply2 = async (x: number): Promise<number> => x * 2;
const asyncSubtract1 = async (x: number): Promise<number> => x - 1;
const asyncStringify = async (x: number): Promise<string> => x.toString();
const asyncUppercase = async (x: string): Promise<string> => x.toUpperCase();
const asyncDelay = async <T>(ms: number, value: T): Promise<T> => {
  await new Promise((resolve) => setTimeout(resolve, ms));
  return value;
};

// Sync helpers (to test mixed sync/async)
const add3 = (x: number): number => x + 3;
const multiply2 = (x: number): number => x * 2;
const stringify = (x: number): string => x.toString();

// Identity functions
const asyncIdentity = async <T>(x: T): Promise<T> => x;
const identity = <T>(x: T): T => x;

// Error helpers
// biome-ignore lint/suspicious/useAwait: This is for testing
const asyncThrow = async (message: string): Promise<never> => {
  throw new Error(message);
};

const syncThrow = (message: string): never => {
  throw new Error(message);
};

describe('PipeAsync', () => {
  describe('Basic Functionality', () => {
    it('should pipe async functions left-to-right', async () => {
      const piped = pipeAsync(asyncSubtract1, asyncMultiply2, asyncAdd3);

      const result = await piped(10);

      // subtract1(10) = 9, multiply2(9) = 18, add3(18) = 21
      expect(result).toBe(21);
    });

    it('should handle single async function', async () => {
      const piped = pipeAsync(asyncAdd3);

      expect(await piped(5)).toBe(8);
    });

    it('should handle mixed sync and async functions', async () => {
      const piped = pipeAsync(
        add3, // sync
        asyncMultiply2, // async
        stringify, // sync
        asyncUppercase, // async
      );

      const result = await piped(5);

      // add3(5) = 8, multiply2(8) = 16, stringify(16) = "16", uppercase("16") = "16"
      expect(result).toBe('16');
    });

    it('should handle n-ary leftmost function', async () => {
      const binaryAdd = async (a: number, b: number): Promise<number> => a + b;

      const piped = pipeAsync(binaryAdd, asyncAdd3, asyncMultiply2);

      const result = await piped(5, 3);

      // binaryAdd(5, 3) = 8, add3(8) = 11, multiply2(11) = 22
      expect(result).toBe(22);
    });

    it('should handle ternary leftmost function', async () => {
      const ternaryAdd = async (
        a: number,
        b: number,
        c: number,
      ): Promise<number> => a + b + c;

      const piped = pipeAsync(ternaryAdd, asyncMultiply2, asyncStringify);

      const result = await piped(2, 3, 4);

      // ternaryAdd(2, 3, 4) = 9, multiply2(9) = 18, stringify(18) = "18"
      expect(result).toBe('18');
    });

    it('should return Promise even for all-sync functions', async () => {
      const piped = pipeAsync(add3, multiply2);

      const result = piped(5);

      expect(result).toBeInstanceOf(Promise);
      expect(await result).toBe(16);
    });
  });

  describe('Error Handling', () => {
    it('should propagate errors from async functions', async () => {
      const piped = pipeAsync(
        asyncMultiply2,
        async () => asyncThrow('Test error'),
        asyncAdd3,
      );

      await expect(piped(5)).rejects.toThrow('Test error');
    });

    it('should propagate errors from sync functions', async () => {
      const piped = pipeAsync(
        asyncMultiply2,
        () => syncThrow('Sync error'),
        asyncAdd3,
      );

      await expect(piped(5)).rejects.toThrow('Sync error');
    });
  });

  describe('Async Execution Order', () => {
    it('should execute in correct order', async () => {
      const executionOrder: number[] = [];

      const fn1 = async (x: number) => {
        await executionOrder.push(1);
        return x + 1;
      };
      const fn2 = async (x: number) => {
        await executionOrder.push(2);
        return x * 2;
      };
      const fn3 = async (x: number) => {
        await executionOrder.push(3);
        return x - 1;
      };

      const piped = pipeAsync(fn1, fn2, fn3);
      await piped(10);

      // Left-to-right: fn1, fn2, fn3
      expect(executionOrder).toEqual([1, 2, 3]);
    });

    it('should await each function before calling next', async () => {
      const results: number[] = [];

      const fn1 = async (x: number) => {
        await asyncDelay(30, x);
        results.push(1);
        return x + 1;
      };
      const fn2 = async (x: number) => {
        await asyncDelay(20, x);
        results.push(2);
        return x * 2;
      };
      const fn3 = async (x: number) => {
        await asyncDelay(10, x);
        results.push(3);
        return x - 1;
      };

      const piped = pipeAsync(fn1, fn2, fn3);
      await piped(10);

      // Should execute sequentially, not in parallel
      expect(results).toEqual([1, 2, 3]);
    });
  });

  describe('Associativity Law', () => {
    it('pipe(f, g, h) ≡ manual groupings', async () => {
      const f = asyncAdd3;
      const g = asyncMultiply2;
      const h = asyncSubtract1;

      const left = pipeAsync(pipeAsync(f, g), h);
      const right = pipeAsync(f, pipeAsync(g, h));
      const direct = pipeAsync(f, g, h);

      const testValue = 10;
      const expected = await h(await g(await f(testValue)));

      expect(await left(testValue)).toBe(expected);
      expect(await right(testValue)).toBe(expected);
      expect(await direct(testValue)).toBe(expected);
    });

    it('associativity holds with mixed sync/async', async () => {
      const f = asyncAdd3;
      const g = multiply2; // sync
      const h = asyncSubtract1;

      const left = pipeAsync(pipeAsync(f, g), h);
      const right = pipeAsync(f, pipeAsync(g, h));

      const testValue = 10;

      expect(await left(testValue)).toBe(await right(testValue));
    });
  });

  describe('Identity Law', () => {
    it('left identity: pipe(id, f) ≡ f', async () => {
      const f = asyncAdd3;

      const piped = pipeAsync(asyncIdentity, f);

      const testValue = 10;
      expect(await piped(testValue)).toBe(await f(testValue));
    });

    it('right identity: pipe(f, id) ≡ f', async () => {
      const f = asyncAdd3;

      const piped = pipeAsync(f, asyncIdentity);

      const testValue = 10;
      expect(await piped(testValue)).toBe(await f(testValue));
    });

    it('associativity holds with mixed sync/async', async () => {
      const f = asyncAdd3;

      const leftId = pipeAsync(identity, f);
      const rightId = pipeAsync(f, identity);

      const testValue = 10;
      expect(await leftId(testValue)).toBe(await f(testValue));
      expect(await rightId(testValue)).toBe(await f(testValue));
    });

    it('pipe(id) ≡ id', async () => {
      const pipedId = pipeAsync(asyncIdentity);

      const testValue = 42;
      expect(await pipedId(testValue)).toBe(await asyncIdentity(testValue));
    });
  });
});
