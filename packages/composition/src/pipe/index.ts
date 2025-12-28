import type { UnaryFunction } from '../types';

/**
 * Left-to-right variadic function composition (piping).
 *
 * Combines two or more functions to create a new function, passing the result
 * from one function to the next until all have been called. The leftmost
 * function is applied first to the input arguments.
 *
 * @remarks
 * Mathematical notation: `(f | g | h)(x) = h(g(f(x)))`
 *
 * Type constraints:
 * - The leftmost (first) function can accept n parameters
 * - All other functions must be unary (single parameter)
 * - Return type of function `i` must be assignable to parameter of function `i+1`
 *
 * The overload-based signature provides reliable type inference up to 10 functions.
 * For pipes exceeding 10 functions, nest multiple pipe calls.
 *
 * @example
 * ```ts
 * // Basic pipe
 * const process = pipe(
 *   (x: number) => x + 1,
 *   (x: number) => x * 2,
 *   (x: number) => x.toString()
 * );
 * process(4); // "10"
 *
 * // With n-ary leftmost function
 * const sumAndFormat = pipe(
 *   (a: number, b: number) => a + b,
 *   (x: number) => x.toString(),
 *   (x: string) => `Result: ${x}`
 * );
 * sumAndFormat(3, 4); // "Result: 7"
 * ```
 */
export function pipe<Args extends readonly unknown[], A>(
  f: (...args: Args) => A,
): (...args: Args) => A;

export function pipe<Args extends readonly unknown[], A, B>(
  f: (...args: Args) => A,
  g: (a: A) => B,
): (...args: Args) => B;

export function pipe<Args extends readonly unknown[], A, B, C>(
  f: (...args: Args) => A,
  g: (a: A) => B,
  h: (b: B) => C,
): (...args: Args) => C;

export function pipe<Args extends readonly unknown[], A, B, C, D>(
  f: (...args: Args) => A,
  g: (a: A) => B,
  h: (b: B) => C,
  i: (c: C) => D,
): (...args: Args) => D;

export function pipe<Args extends readonly unknown[], A, B, C, D, E>(
  f: (...args: Args) => A,
  g: (a: A) => B,
  h: (b: B) => C,
  i: (c: C) => D,
  j: (d: D) => E,
): (...args: Args) => E;

export function pipe<Args extends readonly unknown[], A, B, C, D, E, F>(
  f: (...args: Args) => A,
  g: (a: A) => B,
  h: (b: B) => C,
  i: (c: C) => D,
  j: (d: D) => E,
  k: (e: E) => F,
): (...args: Args) => F;

export function pipe<Args extends readonly unknown[], A, B, C, D, E, F, G>(
  f: (...args: Args) => A,
  g: (a: A) => B,
  h: (b: B) => C,
  i: (c: C) => D,
  j: (d: D) => E,
  k: (e: E) => F,
  l: (f_: F) => G,
): (...args: Args) => G;

export function pipe<Args extends readonly unknown[], A, B, C, D, E, F, G, H>(
  f: (...args: Args) => A,
  g: (a: A) => B,
  h: (b: B) => C,
  i: (c: C) => D,
  j: (d: D) => E,
  k: (e: E) => F,
  l: (f_: F) => G,
  m: (g_: G) => H,
): (...args: Args) => H;

export function pipe<
  Args extends readonly unknown[],
  A,
  B,
  C,
  D,
  E,
  F,
  G,
  H,
  I,
>(
  f: (...args: Args) => A,
  g: (a: A) => B,
  h: (b: B) => C,
  i: (c: C) => D,
  j: (d: D) => E,
  k: (e: E) => F,
  l: (f_: F) => G,
  m: (g_: G) => H,
  n: (h_: H) => I,
): (...args: Args) => I;

export function pipe<
  Args extends readonly unknown[],
  A,
  B,
  C,
  D,
  E,
  F,
  G,
  H,
  I,
  J,
>(
  f: (...args: Args) => A,
  g: (a: A) => B,
  h: (b: B) => C,
  i: (c: C) => D,
  j: (d: D) => E,
  k: (e: E) => F,
  l: (f_: F) => G,
  m: (g_: G) => H,
  n: (h_: H) => I,
  o: (i_: I) => J,
): (...args: Args) => J;

/**
 * Fallback overload for pipes exceeding 10 functions.
 * Type checking between intermediate functions is not enforced.
 */
export function pipe(...fns: UnaryFunction[]): UnaryFunction;

export function pipe(
  ...fns: ((...args: unknown[]) => unknown)[]
): (...args: unknown[]) => unknown {
  const len = fns.length;

  if (len === 0) {
    throw new Error('pipe requires at least one function');
  }

  if (len === 1) {
    // biome-ignore lint/style/noNonNullAssertion: Just checked if there is atleast one
    return fns[0]!;
  }

  return (...args: unknown[]): unknown => {
    // biome-ignore lint/style/noNonNullAssertion: I know there is at least two
    let result = fns[0]!(...args);

    for (let i = 1; i < len; i++) {
      // biome-ignore lint/style/noNonNullAssertion: Won't run more than it can
      result = fns[i]!(result);
    }

    return result;
  };
}
