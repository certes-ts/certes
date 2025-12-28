/** biome-ignore-all lint/complexity/noArguments: This is special, hush now */
/** biome-ignore-all lint/complexity/useArrowFunction: To preserve `this` */
/**
 * Curried function type for 2-arity functions.
 */
type Curried2<A, B, R> = {
  (a: A): (b: B) => R;
  (a: A, b: B): R;
};

/**
 * Curried function type for 3-arity functions.
 */
type Curried3<A, B, C, R> = {
  (a: A): Curried2<B, C, R>;
  (a: A, b: B): (c: C) => R;
  (a: A, b: B, c: C): R;
};

/**
 * Curried function type for 4-arity functions.
 */
type Curried4<A, B, C, D, R> = {
  (a: A): Curried3<B, C, D, R>;
  (a: A, b: B): Curried2<C, D, R>;
  (a: A, b: B, c: C): (d: D) => R;
  (a: A, b: B, c: C, d: D): R;
};

/**
 * Curried function type for 5-arity functions.
 */
type Curried5<A, B, C, D, E, R> = {
  (a: A): Curried4<B, C, D, E, R>;
  (a: A, b: B): Curried3<C, D, E, R>;
  (a: A, b: B, c: C): Curried2<D, E, R>;
  (a: A, b: B, c: C, d: D): (e: E) => R;
  (a: A, b: B, c: C, d: D, e: E): R;
};

/**
 * Curried function type for 6-arity functions.
 */
type Curried6<A, B, C, D, E, F, R> = {
  (a: A): Curried5<B, C, D, E, F, R>;
  (a: A, b: B): Curried4<C, D, E, F, R>;
  (a: A, b: B, c: C): Curried3<D, E, F, R>;
  (a: A, b: B, c: C, d: D): Curried2<E, F, R>;
  (a: A, b: B, c: C, d: D, e: E): (f: F) => R;
  (a: A, b: B, c: C, d: D, e: E, f: F): R;
};

/**
 * Curries the given function, allowing it to accept one or more arguments at a time.
 *
 * @param fn - The function to convert to a curried version
 *
 * @returns A curried function that can accept parameters incrementally.
 *          Each partial application returns either:
 *          - Another curried function if more parameters are needed
 *          - The final result if all parameters are satisfied
 *
 * @remarks
 * This is an "auto-curry" implementation that allows multiple arguments per call,
 * unlike traditional Haskell-style currying which accepts exactly one argument at a time.
 *
 * The implementation uses arity-specialized code paths for functions with 0-6 parameters
 * to avoid array allocation and achieve optimal performance.
 *
 * Arity detection uses `Function.prototype.length` which counts only parameters
 * before the first one with a default value or rest parameter.
 *
 * @example
 * ```ts
 * const multiply = (a: number, b: number, c: number): number => a * b * c;
 * const curriedMultiply = curry(multiply);
 *
 * // All equivalent - returns 24:
 * curriedMultiply(2)(3)(4);
 * curriedMultiply(2, 3)(4);
 * curriedMultiply(2)(3, 4);
 * curriedMultiply(2, 3, 4);
 *
 * // Partial application for reuse
 * const double = curriedMultiply(2)(1);
 * double(5);  // 10
 * double(10); // 20
 * ```
 */
export function curry<R>(fn: () => R): () => R;
export function curry<A, R>(fn: (a: A) => R): (a: A) => R;
export function curry<A, B, R>(fn: (a: A, b: B) => R): Curried2<A, B, R>;
export function curry<A, B, C, R>(
  fn: (a: A, b: B, c: C) => R,
): Curried3<A, B, C, R>;
export function curry<A, B, C, D, R>(
  fn: (a: A, b: B, c: C, d: D) => R,
): Curried4<A, B, C, D, R>;
export function curry<A, B, C, D, E, R>(
  fn: (a: A, b: B, c: C, d: D, e: E) => R,
): Curried5<A, B, C, D, E, R>;

export function curry<A, B, C, D, E, F, R>(
  fn: (a: A, b: B, c: C, d: D, e: E, f: F) => R,
): Curried6<A, B, C, D, E, F, R>;

// Curried7...
// NOTE: If you reach this point, you need to refactor your function
// Probably should have before getting, tbh.

export function curry(
  fn: (...args: unknown[]) => unknown,
): (...args: unknown[]) => unknown {
  switch (fn.length) {
    case 0:
    case 1:
      return fn;

    case 2:
      return function c2(a: unknown, b: unknown): unknown {
        return arguments.length >= 2
          ? fn(a, b)
          : function (_b: unknown): unknown {
              return fn(a, _b);
            };
      };

    case 3:
      return function c3(a: unknown, b: unknown, c: unknown): unknown {
        switch (arguments.length) {
          case 1:
            return function c2(_b: unknown, _c: unknown): unknown {
              return arguments.length >= 2
                ? fn(a, _b, _c)
                : function (__c: unknown): unknown {
                    return fn(a, _b, __c);
                  };
            };
          case 2:
            return function (_c: unknown): unknown {
              return fn(a, b, _c);
            };
          default:
            return fn(a, b, c);
        }
      };

    case 4:
      return function c4(
        a: unknown,
        b: unknown,
        c: unknown,
        d: unknown,
      ): unknown {
        switch (arguments.length) {
          case 1:
            return curry(function (
              _b: unknown,
              _c: unknown,
              _d: unknown,
            ): unknown {
              return fn(a, _b, _c, _d);
            });
          case 2:
            return curry(function (_c: unknown, _d: unknown): unknown {
              return fn(a, b, _c, _d);
            });
          case 3:
            return function (_d: unknown): unknown {
              return fn(a, b, c, _d);
            };
          default:
            return fn(a, b, c, d);
        }
      };

    case 5:
      return function c5(
        a: unknown,
        b: unknown,
        c: unknown,
        d: unknown,
        e: unknown,
      ): unknown {
        switch (arguments.length) {
          case 1:
            return curry(function (
              _b: unknown,
              _c: unknown,
              _d: unknown,
              _e: unknown,
            ): unknown {
              return fn(a, _b, _c, _d, _e);
            });
          case 2:
            return curry(function (
              _c: unknown,
              _d: unknown,
              _e: unknown,
            ): unknown {
              return fn(a, b, _c, _d, _e);
            });
          case 3:
            return curry(function (_d: unknown, _e: unknown): unknown {
              return fn(a, b, c, _d, _e);
            });
          case 4:
            return function (_e: unknown): unknown {
              return fn(a, b, c, d, _e);
            };
          default:
            return fn(a, b, c, d, e);
        }
      };

    case 6:
      return function c6(
        a: unknown,
        b: unknown,
        c: unknown,
        d: unknown,
        e: unknown,
        f: unknown,
      ): unknown {
        switch (arguments.length) {
          case 1:
            return curry(function (
              _b: unknown,
              _c: unknown,
              _d: unknown,
              _e: unknown,
              _f: unknown,
            ): unknown {
              return fn(a, _b, _c, _d, _e, _f);
            });
          case 2:
            return curry(function (
              _c: unknown,
              _d: unknown,
              _e: unknown,
              _f: unknown,
            ): unknown {
              return fn(a, b, _c, _d, _e, _f);
            });
          case 3:
            return curry(function (
              _d: unknown,
              _e: unknown,
              _f: unknown,
            ): unknown {
              return fn(a, b, c, _d, _e, _f);
            });
          case 4:
            return curry(function (_e: unknown, _f: unknown): unknown {
              return fn(a, b, c, d, _e, _f);
            });
          case 5:
            return function (_f: unknown): unknown {
              return fn(a, b, c, d, e, _f);
            };
          default:
            return fn(a, b, c, d, e, f);
        }
      };

    default:
      throw new RangeError(
        `curry only supports functions with 0-6 parameters. Received function with ${fn.length} parameters. ` +
          'Consider refactoring to use an options object or composing multiple curried functions.',
      );
  }
}
