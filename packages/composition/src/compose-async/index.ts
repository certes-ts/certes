import type { UnaryAsyncFunction } from '../types';

/**
 * Defines the valid shapes for async function arrays that can be composed.
 *
 * This union type represents two possible async compositions:
 * 1. An array with zero or more unary async functions followed by one n-ary async function
 * 2. A single n-ary async function
 *
 * Functions can return either Promise<T> or T (sync functions are auto-wrapped).
 */
type AsyncCompositionArray =
  // biome-ignore lint/suspicious/noExplicitAny: This is intended
  | readonly [...UnaryAsyncFunction[], (...args: any[]) => Promise<any> | any]
  // biome-ignore lint/suspicious/noExplicitAny: This is intended
  | readonly [(...args: any[]) => Promise<any> | any];

/**
 * Extracts the parameter types of the rightmost (last) function in an async composition array.
 */
type ComposeAsyncParams<Fns extends AsyncCompositionArray> =
  Fns extends readonly [...unknown[], infer Last]
    ? // biome-ignore lint/suspicious/noExplicitAny: This is intended
      Last extends (...args: infer P) => any
      ? P
      : never
    : never;

/**
 * Extracts the awaited return type of the leftmost (first) function in an async composition array.
 */
type ComposeAsyncReturn<Fns extends AsyncCompositionArray> =
  Fns extends readonly [infer First, ...unknown[]]
    ? // biome-ignore lint/suspicious/noExplicitAny: This is intended
      First extends (...args: any[]) => infer R
      ? Awaited<R>
      : never
    : never;

/**
 * Validates and transforms an async function array to ensure valid composition structure.
 */
type ComposableAsync<Fn extends AsyncCompositionArray> = Fn extends readonly [
  // biome-ignore lint/suspicious/noExplicitAny: This is intended
  (...args: any[]) => any,
]
  ? Fn
  : Fn extends readonly [
        infer First extends UnaryAsyncFunction,
        ...infer Rest extends AsyncCompositionArray,
      ]
    ? readonly [First, ...ComposableAsync<Rest>]
    : never;

const MAX_ASYNC_COMPOSITION_DEPTH = 1000;

/**
 * Composes async functions from right to left.
 *
 * @template Fns - Tuple type of composable async functions, where all but the last must be unary
 *
 * @param fns - The functions to compose in right-to-left order
 *
 * @returns A new async function accepting the parameters of the rightmost function in `fns`,
 *          returning a Promise of the return type of the leftmost function in `fns`
 *
 * @remarks
 * The implementation follows right-to-left composition semantics:
 * 1. The rightmost function is applied first to the input arguments
 * 2. Each subsequent function (moving left) receives the awaited result of the previous function
 * 3. The leftmost function's result becomes the final output
 *
 * Mathematical notation: (f ∘ g ∘ h)(x) = await f(await g(await h(x)))
 *
 * Type constraints:
 * - The last function can accept n parameters
 * - All other functions must be unary (single parameter)
 * - Functions can return Promise<T> or T (sync functions auto-wrapped)
 * - Final return type is always Promise<T>
 *
 * Performance: O(n) time complexity, O(1) space complexity where n is the number of functions.
 * Uses iterative implementation with await to handle async operations.
 *
 * @example
 * const fetchUser = async (id: number): Promise<User> => { ... };
 * const getEmail = (user: User): string => user.email;
 * const sendEmail = async (email: string): Promise<void> => { ... };
 *
 * const notifyUser = composeAsync(sendEmail, getEmail, fetchUser);
 * await notifyUser(123);
 *
 * @example
 * // Mix of sync and async functions
 * const transform = composeAsync(
 *   async (x: string) => x.toUpperCase(),  // async
 *   (x: number) => x.toString(),           // sync
 *   async (x: number) => x + 3             // async
 * );
 * await transform(4); // "7"
 */
export const composeAsync = <Fns extends AsyncCompositionArray>(
  ...fns: ComposableAsync<Fns>
): ((...args: ComposeAsyncParams<Fns>) => Promise<ComposeAsyncReturn<Fns>>) => {
  const len = fns.length;

  if (len > MAX_ASYNC_COMPOSITION_DEPTH) {
    throw new RangeError(
      `Async composition depth exceeds ${MAX_ASYNC_COMPOSITION_DEPTH}`,
    );
  }

  return async (
    ...args: ComposeAsyncParams<Fns>
  ): Promise<ComposeAsyncReturn<Fns>> => {
    if (len === 1) {
      // biome-ignore lint/suspicious/noExplicitAny: This is intended
      return await (fns[0] as any)(...(args as any[]));
    }

    // Start with rightmost function (index: len - 1)
    // biome-ignore lint/suspicious/noExplicitAny: This is intended
    let result = await (fns[len - 1] as any)(...(args as any[]));

    // Iterate backwards from len - 2 to 0
    for (let i = len - 2; i >= 0; i--) {
      // biome-ignore lint/style/noNonNullAssertion: We know fns[i] exists because i is within [0, len-2]
      result = await fns[i]!(result);
    }

    return result as ComposeAsyncReturn<Fns>;
  };
};
