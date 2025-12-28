import { describe, expect, it } from 'vitest';
import { compose, composeAsync, curry, pipe, pipeAsync } from '.';

describe('README Examples', () => {
  describe('Synchronous Composition', () => {
    describe('Compose', () => {
      it('should transform number to uppercase string', () => {
        const transform = compose(
          (x: string) => x.toUpperCase(),
          (x: number) => x.toString(),
          (x: number) => x + 3,
        );

        expect(transform(4)).toBe('7');
      });

      it('should work with different input values', () => {
        const transform = compose(
          (x: string) => x.toUpperCase(),
          (x: number) => x.toString(),
          (x: number) => x + 3,
        );

        expect(transform(0)).toBe('3');
        expect(transform(7)).toBe('10');
        expect(transform(-3)).toBe('0');
      });
    });

    describe('Pipe', () => {
      it('should transform number to uppercase string', () => {
        const process = pipe(
          (x: number) => x + 3,
          (x: number) => x.toString(),
          (x: string) => x.toUpperCase(),
        );

        expect(process(4)).toBe('7');
      });

      it('should work with different input values', () => {
        const process = pipe(
          (x: number) => x + 3,
          (x: number) => x.toString(),
          (x: string) => x.toUpperCase(),
        );

        expect(process(0)).toBe('3');
        expect(process(7)).toBe('10');
        expect(process(-3)).toBe('0');
      });
    });

    describe('Curry', () => {
      it('should curry multiply function - all variations', () => {
        const multiply = (a: number, b: number, c: number) => a * b * c;
        const curried = curry(multiply);

        expect(curried(2)(3)(4)).toBe(24);
        expect(curried(2, 3)(4)).toBe(24);
        expect(curried(2)(3, 4)).toBe(24);
      });

      it('should work with all arguments at once', () => {
        const multiply = (a: number, b: number, c: number) => a * b * c;
        const curried = curry(multiply);

        expect(curried(2, 3, 4)).toBe(24);
      });

      it('should work with different values', () => {
        const multiply = (a: number, b: number, c: number) => a * b * c;
        const curried = curry(multiply);

        expect(curried(1)(2)(3)).toBe(6);
        expect(curried(5, 5)(2)).toBe(50);
        expect(curried(10)(1, 1)).toBe(10);
      });
    });
  });

  describe('Asynchronous Composition', () => {
    describe('ComposeAsync', () => {
      type User = {
        id: number;
        name: string;
        email: string;
      };

      it('should compose async user notification flow', async () => {
        const fetchUser = async (id: number): Promise<User> => ({
          id,
          name: 'Test User',
          email: 'test@example.com',
        });

        // biome-ignore lint/suspicious/useAwait: For testing
        const sendEmail = async (email: string): Promise<boolean> => {
          expect(email).toBe('test@example.com');
          return true;
        };

        const notifyUser = composeAsync(
          async (email: string) => sendEmail(email),
          (user: User) => user.email,
          async (id: number) => fetchUser(id),
        );

        const result = await notifyUser(123);
        expect(result).toBe(true);
      });

      it('should work with different user IDs', async () => {
        const users: Record<number, User> = {
          1: { id: 1, name: 'Alice', email: 'alice@example.com' },
          2: { id: 2, name: 'Bob', email: 'bob@example.com' },
        };

        const fetchUser = async (id: number): Promise<User> => users[id];
        const sendEmail = async (email: string): Promise<string> =>
          `Sent to ${email}`;

        const notifyUser = composeAsync(
          async (email: string) => sendEmail(email),
          (user: User) => user.email,
          async (id: number) => fetchUser(id),
        );

        expect(await notifyUser(1)).toBe('Sent to alice@example.com');
        expect(await notifyUser(2)).toBe('Sent to bob@example.com');
      });
    });

    describe('PipeAsync', () => {
      type Data = {
        value: number;
        timestamp: number;
      };

      type Result = {
        processed: number;
        saved: boolean;
      };

      it('should pipe async URL processing flow', async () => {
        // biome-ignore lint/suspicious/useAwait: For testing
        const mockFetch = async (url: string): Promise<Response> => {
          expect(url).toBe('https://api.example.com/data');
          return {
            json: async () => ({ value: 42, timestamp: Date.now() }),
          } as Response;
        };

        const transform = (data: Data): Result => ({
          processed: data.value * 2,
          saved: false,
        });

        const saveToDb = async (result: Result): Promise<Result> => ({
          ...result,
          saved: true,
        });

        const processUrl = pipeAsync(
          async (url: string) => mockFetch(url),
          async (response: Response) => response.json(),
          (data: Data) => transform(data),
          async (result: Result) => saveToDb(result),
        );

        const result = await processUrl('https://api.example.com/data');

        expect(result.processed).toBe(84);
        expect(result.saved).toBe(true);
      });

      it('should handle different data values', async () => {
        const mockFetch = async (_url: string): Promise<Response> =>
          ({
            json: async () => ({ value: 10, timestamp: Date.now() }),
          }) as Response;

        const transform = (data: Data): number => data.value * 3;
        const saveToDb = async (value: number): Promise<string> =>
          `Saved: ${value}`;

        const processUrl = pipeAsync(
          async (url: string) => mockFetch(url),
          async (response: Response) => response.json(),
          (data: Data) => transform(data),
          async (result: number) => saveToDb(result),
        );

        expect(await processUrl('https://api.example.com/data')).toBe(
          'Saved: 30',
        );
      });
    });

    describe('Mixed Sync/Async Example', () => {
      type Data = {
        value: number;
        metadata: string;
      };

      it('should mix sync and async functions', async () => {
        const fetchData = async (x: number): Promise<Data> => ({
          value: x * 2,
          metadata: `Fetched ${x}`,
        });

        // biome-ignore lint/suspicious/useAwait: For testing
        const save = async (value: number): Promise<boolean> => {
          expect(value).toBeGreaterThan(0);
          return true;
        };

        const pipeline = pipeAsync(
          async (x: number) => fetchData(x),
          (data: Data) => data.value,
          async (value: number) => save(value),
        );

        const result = await pipeline(42);
        expect(result).toBe(true);
      });

      it('should work with different input values', async () => {
        const fetchData = async (x: number): Promise<Data> => ({
          value: x + 10,
          metadata: 'test',
        });

        const save = async (value: number): Promise<number> => value * 2;

        const pipeline = pipeAsync(
          async (x: number) => fetchData(x),
          (data: Data) => data.value,
          async (value: number) => save(value),
        );

        expect(await pipeline(5)).toBe(30); // (5 + 10) * 2
        expect(await pipeline(10)).toBe(40); // (10 + 10) * 2
      });
    });
  });

  describe('API Reference', () => {
    describe('compose', () => {
      it('compose(f, g, h)(x) === f(g(h(x)))', () => {
        const f = (x: number) => x * 2;
        const g = (x: number) => x + 5;
        const h = (x: number) => x - 1;

        const fn = compose(f, g, h);

        const x = 10;
        expect(fn(x)).toBe(f(g(h(x))));
        expect(fn(x)).toBe(28); // (10 - 1 + 5) * 2
      });
    });

    describe('pipe', () => {
      it('pipe(f, g, h)(x) === h(g(f(x)))', () => {
        const f = (x: number) => x - 1;
        const g = (x: number) => x + 5;
        const h = (x: number) => x * 2;

        const fn = pipe(f, g, h);

        const x = 10;
        expect(fn(x)).toBe(h(g(f(x))));
        expect(fn(x)).toBe(28); // (10 - 1 + 5) * 2
      });
    });

    describe('composeAsync', () => {
      it('await composeAsync(f, g, h)(x) === await f(await g(await h(x)))', async () => {
        const f = async (x: number) => x * 2;
        const g = async (x: number) => x + 5;
        const h = async (x: number) => x - 1;

        const fn = composeAsync(f, g, h);

        const x = 10;
        const result = await fn(x);
        const expected = await f(await g(await h(x)));

        expect(result).toBe(expected);
        expect(result).toBe(28); // (10 - 1 + 5) * 2
      });
    });

    describe('pipeAsync', () => {
      it('await pipeAsync(f, g, h)(x) === await h(await g(await f(x)))', async () => {
        const f = async (x: number) => x - 1;
        const g = async (x: number) => x + 5;
        const h = async (x: number) => x * 2;

        const fn = pipeAsync(f, g, h);

        const x = 10;
        const result = await fn(x);
        const expected = await h(await g(await f(x)));

        expect(result).toBe(expected);
        expect(result).toBe(28); // (10 - 1 + 5) * 2
      });
    });

    describe('curry', () => {
      it('should curry add function', () => {
        const add = (a: number, b: number, c: number) => a + b + c;
        const curriedAdd = curry(add);

        const add5 = curriedAdd(5);
        expect(add5(3, 2)).toBe(10);
      });
    });
  });
});
