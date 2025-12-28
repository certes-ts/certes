import type { UnaryAsyncFunction } from '../types';

/**
 * Async function type that can return either a Promise or a synchronous value.
 */
type AsyncFn<Args extends readonly unknown[], R> = (
  ...args: Args
) => Promise<R> | R;

/**
 * Right-to-left variadic async function composition.
 *
 * Combines two or more functions (sync or async) to create a new async function,
 * passing the awaited result from one function to the next until all have been called.
 * The rightmost function is applied first to the input arguments.
 *
 * @remarks
 * Mathematical notation: `(f ∘ g ∘ h)(x) = await f(await g(await h(x)))`
 *
 * Type constraints:
 * - The rightmost (last) function can accept n parameters
 * - All other functions must be unary (single parameter)
 * - Functions can return `Promise<T>` or `T` (sync functions auto-wrapped)
 * - Final return type is always `Promise<T>`
 * - Return type of function `i` must be assignable to parameter of function `i-1`
 *
 * The overload-based signature provides reliable type inference up to 10 functions.
 * For compositions exceeding 10 functions, nest multiple composeAsync calls.
 *
 * @example
 * ```ts
 * // Mix of sync and async functions
 * const transform = composeAsync(
 *   async (x: string) => x.toUpperCase(),  // async
 *   (x: number) => x.toString(),           // sync
 *   async (x: number) => x + 3             // async
 * );
 * await transform(4); // "7"
 *
 * // With n-ary rightmost function
 * const fetchAndProcess = composeAsync(
 *   formatResult,
 *   parseJSON,
 *   async (url: string, options: RequestInit) => fetch(url, options)
 * );
 * await fetchAndProcess('https://api.example.com', { method: 'GET' });
 * ```
 */
export function composeAsync<Args extends readonly unknown[], B>(
  f: AsyncFn<Args, B>,
): (...args: Args) => Promise<Awaited<B>>;

export function composeAsync<Args extends readonly unknown[], A, B>(
  f: (a: Awaited<A>) => Promise<B> | B,
  g: AsyncFn<Args, A>,
): (...args: Args) => Promise<Awaited<B>>;

export function composeAsync<Args extends readonly unknown[], A, B, C>(
  f: (b: Awaited<B>) => Promise<C> | C,
  g: (a: Awaited<A>) => Promise<B> | B,
  h: AsyncFn<Args, A>,
): (...args: Args) => Promise<Awaited<C>>;

export function composeAsync<Args extends readonly unknown[], A, B, C, D>(
  f: (c: Awaited<C>) => Promise<D> | D,
  g: (b: Awaited<B>) => Promise<C> | C,
  h: (a: Awaited<A>) => Promise<B> | B,
  i: AsyncFn<Args, A>,
): (...args: Args) => Promise<Awaited<D>>;

export function composeAsync<Args extends readonly unknown[], A, B, C, D, E>(
  f: (d: Awaited<D>) => Promise<E> | E,
  g: (c: Awaited<C>) => Promise<D> | D,
  h: (b: Awaited<B>) => Promise<C> | C,
  i: (a: Awaited<A>) => Promise<B> | B,
  j: AsyncFn<Args, A>,
): (...args: Args) => Promise<Awaited<E>>;

export function composeAsync<Args extends readonly unknown[], A, B, C, D, E, F>(
  f: (e: Awaited<E>) => Promise<F> | F,
  g: (d: Awaited<D>) => Promise<E> | E,
  h: (c: Awaited<C>) => Promise<D> | D,
  i: (b: Awaited<B>) => Promise<C> | C,
  j: (a: Awaited<A>) => Promise<B> | B,
  k: AsyncFn<Args, A>,
): (...args: Args) => Promise<Awaited<F>>;

export function composeAsync<
  Args extends readonly unknown[],
  A,
  B,
  C,
  D,
  E,
  F,
  G,
>(
  f: (f_: Awaited<F>) => Promise<G> | G,
  g: (e: Awaited<E>) => Promise<F> | F,
  h: (d: Awaited<D>) => Promise<E> | E,
  i: (c: Awaited<C>) => Promise<D> | D,
  j: (b: Awaited<B>) => Promise<C> | C,
  k: (a: Awaited<A>) => Promise<B> | B,
  l: AsyncFn<Args, A>,
): (...args: Args) => Promise<Awaited<G>>;

export function composeAsync<
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
  f: (g_: Awaited<G>) => Promise<H> | H,
  g: (f_: Awaited<F>) => Promise<G> | G,
  h: (e: Awaited<E>) => Promise<F> | F,
  i: (d: Awaited<D>) => Promise<E> | E,
  j: (c: Awaited<C>) => Promise<D> | D,
  k: (b: Awaited<B>) => Promise<C> | C,
  l: (a: Awaited<A>) => Promise<B> | B,
  m: AsyncFn<Args, A>,
): (...args: Args) => Promise<Awaited<H>>;

export function composeAsync<
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
  f: (h_: Awaited<H>) => Promise<I> | I,
  g: (g_: Awaited<G>) => Promise<H> | H,
  h: (f_: Awaited<F>) => Promise<G> | G,
  i: (e: Awaited<E>) => Promise<F> | F,
  j: (d: Awaited<D>) => Promise<E> | E,
  k: (c: Awaited<C>) => Promise<D> | D,
  l: (b: Awaited<B>) => Promise<C> | C,
  m: (a: Awaited<A>) => Promise<B> | B,
  n: AsyncFn<Args, A>,
): (...args: Args) => Promise<Awaited<I>>;

export function composeAsync<
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
  f: (i_: Awaited<I>) => Promise<J> | J,
  g: (h_: Awaited<H>) => Promise<I> | I,
  h: (g_: Awaited<G>) => Promise<H> | H,
  i: (f_: Awaited<F>) => Promise<G> | G,
  j: (e: Awaited<E>) => Promise<F> | F,
  k: (d: Awaited<D>) => Promise<E> | E,
  l: (c: Awaited<C>) => Promise<D> | D,
  m: (b: Awaited<B>) => Promise<C> | C,
  n: (a: Awaited<A>) => Promise<B> | B,
  o: AsyncFn<Args, A>,
): (...args: Args) => Promise<Awaited<J>>;

/**
 * Fallback overload for async compositions exceeding 10 functions.
 * Type checking between intermediate functions is not enforced.
 */
export function composeAsync(
  ...fns: UnaryAsyncFunction[]
): (...args: unknown[]) => Promise<unknown>;

export function composeAsync(
  ...fns: ((...args: unknown[]) => unknown)[]
): (...args: unknown[]) => Promise<unknown> {
  const len = fns.length;

  if (len === 0) {
    throw new Error('composeAsync requires at least one function');
  }

  if (len === 1) {
    // biome-ignore lint/style/noNonNullAssertion: Just checked if there is atleast one
    return async (...args: unknown[]) => await fns[0]!(...args);
  }

  return async (...args: unknown[]): Promise<unknown> => {
    // biome-ignore lint/style/noNonNullAssertion: I know there is at least two
    let result = await fns[len - 1]!(...args);

    for (let i = len - 2; i >= 0; i--) {
      // biome-ignore lint/style/noNonNullAssertion: Won't run more than it can
      result = await fns[i]!(result);
    }

    return result;
  };
}
