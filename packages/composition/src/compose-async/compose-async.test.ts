import { describe, expect, it } from 'vitest';
import { composeAsync } from '.';

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

describe('ComposeAsync', () => {
  describe('Basic Functionality', () => {
    it('should compose async functions right-to-left', async () => {
      const composed = composeAsync(asyncAdd3, asyncMultiply2, asyncSubtract1);

      const result = await composed(10);

      // subtract1(10) = 9, multiply2(9) = 18, add3(18) = 21
      expect(result).toBe(21);
    });

    it('should handle single async function', async () => {
      const composed = composeAsync(asyncAdd3);

      expect(await composed(5)).toBe(8);
    });

    it('should handle mixed sync and async functions', async () => {
      const composed = composeAsync(
        asyncUppercase, // async
        stringify, // sync
        asyncMultiply2, // async
        add3, // sync
      );

      const result = await composed(5);

      // add3(5) = 8, multiply2(8) = 16, stringify(16) = "16", uppercase("16") = "16"
      expect(result).toBe('16');
    });

    it('should handle n-ary rightmost function', async () => {
      const binaryAdd = async (a: number, b: number): Promise<number> => a + b;

      const composed = composeAsync(asyncMultiply2, asyncAdd3, binaryAdd);

      const result = await composed(5, 3);

      // binaryAdd(5, 3) = 8, add3(8) = 11, multiply2(11) = 22
      expect(result).toBe(22);
    });

    it('should handle ternary rightmost function', async () => {
      const ternaryAdd = async (
        a: number,
        b: number,
        c: number,
      ): Promise<number> => a + b + c;

      const composed = composeAsync(asyncStringify, asyncMultiply2, ternaryAdd);

      const result = await composed(2, 3, 4);

      // ternaryAdd(2, 3, 4) = 9, multiply2(9) = 18, stringify(18) = "18"
      expect(result).toBe('18');
    });

    it('should return Promise even for all-sync functions', async () => {
      const composed = composeAsync(add3, multiply2);

      const result = composed(5);

      expect(result).toBeInstanceOf(Promise);
      expect(await result).toBe(13);
    });
  });

  describe('Error Handling', () => {
    it('should propagate errors from async functions', async () => {
      const composed = composeAsync(
        asyncAdd3,
        async () => asyncThrow('Test error'),
        asyncMultiply2,
      );

      await expect(composed(5)).rejects.toThrow('Test error');
    });

    it('should propagate errors from sync functions', async () => {
      const composed = composeAsync(
        asyncAdd3,
        () => syncThrow('Sync error'),
        asyncMultiply2,
      );

      await expect(composed(5)).rejects.toThrow('Sync error');
    });

    it('should throw on excessive composition depth', () => {
      const functions = Array(1001).fill(asyncAdd3);

      // @ts-expect-error For testing
      expect(() => composeAsync(...functions)).toThrow(RangeError);
      // @ts-expect-error For testing
      expect(() => composeAsync(...functions)).toThrow(
        'Async composition depth exceeds 1000',
      );
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

      const composed = composeAsync(fn1, fn2, fn3);
      await composed(10);

      // Right-to-left: fn3, fn2, fn1
      expect(executionOrder).toEqual([3, 2, 1]);
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

      const composed = composeAsync(fn3, fn2, fn1);
      await composed(10);

      // Should execute sequentially, not in parallel
      expect(results).toEqual([1, 2, 3]);
    });
  });

  describe('Associativity Law', () => {
    it('compose(f, g, h) ≡ manual groupings', async () => {
      const f = asyncAdd3;
      const g = asyncMultiply2;
      const h = asyncSubtract1;

      // Create intermediate compositions with explicit types
      const gh: (x: number) => Promise<number> = composeAsync(g, h);
      const fg: (x: number) => Promise<number> = composeAsync(f, g);

      const left = composeAsync(f, gh);
      const right = composeAsync(fg, h);
      const direct = composeAsync(f, g, h);

      const testValue = 10;
      const expected = await f(await g(await h(testValue)));

      expect(await left(testValue)).toBe(expected);
      expect(await right(testValue)).toBe(expected);
      expect(await direct(testValue)).toBe(expected);
    });

    it('associativity holds with mixed sync/async', async () => {
      const f = asyncAdd3;
      const g = multiply2; // sync
      const h = asyncSubtract1;

      const gh: (x: number) => Promise<number> = composeAsync(g, h);
      const fg: (x: number) => Promise<number> = composeAsync(f, g);

      const left = composeAsync(f, gh);
      const right = composeAsync(fg, h);

      const testValue = 10;

      expect(await left(testValue)).toBe(await right(testValue));
    });
  });

  describe('Identity Law', () => {
    it('left identity: compose(id, f) ≡ f', async () => {
      const f = asyncAdd3;

      const composed = composeAsync(asyncIdentity, f);

      const testValue = 10;
      expect(await composed(testValue)).toBe(await f(testValue));
    });

    it('right identity: compose(f, id) ≡ f', async () => {
      const f = asyncAdd3;

      const composed = composeAsync(f, asyncIdentity);

      const testValue = 10;
      expect(await composed(testValue)).toBe(await f(testValue));
    });

    it('associativity holds with mixed sync/async', async () => {
      const f = asyncAdd3;

      const leftId = composeAsync(identity, f);
      const rightId = composeAsync(f, identity);

      const testValue = 10;
      expect(await leftId(testValue)).toBe(await f(testValue));
      expect(await rightId(testValue)).toBe(await f(testValue));
    });

    it('compose(id) ≡ id', async () => {
      const composedId = composeAsync(asyncIdentity);

      const testValue = 42;
      expect(await composedId(testValue)).toBe(await asyncIdentity(testValue));
    });
  });
});
