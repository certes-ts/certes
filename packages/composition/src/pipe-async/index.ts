import type { UnaryAsyncFunction } from '../types';

/**
 * Async function type that can return either a Promise or a synchronous value.
 */
type AsyncFn<Args extends readonly unknown[], R> = (
  ...args: Args
) => Promise<R> | R;

/**
 * Left-to-right variadic async function composition (piping).
 *
 * Combines two or more functions (sync or async) to create a new async function,
 * passing the awaited result from one function to the next until all have been called.
 * The leftmost function is applied first to the input arguments.
 *
 * @remarks
 * Mathematical notation: `(f | g | h)(x) = await h(await g(await f(x)))`
 *
 * Type constraints:
 * - The leftmost (first) function can accept n parameters
 * - All other functions must be unary (single parameter)
 * - Functions can return `Promise<T>` or `T` (sync functions auto-wrapped)
 * - Final return type is always `Promise<T>`
 * - Return type of function `i` must be assignable to parameter of function `i+1`
 *
 * The overload-based signature provides reliable type inference up to 10 functions.
 * For pipes exceeding 10 functions, nest multiple pipeAsync calls.
 *
 * @example
 * ```ts
 * // Mix of sync and async functions
 * const process = pipeAsync(
 *   async (x: number) => x + 3,            // async
 *   (x: number) => x.toString(),           // sync
 *   async (x: string) => x.toUpperCase()   // async
 * );
 * await process(4); // "7"
 *
 * // With n-ary leftmost function
 * const fetchAndProcess = pipeAsync(
 *   async (url: string, options: RequestInit) => fetch(url, options),
 *   (response: Response) => response.json(),
 *   (data: unknown) => processData(data)
 * );
 * await fetchAndProcess('https://api.example.com', { method: 'GET' });
 * ```
 */
export function pipeAsync<Args extends readonly unknown[], A>(
  f: AsyncFn<Args, A>,
): (...args: Args) => Promise<Awaited<A>>;

export function pipeAsync<Args extends readonly unknown[], A, B>(
  f: AsyncFn<Args, A>,
  g: (a: Awaited<A>) => Promise<B> | B,
): (...args: Args) => Promise<Awaited<B>>;

export function pipeAsync<Args extends readonly unknown[], A, B, C>(
  f: AsyncFn<Args, A>,
  g: (a: Awaited<A>) => Promise<B> | B,
  h: (b: Awaited<B>) => Promise<C> | C,
): (...args: Args) => Promise<Awaited<C>>;

export function pipeAsync<Args extends readonly unknown[], A, B, C, D>(
  f: AsyncFn<Args, A>,
  g: (a: Awaited<A>) => Promise<B> | B,
  h: (b: Awaited<B>) => Promise<C> | C,
  i: (c: Awaited<C>) => Promise<D> | D,
): (...args: Args) => Promise<Awaited<D>>;

export function pipeAsync<Args extends readonly unknown[], A, B, C, D, E>(
  f: AsyncFn<Args, A>,
  g: (a: Awaited<A>) => Promise<B> | B,
  h: (b: Awaited<B>) => Promise<C> | C,
  i: (c: Awaited<C>) => Promise<D> | D,
  j: (d: Awaited<D>) => Promise<E> | E,
): (...args: Args) => Promise<Awaited<E>>;

export function pipeAsync<Args extends readonly unknown[], A, B, C, D, E, F>(
  f: AsyncFn<Args, A>,
  g: (a: Awaited<A>) => Promise<B> | B,
  h: (b: Awaited<B>) => Promise<C> | C,
  i: (c: Awaited<C>) => Promise<D> | D,
  j: (d: Awaited<D>) => Promise<E> | E,
  k: (e: Awaited<E>) => Promise<F> | F,
): (...args: Args) => Promise<Awaited<F>>;

export function pipeAsync<Args extends readonly unknown[], A, B, C, D, E, F, G>(
  f: AsyncFn<Args, A>,
  g: (a: Awaited<A>) => Promise<B> | B,
  h: (b: Awaited<B>) => Promise<C> | C,
  i: (c: Awaited<C>) => Promise<D> | D,
  j: (d: Awaited<D>) => Promise<E> | E,
  k: (e: Awaited<E>) => Promise<F> | F,
  l: (f_: Awaited<F>) => Promise<G> | G,
): (...args: Args) => Promise<Awaited<G>>;

export function pipeAsync<
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
  f: AsyncFn<Args, A>,
  g: (a: Awaited<A>) => Promise<B> | B,
  h: (b: Awaited<B>) => Promise<C> | C,
  i: (c: Awaited<C>) => Promise<D> | D,
  j: (d: Awaited<D>) => Promise<E> | E,
  k: (e: Awaited<E>) => Promise<F> | F,
  l: (f_: Awaited<F>) => Promise<G> | G,
  m: (g_: Awaited<G>) => Promise<H> | H,
): (...args: Args) => Promise<Awaited<H>>;

export function pipeAsync<
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
  f: AsyncFn<Args, A>,
  g: (a: Awaited<A>) => Promise<B> | B,
  h: (b: Awaited<B>) => Promise<C> | C,
  i: (c: Awaited<C>) => Promise<D> | D,
  j: (d: Awaited<D>) => Promise<E> | E,
  k: (e: Awaited<E>) => Promise<F> | F,
  l: (f_: Awaited<F>) => Promise<G> | G,
  m: (g_: Awaited<G>) => Promise<H> | H,
  n: (h_: Awaited<H>) => Promise<I> | I,
): (...args: Args) => Promise<Awaited<I>>;

export function pipeAsync<
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
  f: AsyncFn<Args, A>,
  g: (a: Awaited<A>) => Promise<B> | B,
  h: (b: Awaited<B>) => Promise<C> | C,
  i: (c: Awaited<C>) => Promise<D> | D,
  j: (d: Awaited<D>) => Promise<E> | E,
  k: (e: Awaited<E>) => Promise<F> | F,
  l: (f_: Awaited<F>) => Promise<G> | G,
  m: (g_: Awaited<G>) => Promise<H> | H,
  n: (h_: Awaited<H>) => Promise<I> | I,
  o: (i_: Awaited<I>) => Promise<J> | J,
): (...args: Args) => Promise<Awaited<J>>;

/**
 * Fallback overload for async pipes exceeding 10 functions.
 * Type checking between intermediate functions is not enforced.
 */
export function pipeAsync(
  ...fns: UnaryAsyncFunction[]
): (...args: unknown[]) => Promise<unknown>;

export function pipeAsync(
  ...fns: ((...args: unknown[]) => unknown)[]
): (...args: unknown[]) => Promise<unknown> {
  const len = fns.length;

  if (len === 0) {
    throw new Error('pipeAsync requires at least one function');
  }

  if (len === 1) {
    // biome-ignore lint/style/noNonNullAssertion: Just checked if there is atleast one
    return async (...args: unknown[]) => await fns[0]!(...args);
  }

  return async (...args: unknown[]): Promise<unknown> => {
    // biome-ignore lint/style/noNonNullAssertion: I know there is at least two
    let result = await fns[0]!(...args);

    for (let i = 1; i < len; i++) {
      // biome-ignore lint/style/noNonNullAssertion: Won't run more than it can
      result = await fns[i]!(result);
    }

    return result;
  };
}
