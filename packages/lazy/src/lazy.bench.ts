import { pipe } from '@certes/composition/pipe';
import { bench, describe } from 'vitest';
import { chunk, collect, filter, map, take } from '../src/index';

const smallArray = Array.from({ length: 100 }, (_, i) => i);
const mediumArray = Array.from({ length: 10_000 }, (_, i) => i);
const largeArray = Array.from({ length: 1_000_000 }, (_, i) => i);

const square = (x: number) => x * x;
const isEven = (x: number) => x % 2 === 0;
const add10 = (x: number) => x + 10;

describe('lazy map vs native map - small array', () => {
  bench('native', () => {
    const _result = smallArray.map(square);
  });

  bench('lazy (collected)', () => {
    const _result = collect(map(square)(smallArray));
  });
});

describe('lazy map vs native map - large array', () => {
  bench('native', () => {
    const _result = largeArray.map(square);
  });

  bench('lazy (collected)', () => {
    const _result = collect(map(square)(largeArray));
  });
});

describe('lazy map vs native map - chain of 3 maps', () => {
  bench('native', () => {
    const _result = mediumArray.map(square).map(add10).map(square);
  });

  bench('lazy', () => {
    const _result = collect(
      pipe(map(square), map(add10), map(square))(mediumArray),
    );
  });
});

describe('lazy filter vs native filter - small array', () => {
  bench('native', () => {
    const _result = smallArray.filter(isEven);
  });

  bench('lazy (collected)', () => {
    const _result = collect(filter(isEven)(smallArray));
  });
});

describe('lazy filter vs native filter - large array', () => {
  bench('native', () => {
    const _result = largeArray.filter(isEven);
  });

  bench('lazy (collected)', () => {
    const _result = collect(filter(isEven)(largeArray));
  });
});

describe('chunk performance - simple chunking', () => {
  bench('native chunking (manual)', () => {
    const result: number[][] = [];
    const chunkSize = 100;
    for (let i = 0; i < mediumArray.length; i += chunkSize) {
      result.push(mediumArray.slice(i, i + chunkSize));
    }
  });

  bench('lazy chunk', () => {
    const _result = collect(chunk(100)(mediumArray));
  });
});

describe('chunk performance - chunking with processing', () => {
  bench('native chunking with processing', () => {
    const result: number[][] = [];
    const chunkSize = 100;
    for (let i = 0; i < largeArray.length; i += chunkSize) {
      const chunk = largeArray.slice(i, i + chunkSize);
      if (chunk.some((x) => x % 1000 === 0)) {
        result.push(chunk);
      }
    }
  });

  bench('lazy chunk with filter', () => {
    const _result = collect(
      filter((chunk: number[]) => chunk.some((x) => x % 1000 === 0))(
        chunk(100)(largeArray),
      ),
    );
  });
});

describe('early termination benefits - first 10', () => {
  bench('native - map + filter + slice(0, 10)', () => {
    const _result = largeArray.map(square).filter(isEven).slice(0, 10);
  });

  bench('lazy - map + filter + take(10)', () => {
    const _result = collect(
      pipe(map(square), filter(isEven), take(10))(largeArray),
    );
  });
});

describe('early termination benefits - find first 100 matching', () => {
  bench('native', () => {
    const result: number[] = [];
    const mapped = largeArray.map(square);

    for (const item of mapped) {
      if (item > 1000) {
        result.push(item);
        if (result.length === 100) {
          break;
        }
      }
    }
  });

  bench('lazy', () => {
    const _result = collect(
      pipe(
        map(square),
        filter((x: number) => x > 1000),
        take(100),
      )(largeArray),
    );
  });
});

describe('complex pipeline performance', () => {
  bench('native', () => {
    const _result = largeArray
      .map((x) => x * 2)
      .filter((x) => x % 3 === 0)
      .map((x) => x + 1)
      .filter((x) => x > 100)
      .slice(0, 1000);
  });

  bench('lazy', () => {
    const _result = collect(
      pipe(
        map((x: number) => x * 2),
        filter((x: number) => x % 3 === 0),
        map((x: number) => x + 1),
        filter((x: number) => x > 100),
        take(1000),
      )(largeArray),
    );
  });
});

describe('real-world scenarios - process error logs', () => {
  // Simulate processing log entries
  const logEntries = Array.from({ length: 100_000 }, (_, i) => ({
    timestamp: Date.now() + i * 1000,
    level: i % 5 === 0 ? 'ERROR' : i % 3 === 0 ? 'WARN' : 'INFO',
    message: `Log entry ${i}`,
    userId: i % 100,
  }));

  bench('native', () => {
    const _result = logEntries
      .filter((log) => log.level === 'ERROR')
      .map((log) => ({
        ...log,
        processed: true,
        severity: 10,
      }))
      .slice(0, 100);
  });

  bench('lazy', () => {
    const _result = collect(
      pipe(
        filter((log: (typeof logEntries)[0]) => log.level === 'ERROR'),
        map((log: (typeof logEntries)[0]) => ({
          ...log,
          processed: true,
          severity: 10,
        })),
        take(100),
      )(logEntries),
    );
  });
});

describe('real-world scenarios - ETL pipeline', () => {
  // Simulate processing log entries
  const logEntries = Array.from({ length: 100_000 }, (_, i) => ({
    timestamp: Date.now() + i * 1000,
    level: i % 5 === 0 ? 'ERROR' : i % 3 === 0 ? 'WARN' : 'INFO',
    message: `Log entry ${i}`,
    userId: i % 100,
  }));

  // Simulate data transformation pipeline
  bench('native', () => {
    const _result = logEntries
      .filter((log) => log.userId < 50)
      .map((log) => ({
        time: new Date(log.timestamp).toISOString(),
        user: `user_${log.userId}`,
        level: log.level,
      }))
      .filter((log) => log.level !== 'INFO')
      .slice(0, 500);
  });

  bench('lazy', () => {
    const _result = collect(
      pipe(
        filter((log: (typeof logEntries)[0]) => log.userId < 50),
        map((log: (typeof logEntries)[0]) => ({
          time: new Date(log.timestamp).toISOString(),
          user: `user_${log.userId}`,
          level: log.level,
        })),
        // biome-ignore lint/suspicious/noExplicitAny: Testing
        filter((log: any) => log.level !== 'INFO'),
        take(500),
      )(logEntries),
    );
  });
});
