import type { UnaryFunction } from '../types';

/**
 * Right-to-left variadic function composition.
 *
 * Combines two or more functions to create a new function, passing the result
 * from one function to the next until all have been called. The rightmost
 * function is applied first to the input arguments.
 *
 * @remarks
 * Mathematical notation: `(f ∘ g ∘ h)(x) = f(g(h(x)))`
 *
 * Type constraints:
 * - The rightmost (last) function can accept n parameters
 * - All other functions must be unary (single parameter)
 * - Return type of function `i` must be assignable to parameter of function `i-1`
 *
 * The overload-based signature provides reliable type inference up to 10 functions.
 * For compositions exceeding 10 functions, nest multiple compose calls.
 *
 * @example
 * ```ts
 * // Mathematical composition: (uppercase ∘ stringify ∘ add3)(4)
 * const transform = compose(uppercase, stringify, add3);
 * transform(4); // Returns "SEVEN"
 *
 * // With n-ary rightmost function
 * const sumAndStringify = compose(uppercase, stringify, (a: number, b: number) => a + b);
 * sumAndStringify(3, 4); // Returns "SEVEN"
 * ```
 */
export function compose<Args extends readonly unknown[], B>(
  f: (...args: Args) => B,
): (...args: Args) => B;

export function compose<Args extends readonly unknown[], A, B>(
  f: (a: A) => B,
  g: (...args: Args) => A,
): (...args: Args) => B;

export function compose<Args extends readonly unknown[], A, B, C>(
  f: (b: B) => C,
  g: (a: A) => B,
  h: (...args: Args) => A,
): (...args: Args) => C;

export function compose<Args extends readonly unknown[], A, B, C, D>(
  f: (c: C) => D,
  g: (b: B) => C,
  h: (a: A) => B,
  i: (...args: Args) => A,
): (...args: Args) => D;

export function compose<Args extends readonly unknown[], A, B, C, D, E>(
  f: (d: D) => E,
  g: (c: C) => D,
  h: (b: B) => C,
  i: (a: A) => B,
  j: (...args: Args) => A,
): (...args: Args) => E;

export function compose<Args extends readonly unknown[], A, B, C, D, E, F>(
  f: (e: E) => F,
  g: (d: D) => E,
  h: (c: C) => D,
  i: (b: B) => C,
  j: (a: A) => B,
  k: (...args: Args) => A,
): (...args: Args) => F;

export function compose<Args extends readonly unknown[], A, B, C, D, E, F, G>(
  f: (f_: F) => G,
  g: (e: E) => F,
  h: (d: D) => E,
  i: (c: C) => D,
  j: (b: B) => C,
  k: (a: A) => B,
  l: (...args: Args) => A,
): (...args: Args) => G;

export function compose<
  Args extends readonly unknown[],
  A,
  B,
  C,
  D,
  E,
  F,
  G,
  H,
>(
  f: (g_: G) => H,
  g: (f_: F) => G,
  h: (e: E) => F,
  i: (d: D) => E,
  j: (c: C) => D,
  k: (b: B) => C,
  l: (a: A) => B,
  m: (...args: Args) => A,
): (...args: Args) => H;

export function compose<
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
  f: (h_: H) => I,
  g: (g_: G) => H,
  h: (f_: F) => G,
  i: (e: E) => F,
  j: (d: D) => E,
  k: (c: C) => D,
  l: (b: B) => C,
  m: (a: A) => B,
  n: (...args: Args) => A,
): (...args: Args) => I;

export function compose<
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
  f: (i_: I) => J,
  g: (h_: H) => I,
  h: (g_: G) => H,
  i: (f_: F) => G,
  j: (e: E) => F,
  k: (d: D) => E,
  l: (c: C) => D,
  m: (b: B) => C,
  n: (a: A) => B,
  o: (...args: Args) => A,
): (...args: Args) => J;

/**
 * Fallback overload for compositions exceeding 10 functions.
 * Type checking between intermediate functions is not enforced.
 */
export function compose(...fns: UnaryFunction[]): UnaryFunction;

export function compose(
  ...fns: ((...args: unknown[]) => unknown)[]
): (...args: unknown[]) => unknown {
  const len = fns.length;

  if (len === 0) {
    throw new Error('compose requires at least one function');
  }

  if (len === 1) {
    // biome-ignore lint/style/noNonNullAssertion: Just checked if there is atleast one
    return fns[0]!;
  }

  return (...args: unknown[]): unknown => {
    // biome-ignore lint/style/noNonNullAssertion: I know there is at least two
    let result = fns[len - 1]!(...args);

    for (let i = len - 2; i >= 0; i--) {
      // biome-ignore lint/style/noNonNullAssertion: Won't run more than it can
      result = fns[i]!(result);
    }

    return result;
  };
}
