import type { UnaryFunction } from '../types';

/**
 * Defines the valid shapes for function arrays that can be piped.
 *
 * This union type represents two possible pipe compositions:
 * 1. One n-ary function followed by zero or more unary functions
 * 2. A single n-ary function
 *
 * The `readonly` modifier ensures immutability and enables better type inference
 * with rest/spread patterns. The `...UnaryFunction[]` spread allows for any number
 * of unary functions to follow the initial n-ary function.
 */
type PipeArray =
  // biome-ignore lint/suspicious/noExplicitAny: This is intended
  | readonly [(...args: any[]) => any, ...UnaryFunction[]]
  // biome-ignore lint/suspicious/noExplicitAny: This is intended
  | readonly [(...args: any[]) => any];

/**
 * Extracts the parameter types of the leftmost (first) function in a pipe array.
 *
 * This type uses conditional type inference with `infer` to:
 * 1. Pattern match against `readonly [infer First, ...unknown[]]` to capture the first element
 * 2. Check if `First` is a function and extract its parameters with `infer P`
 * 3. Return the parameter tuple type `P`, or `never` if extraction fails
 *
 * The `...unknown[]` spread matches any suffix elements without caring about their types,
 * focusing only on the first element. This follows left-to-right pipe semantics
 * where the leftmost function receives the initial arguments.
 *
 * Example:
 * PipeParams<[(a: boolean, b: string) => string, (x: string) => number]>
 * // Result: [a: boolean, b: string]
 */
type PipeParams<Fns extends PipeArray> = Fns extends readonly [
  infer First,
  ...unknown[],
]
  ? // biome-ignore lint/suspicious/noExplicitAny: This is intended
    First extends (...args: infer P) => any
    ? P
    : never
  : never;

/**
 * Extracts the return type of the rightmost (last) function in a pipe array.
 *
 * This type mirrors PipeParams but focuses on the last element:
 * 1. Pattern match against `readonly [...unknown[], infer Last]` to capture the last element
 * 2. Check if `Last` is a function and extract its return type with `infer R`
 * 3. Return the return type `R`, or `never` if extraction fails
 *
 * The `...unknown[]` spread ignores all elements before the last. This follows
 * pipe semantics where the rightmost function's return type becomes the
 * overall pipe's return type.
 *
 * Example:
 * PipeReturn<[(a: boolean) => string, (x: string) => number]>
 * // Result: number
 */
type PipeReturn<Fns extends PipeArray> = Fns extends readonly [
  ...unknown[],
  infer Last,
]
  ? // biome-ignore lint/suspicious/noExplicitAny: This is intended
    Last extends (...args: any[]) => infer R
    ? R
    : never
  : never;

/**
 * Validates and transforms a function array to ensure valid pipe structure.
 *
 * This recursive conditional type enforces that:
 * 1. Base case: A single function (of any arity) is always valid
 * 2. Recursive case: The first function can be n-ary, and the rest must be unary functions
 *
 * The constraint system works as follows:
 * - `infer First extends (...args: any[]) => any` allows the first function to be n-ary
 * - `infer Rest extends readonly UnaryFunction[]` ensures the remaining functions are unary
 * - `readonly [First, ...Rest]` validates the structure
 *
 * This prevents invalid pipes like having non-unary functions in non-initial positions,
 * which would break the pipe chain since intermediate functions can only receive one argument.
 *
 * Example transformations:
 * Pipeable<[(x: number) => string]>
 * // Result: [(x: number) => string]
 *
 * Pipeable<[(a: boolean, b: string) => string, (x: string) => number]>
 * // Result: [(a: boolean, b: string) => string, (x: string) => number]
 *
 * Invalid example (would result in `never`):
 * Pipeable<[(x: boolean) => string, (a: string, b: number) => boolean]>
 * // Error: Second function is not unary
 */
type Pipeable<Fn extends PipeArray> = Fn extends readonly [
  // biome-ignore lint/suspicious/noExplicitAny: This is intended
  (...args: any[]) => any,
]
  ? Fn // Base case: single function (can be n-ary)
  : Fn extends readonly [
        // biome-ignore lint/suspicious/noExplicitAny: This is intended
        infer First extends (...args: any[]) => any,
        ...infer Rest extends readonly UnaryFunction[],
      ]
    ? readonly [First, ...Rest]
    : never;

const MAX_PIPE_DEPTH = 1000;

/**
 * Allows you combine two or more functions to create a new function, which passes the results from one
 * function to the next until all have be called. Has a left-to-right call order.
 *
 * @template Fns - Tuple type of pipeable functions, where the first can be n-ary
 *                 and all subsequent functions must be unary
 *
 * @param fns - The functions to pipe in left-to-right order
 *
 * @returns A new function accepting the parameters of the leftmost function in `fns`,
 *          returning the return type of the rightmost function in `fns`
 *
 * @remarks
 * The implementation follows left-to-right pipe semantics:
 * 1. The leftmost function is applied first to the input arguments
 * 2. Each subsequent function (moving right) receives the result of the previous function
 * 3. The rightmost function's result becomes the final output
 *
 * Performance: Maximum pipe depth is limited to 1000 functions to prevent stack overflow.
 *
 * @example
 * const getActiveUsers = pipeVariadic(
 *   filterActive,
 *   sortUserNames,
 *   displayPage,
 * );
 *
 * const activeUsers = getActiveUsers(users, currentPage);
 */
export const pipeVariadic = <Fns extends PipeArray>(
  ...fns: Pipeable<Fns>
): ((...args: PipeParams<Fns>) => PipeReturn<Fns>) => {
  const len = fns.length;

  if (len > MAX_PIPE_DEPTH) {
    throw new RangeError(`Pipe depth exceeds ${MAX_PIPE_DEPTH}`);
  }

  return (...args: PipeParams<Fns>): PipeReturn<Fns> => {
    if (len === 1) {
      // biome-ignore lint/suspicious/noExplicitAny: This is intended
      return (fns[0] as any)(...(args as any[])) as PipeReturn<Fns>;
    }

    // Start with leftmost function (index: 0)
    // biome-ignore lint/suspicious/noExplicitAny: This is intended
    let result = (fns[0] as any)(...(args as any[]));

    // Iterate forward from 1 to len - 1
    for (let i = 1; i < len; i++) {
      // biome-ignore lint/style/noNonNullAssertion: We know fns[i] exists because i is within [0, len-1]
      result = fns[i]!(result);
    }

    return result as PipeReturn<Fns>;
  };
};

/**
 * @alias pipeVariadic
 *
 * Allows you combine two or more functions to create a new function, which passes the results from one
 * function to the next until all have be called. Has a left-to-right call order.
 *
 * @template Fns - Tuple type of pipeable functions, where the first can be n-ary
 *                 and all subsequent functions must be unary
 *
 * @param fns - The functions to pipe in left-to-right order
 *
 * @returns A new function accepting the parameters of the leftmost function in `fns`,
 *          returning the return type of the rightmost function in `fns`
 *
 * @remarks
 * The implementation follows left-to-right pipe semantics:
 * 1. The leftmost function is applied first to the input arguments
 * 2. Each subsequent function (moving right) receives the result of the previous function
 * 3. The rightmost function's result becomes the final output
 *
 * Performance: Maximum pipe depth is limited to 1000 functions to prevent stack overflow.
 *
 * @example
 * const getActiveUsers = pipe(
 *   filterActive,
 *   sortUserNames,
 *   displayPage,
 * );
 *
 * const activeUsers = getActiveUsers(users, currentPage);
 */
export const pipe = pipeVariadic;
