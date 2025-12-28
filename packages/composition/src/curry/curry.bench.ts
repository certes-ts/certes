import { bench, describe } from 'vitest';
import { curry } from '.';

// Implementations
// ============================================================

type Curried<T extends unknown[], R> = <P extends Partial<T>>(
  ...args: P
  // biome-ignore lint/suspicious/noExplicitAny: This is intended
) => ((...args: T) => any) extends (...args: [...P, ...infer Args]) => any
  ? Args extends []
    ? R
    : Curried<Args, R>
  : never;

/**
 * Ramda-style implementation for library comparison.
 * Common pattern in FP libraries.
 */
function curryRamda<T extends (...args: unknown[]) => unknown>(
  fn: T,
): (...args: unknown[]) => unknown {
  const arity = fn.length;
  return function curried(...args: unknown[]): unknown {
    if (args.length >= arity) {
      return fn(...args);
    }
    return (...more: unknown[]) => curried(...args, ...more);
  };
}

/**
 * Original implementation for comparison baseline.
 * Uses array accumulation with concat.
 */

// biome-ignore lint/suspicious/noExplicitAny: Benchmarks
function curryOriginal<T extends (...args: any[]) => any>(
  fn: T,
  // biome-ignore lint/suspicious/noExplicitAny: This is intended
  _args = [] as any[],
): Curried<Parameters<T>, ReturnType<T>> {
  return (...__args) => {
    const argsLen = _args.length;
    const newArgsLen = __args.length;
    const totalLen = argsLen + newArgsLen;

    // Only spread when executing, not on partial application
    if (totalLen >= fn.length) {
      // Pre-allocate exact size
      const allArgs = new Array(totalLen);

      // Manual copy is faster than spread for small arrays
      for (let i = 0; i < argsLen; i++) {
        allArgs[i] = _args[i];
      }

      for (let i = 0; i < newArgsLen; i++) {
        allArgs[argsLen + i] = __args[i];
      }

      return fn(...allArgs);
    }

    // For partial application, concat is faster than spread for this use case
    return curryOriginal(fn, _args.concat(__args));
  };
}

// Test Functions
// ============================================================

const add2 = (a: number, b: number): number => a + b;
const add3 = (a: number, b: number, c: number): number => a + b + c;
const add5 = (a: number, b: number, c: number, d: number, e: number): number =>
  a + b + c + d + e;
const add6 = (
  a: number,
  b: number,
  c: number,
  d: number,
  e: number,
  f: number,
): number => a + b + c + d + e + f;

// Benchmarks
// ============================================================

describe('Curry Creation', () => {
  describe('Binary', () => {
    bench('optimized: curry(add2)', () => {
      curry(add2);
    });

    bench('original: curry(add2)', () => {
      curryOriginal(add2);
    });

    bench('ramda-style: curry(add2)', () => {
      // @ts-expect-error Not going to worry about it in a benchmark
      curryRamda(add2);
    });
  });

  describe('Ternary', () => {
    bench('optimized: curry(add3)', () => {
      curry(add3);
    });

    bench('original: curry(add3)', () => {
      curryOriginal(add3);
    });

    bench('ramda-style: curry(add3)', () => {
      // @ts-expect-error Not going to worry about it in a benchmark
      curryRamda(add3);
    });
  });

  describe('Quinary', () => {
    bench('optimized: curry(add5)', () => {
      curry(add5);
    });

    bench('original: curry(add5)', () => {
      curryOriginal(add5);
    });

    bench('ramda-style: curry(add5)', () => {
      // @ts-expect-error Not going to worry about it in a benchmark
      curryRamda(add5);
    });
  });
});

describe('Full Application', () => {
  describe('Ternary', () => {
    const optAdd3 = curry(add3);
    const origAdd3 = curryOriginal(add3);
    // @ts-expect-error Benchmark
    const ramdaAdd3 = curryRamda(add3);

    bench('optimized: f(1, 2, 3)', () => {
      optAdd3(1, 2, 3);
    });

    bench('original: f(1, 2, 3)', () => {
      origAdd3(1, 2, 3);
    });

    bench('ramda-style: f(1, 2, 3)', () => {
      ramdaAdd3(1, 2, 3);
    });
  });

  describe('Quinary', () => {
    const optAdd5 = curry(add5);
    const origAdd5 = curryOriginal(add5);
    // @ts-expect-error Benchmark
    const ramdaAdd5 = curryRamda(add5);

    bench('optimized: f(1, 2, 3, 4, 5)', () => {
      optAdd5(1, 2, 3, 4, 5);
    });

    bench('original: f(1, 2, 3, 4, 5)', () => {
      origAdd5(1, 2, 3, 4, 5);
    });

    bench('ramda-style: f(1, 2, 3, 4, 5)', () => {
      ramdaAdd5(1, 2, 3, 4, 5);
    });
  });
});

describe('Partial Application', () => {
  describe('f(a)(b, c)', () => {
    const optAdd3 = curry(add3);
    const origAdd3 = curryOriginal(add3);
    // @ts-expect-error Benchmark
    const ramdaAdd3 = curryRamda(add3);

    bench('optimized: f(1)(2, 3)', () => {
      optAdd3(1)(2, 3);
    });

    bench('original: f(1)(2, 3)', () => {
      origAdd3(1)(2, 3);
    });

    bench('ramda-style: f(1)(2, 3)', () => {
      // @ts-expect-error Benchmark
      ramdaAdd3(1)(2, 3);
    });
  });

  describe('f(a, b)(c)', () => {
    const optAdd3 = curry(add3);
    const origAdd3 = curryOriginal(add3);
    // @ts-expect-error Benchmark
    const ramdaAdd3 = curryRamda(add3);

    bench('optimized: f(1, 2)(3)', () => {
      optAdd3(1, 2)(3);
    });

    bench('original: f(1, 2)(3)', () => {
      origAdd3(1, 2)(3);
    });

    bench('ramda-style: f(1, 2)(3)', () => {
      // @ts-expect-error Benchmark
      ramdaAdd3(1, 2)(3);
    });
  });
});

describe('Fully Curried', () => {
  describe('Ternary', () => {
    const optAdd3 = curry(add3);
    const origAdd3 = curryOriginal(add3);
    // @ts-expect-error Benchmark
    const ramdaAdd3 = curryRamda(add3);

    bench('optimized: f(1)(2)(3)', () => {
      optAdd3(1)(2)(3);
    });

    bench('original: f(1)(2)(3)', () => {
      origAdd3(1)(2)(3);
    });

    bench('ramda-style: f(1)(2)(3)', () => {
      // @ts-expect-error Benchmark
      ramdaAdd3(1)(2)(3);
    });
  });

  describe('Quinary', () => {
    const optAdd5 = curry(add5);
    const origAdd5 = curryOriginal(add5);
    // @ts-expect-error Benchmark
    const ramdaAdd5 = curryRamda(add5);

    bench('optimized: f(1)(2)(3)(4)(5)', () => {
      optAdd5(1)(2)(3)(4)(5);
    });

    bench('original: f(1)(2)(3)(4)(5)', () => {
      origAdd5(1)(2)(3)(4)(5);
    });

    bench('ramda-style: f(1)(2)(3)(4)(5)', () => {
      // @ts-expect-error Benchmark
      ramdaAdd5(1)(2)(3)(4)(5);
    });
  });

  describe('Senary', () => {
    const optAdd6 = curry(add6);
    const origAdd6 = curryOriginal(add6);
    // @ts-expect-error Benchmark
    const ramdaAdd6 = curryRamda(add6);

    bench('optimized: f(1)(2)(3)(4)(5)(6)', () => {
      optAdd6(1)(2)(3)(4)(5)(6);
    });

    bench('original: f(1)(2)(3)(4)(5)(6)', () => {
      origAdd6(1)(2)(3)(4)(5)(6);
    });

    bench('ramda-style: f(1)(2)(3)(4)(5)(6)', () => {
      // @ts-expect-error Benchmark
      ramdaAdd6(1)(2)(3)(4)(5)(6);
    });
  });
});

describe('Reused Partial: Common Use', () => {
  describe('f(1)(2, 3)', () => {
    const optAdd10 = curry(add3)(10);
    const origAdd10 = curryOriginal(add3)(10);
    // @ts-expect-error Benchmark
    const ramdaAdd10 = curryRamda(add3)(10);

    bench('optimized: add10(5, 3)', () => {
      optAdd10(5, 3);
    });

    bench('original: add10(5, 3)', () => {
      origAdd10(5, 3);
    });

    bench('ramda-style: add10(5, 3)', () => {
      // @ts-expect-error Benchmark
      ramdaAdd10(5, 3);
    });
  });

  describe('f(1)(2)(3)', () => {
    const optAdd10 = curry(add3)(10);
    const origAdd10 = curryOriginal(add3)(10);
    // @ts-expect-error Benchmark
    const ramdaAdd10 = curryRamda(add3)(10);

    bench('optimized: add10(5)(3)', () => {
      optAdd10(5)(3);
    });

    bench('original: add10(5)(3)', () => {
      origAdd10(5)(3);
    });

    bench('ramda-style: add10(5)(3)', () => {
      // @ts-expect-error Benchmark
      ramdaAdd10(5)(3);
    });
  });
});

describe('Immediate Execution', () => {
  describe('Complete', () => {
    bench('optimized: curry(add3)(1, 2, 3)', () => {
      curry(add3)(1, 2, 3);
    });

    bench('original: curry(add3)(1, 2, 3)', () => {
      curryOriginal(add3)(1, 2, 3);
    });

    bench('ramda-style: curry(add3)(1, 2, 3)', () => {
      // @ts-expect-error Benchmark
      curryRamda(add3)(1, 2, 3);
    });
  });

  describe('Full Curried', () => {
    bench('optimized: curry(add3)(1)(2)(3)', () => {
      curry(add3)(1)(2)(3);
    });

    bench('original: curry(add3)(1)(2)(3)', () => {
      curryOriginal(add3)(1)(2)(3);
    });

    bench('ramda-style: curry(add3)(1)(2)(3)', () => {
      // @ts-expect-error Benchmark
      curryRamda(add3)(1)(2)(3);
    });
  });
});

describe('Uncommon Use', () => {
  describe('Nullary', () => {
    const nullary = (): number => 42;

    bench('optimized: nullary function (passthrough)', () => {
      curry(nullary)();
    });

    bench('original: nullary function', () => {
      curryOriginal(nullary)();
    });
  });

  describe('Unary', () => {
    const identity = (x: number): number => x;

    bench('optimized: unary function (passthrough)', () => {
      curry(identity)(42);
    });

    bench('original: unary function', () => {
      curryOriginal(identity)(42);
    });
  });
});
