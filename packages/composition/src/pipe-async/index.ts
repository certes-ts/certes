import type { UnaryAsyncFunction } from '../types';

/**
 * Defines the valid shapes for async function arrays that can be piped.
 */
type AsyncPipeArray =
  // biome-ignore lint/suspicious/noExplicitAny: This is intended
  | readonly [(...args: any[]) => Promise<any> | any, ...UnaryAsyncFunction[]]
  // biome-ignore lint/suspicious/noExplicitAny: This is intended
  | readonly [(...args: any[]) => Promise<any> | any];

/**
 * Extracts the parameter types of the leftmost (first) function in an async pipe array.
 */
type PipeAsyncParams<Fns extends AsyncPipeArray> = Fns extends readonly [
  infer First,
  ...unknown[],
]
  ? // biome-ignore lint/suspicious/noExplicitAny: This is intended
    First extends (...args: infer P) => any
    ? P
    : never
  : never;

/**
 * Extracts the awaited return type of the rightmost (last) function in an async pipe array.
 */
type PipeAsyncReturn<Fns extends AsyncPipeArray> = Fns extends readonly [
  ...unknown[],
  infer Last,
]
  ? // biome-ignore lint/suspicious/noExplicitAny: This is intended
    Last extends (...args: any[]) => infer R
    ? Awaited<R>
    : never
  : never;

/**
 * Validates and transforms an async function array to ensure valid pipe structure.
 */
type PipeableAsync<Fn extends AsyncPipeArray> = Fn extends readonly [
  // biome-ignore lint/suspicious/noExplicitAny: This is intended
  (...args: any[]) => any,
]
  ? Fn
  : Fn extends readonly [
        // biome-ignore lint/suspicious/noExplicitAny: This is intended
        infer First extends (...args: any[]) => any,
        ...infer Rest extends readonly UnaryAsyncFunction[],
      ]
    ? readonly [First, ...Rest]
    : never;

const MAX_ASYNC_PIPE_DEPTH = 1000;

/**
 * Pipes async functions from left to right..
 *
 * @template Fns - Tuple type of pipeable async functions, where the first can be n-ary
 *                 and all subsequent functions must be unary
 *
 * @param fns - The functions to pipe in left-to-right order
 *
 * @returns A new async function accepting the parameters of the leftmost function in `fns`,
 *          returning a Promise of the return type of the rightmost function in `fns`
 *
 * @remarks
 * The implementation follows left-to-right pipe semantics:
 * 1. The leftmost function is applied first to the input arguments
 * 2. Each subsequent function (moving right) receives the awaited result of the previous function
 * 3. The rightmost function's result becomes the final output
 *
 * Mathematical notation: pipe(f, g, h)(x) = await h(await g(await f(x)))
 *
 * Type constraints:
 * - The first function can accept n parameters
 * - All other functions must be unary (single parameter)
 * - Functions can return Promise<T> or T (sync functions auto-wrapped)
 * - Final return type is always Promise<T>
 *
 * Performance: O(n) time complexity, O(1) space complexity where n is the number of functions.
 *
 * @example
 * const fetchData = async (url: string): Promise<Response> => { ... };
 * const parseJSON = async (response: Response): Promise<Data> => { ... };
 * const transform = (data: Data): Result => { ... };
 *
 * const processUrl = pipeAsync(fetchData, parseJSON, transform);
 * await processUrl('https://api.example.com/data');
 *
 * @example
 * // Mix of sync and async functions
 * const process = pipeAsync(
 *   async (x: number) => x + 3,            // async
 *   (x: number) => x.toString(),           // sync
 *   async (x: string) => x.toUpperCase()   // async
 * );
 * await process(4); // "7"
 */
export const pipeAsync = <Fns extends AsyncPipeArray>(
  ...fns: PipeableAsync<Fns>
): ((...args: PipeAsyncParams<Fns>) => Promise<PipeAsyncReturn<Fns>>) => {
  const len = fns.length;

  if (len > MAX_ASYNC_PIPE_DEPTH) {
    throw new RangeError(`Async pipe depth exceeds ${MAX_ASYNC_PIPE_DEPTH}`);
  }

  return async (
    ...args: PipeAsyncParams<Fns>
  ): Promise<PipeAsyncReturn<Fns>> => {
    if (len === 1) {
      // biome-ignore lint/suspicious/noExplicitAny: This is intended
      return await (fns[0] as any)(...(args as any[]));
    }

    // Start with leftmost function (index: 0)
    // biome-ignore lint/suspicious/noExplicitAny: This is intended
    let result = await (fns[0] as any)(...(args as any[]));

    // Iterate forward from 1 to len - 1
    for (let i = 1; i < len; i++) {
      // biome-ignore lint/style/noNonNullAssertion: We know fns[i] exists because i is within [1, len-1]
      result = await fns[i]!(result);
    }

    return result as PipeAsyncReturn<Fns>;
  };
};
