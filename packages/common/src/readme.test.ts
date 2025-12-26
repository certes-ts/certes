import { describe, expect, it, vi } from 'vitest';
import { lookup, noop, once, tap } from '.';

describe('README Examples', () => {
  describe('lookup', () => {
    it('should lookup status codes with default handler', () => {
      const statusCodes = {
        200: 'OK',
        404: 'Not Found',
        500: 'Internal Server Error',
      } as const;
      type Statuses = (typeof statusCodes)[keyof typeof statusCodes];

      const getStatus = lookup(
        statusCodes,
        (x: Statuses | undefined) => x ?? 'Unknown',
      );

      expect(getStatus(200)).toEqual('OK');
      expect(getStatus(999)).toEqual('Unknown');
    });
  });

  describe('noop', () => {
    it('should be usable as conditional handler', () => {
      const isDevelopment = false;
      const handler = isDevelopment ? console.log : noop;

      expect(() => handler('Debug message')).not.toThrow();
      expect(handler('Debug message')).toBeUndefined();
    });
  });

  describe('once', () => {
    it('should cache database initialization result', async () => {
      const mockConnect = vi.fn().mockResolvedValue('connection');
      const connectDb = async () => {
        console.log('Connecting to database...');
        return await mockConnect();
      };

      const initializeDatabase = once(connectDb);

      const result1 = await initializeDatabase();
      const result2 = await initializeDatabase();
      const result3 = await initializeDatabase();

      expect(result1).toEqual('connection');
      expect(result2).toEqual('connection');
      expect(result3).toEqual('connection');
      expect(mockConnect).toHaveBeenCalledTimes(1);
    });
  });

  describe('tap', () => {
    it('should log without changing values in pipeline', () => {
      const logs: string[] = [];
      const mockLog = (msg: string) => logs.push(msg);

      const processData = (input: string): string[] => {
        const logTrim = tap((x: string) => mockLog(`After trim: ${x}`));
        const logLowercase = tap((x: string) =>
          mockLog(`After lowercase: ${x}`),
        );

        return logLowercase(logTrim(input.trim()).toLowerCase()).split(' ');
      };

      const result = processData('  HELLO WORLD  ');

      expect(result).toStrictEqual(['hello', 'world']);
      expect(logs).toStrictEqual([
        'After trim: HELLO WORLD',
        'After lowercase: hello world',
      ]);
    });
  });
});
