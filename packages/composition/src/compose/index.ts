import type { UnaryFunction } from '../types';

/**
 * Defines the valid shapes for function arrays that can be composed.
 *
 * This union type represents two possible compositions:
 * 1. An array with zero or more unary functions followed by one n-ary function
 * 2. A single n-ary function
 *
 * The `readonly` modifier ensures immutability and enables better type inference
 * with rest/spread patterns. The `...UnaryFunction[]` spread allows for any number
 * of unary functions to precede the final n-ary function.
 */
type CompositionArray =
  // biome-ignore lint/suspicious/noExplicitAny: This is intended
  | readonly [...UnaryFunction[], (...args: any[]) => any]
  // biome-ignore lint/suspicious/noExplicitAny: This is intended
  | readonly [(...args: any[]) => any];

/**
 * Extracts the parameter types of the rightmost (last) function in a composition array.
 *
 * This type uses conditional type inference with `infer` to:
 * 1. Pattern match against `readonly [...unknown[], infer Last]` to capture the last element
 * 2. Check if `Last` is a function and extract its parameters with `infer P`
 * 3. Return the parameter tuple type `P`, or `never` if extraction fails
 *
 * The `...unknown[]` spread matches any prefix elements without caring about their types,
 * focusing only on the last element. This follows right-to-left composition semantics
 * where the rightmost function receives the initial arguments.
 *
 * Example:
 * ComposeParams<[(x: string) => number, (a: boolean, b: string) => string]>
 * // Result: [a: boolean, b: string]
 */
type ComposeParams<Fns extends CompositionArray> = Fns extends readonly [
  ...unknown[],
  infer Last,
]
  ? // biome-ignore lint/suspicious/noExplicitAny: This is intended
    Last extends (...args: infer P) => any
    ? P
    : never
  : never;

/**
 * Extracts the return type of the leftmost (first) function in a composition array.
 *
 * This type mirrors ComposeParams but focuses on the first element:
 * 1. Pattern match against `readonly [infer First, ...unknown[]]` to capture the first element
 * 2. Check if `First` is a function and extract its return type with `infer R`
 * 3. Return the return type `R`, or `never` if extraction fails
 *
 * The `...unknown[]` spread ignores all elements after the first. This follows
 * composition semantics where the leftmost function's return type becomes the
 * overall composition's return type.
 *
 * Example:
 * ComposeReturn<[(x: string) => number, (a: boolean) => string]>
 * // Result: number
 */
type ComposeReturn<Fns extends CompositionArray> = Fns extends readonly [
  infer First,
  ...unknown[],
]
  ? // biome-ignore lint/suspicious/noExplicitAny: This is intended
    First extends (...args: any[]) => infer R
    ? R
    : never
  : never;

/**
 * Validates and transforms a function array to ensure valid composition structure.
 *
 * This recursive conditional type enforces that:
 * 1. Base case: A single function (of any arity) is always valid
 * 2. Recursive case: The first function must be unary, and the rest must form a valid composition
 *
 * The constraint system works as follows:
 * - `infer First extends UnaryFunction` ensures the first function is unary
 * - `infer Rest extends CompositionArray` ensures the remaining functions form a valid composition
 * - `readonly [First, ...Composable<Rest>]` recursively validates the tail
 *
 * This prevents invalid compositions like having non-unary functions in non-terminal positions,
 * which would break the composition chain since intermediate functions can only receive one argument.
 *
 * Example transformations:
 * Composable<[(x: number) => string]>
 * // Result: [(x: number) => string]
 *
 * Composable<[(x: string) => number, (a: boolean, b: string) => string]>
 * // Result: [(x: string) => number, (a: boolean, b: string) => string]
 *
 * Invalid example (would result in `never`):
 * Composable<[(a: string, b: number) => boolean, (x: boolean) => string]>
 * // Error: First function is not unary
 */
type Composable<Fn extends CompositionArray> = Fn extends readonly [
  // biome-ignore lint/suspicious/noExplicitAny: This is intended
  (...args: any[]) => any,
]
  ? Fn // Base case: single function (can be n-ary)
  : Fn extends readonly [
        infer First extends UnaryFunction,
        ...infer Rest extends CompositionArray,
      ]
    ? readonly [First, ...Composable<Rest>]
    : never;

const MAX_COMPOSITION_DEPTH = 1000;

/**
 * Allows you combine two or more functions to create a new function, which passes the results from one
 * function to the next until all have be called. Has a right-to-left call order.
 *
 * @template Fns - Tuple type of composable functions, where all but the last must be unary
 *
 * @param fns - The functions to compose in right-to-left order
 *
 * @returns A new function accepting the parameters of the rightmost function in `fns`,
 *          returning the return type of the leftmost function in `fns`
 *
 * @remarks
 * The implementation follows right-to-left composition semantics:
 * 1. The rightmost function is applied first to the input arguments
 * 2. Each subsequent function (moving left) receives the result of the previous function
 * 3. The leftmost function's result becomes the final output
 *
 * Mathematical notation: (f ∘ g ∘ h)(x) = f(g(h(x)))
 *
 * Type constraints:
 * - The last function can accept n parameters
 * - All other functions must be unary (single parameter)
 * - Return type of function i must be assignable to parameter of function i-1
 *
 * Performance: Maximum composition depth is limited to 1000 functions to prevent stack overflow.
 *
 * @example
 * // Mathematical composition: (uppercase ∘ stringify ∘ add3)(4)
 * const transform = composeVariadic(uppercase, stringify, add3);
 * transform(4); // Returns "SEVEN"
 *
 * // With n-ary rightmost function
 * const sumAndStringify = composeVariadic(uppercase, stringify, (a: number, b: number) => a + b);
 * sumAndStringify(3, 4); // Returns "SEVEN"
 */
export const composeVariadic = <Fns extends CompositionArray>(
  ...fns: Composable<Fns>
): ((...args: ComposeParams<Fns>) => ComposeReturn<Fns>) => {
  const len = fns.length;

  if (len > MAX_COMPOSITION_DEPTH) {
    throw new RangeError(`Composition depth exceeds ${MAX_COMPOSITION_DEPTH}`);
  }

  return (...args: ComposeParams<Fns>): ComposeReturn<Fns> => {
    if (len === 1) {
      // biome-ignore lint/suspicious/noExplicitAny: This is intended
      return (fns[0] as any)(...(args as any[])) as ComposeReturn<Fns>;
    }

    // Start with rightmost function (index: len - 1)
    // biome-ignore lint/suspicious/noExplicitAny: This is intended
    let result = (fns[len - 1] as any)(...(args as any[]));

    // Iterate backwards from len - 2 to 0
    for (let i = len - 2; i >= 0; i--) {
      // biome-ignore lint/style/noNonNullAssertion: We know fns[i] exists because i is within [0, len-2]
      result = fns[i]!(result);
    }

    return result as ComposeReturn<Fns>;
  };
};

/**
 * @alias composeVariadic
 *
 * Allows you combine two or more functions to create a new function, which passes the results from one
 * function to the next until all have be called. Has a right-to-left call order.
 *
 * @template Fns - Tuple type of composable functions, where all but the last must be unary
 *
 * @param fns - The functions to compose in right-to-left order
 *
 * @returns A new function accepting the parameters of the rightmost function in `fns`,
 *          returning the return type of the leftmost function in `fns`
 *
 * @remarks
 * The implementation follows right-to-left composition semantics:
 * 1. The rightmost function is applied first to the input arguments
 * 2. Each subsequent function (moving left) receives the result of the previous function
 * 3. The leftmost function's result becomes the final output
 *
 * Mathematical notation: (f ∘ g ∘ h)(x) = f(g(h(x)))
 *
 * Type constraints:
 * - The last function can accept n parameters
 * - All other functions must be unary (single parameter)
 * - Return type of function i must be assignable to parameter of function i-1
 *
 * Performance: Maximum composition depth is limited to 1000 functions to prevent stack overflow.
 *
 * @example
 * // Mathematical composition: (uppercase ∘ stringify ∘ add3)(4)
 * const transform = compose(uppercase, stringify, add3);
 * transform(4); // Returns "SEVEN"
 *
 * // With n-ary rightmost function
 * const sumAndStringify = compose(uppercase, stringify, (a: number, b: number) => a + b);
 * sumAndStringify(3, 4); // Returns "SEVEN"
 */
export const compose = composeVariadic;
