/**
 * A function that tests an element and returns a boolean result.
 *
 * @template T - The element type being tested.
 *
 * @param x - The element to test.
 * @param idx - The zero-based index of the element in the iteration (optional).
 *
 * @returns `true` if the element satisfies the condition, `false` otherwise.
 *
 * @remarks
 * Predicates are used by filtering and partitioning operations such as
 * `filter`, `takeWhile`, `dropWhile`, `some`, `every`, and `find`.
 *
 * @example
 * const isEven: Predicate<number> = (x) => x % 2 === 0;
 * const isFirstThree: Predicate<string> = (_, idx) => idx! < 3;
 */
export type Predicate<T> = (x: T, idx?: number) => boolean;

/**
 * A function that combines an accumulator with an element to produce a new accumulator.
 *
 * @template T - The element type being accumulated.
 * @template R - The accumulator (result) type.
 *
 * @param acc - The current accumulated value.
 * @param x - The current element to incorporate.
 * @param idx - The zero-based index of the element in the iteration (optional).
 *
 * @returns The new accumulated value.
 *
 * @remarks
 * Accumulators are used by reduction operations such as `reduce`, `fold`, and `scan`.
 * The accumulator type `R` may differ from the element type `T`, enabling
 * transformations like summing numbers into a total or collecting elements into
 * a different data structure.
 *
 * @example
 * const sum: Accumulator<number, number> = (acc, x) => acc + x;
 * const concat: Accumulator<string, string> = (acc, x) => acc + x;
 * const toRecord: Accumulator<[string, number], Record<string, number>> =
 *   (acc, [k, v]) => ({ ...acc, [k]: v });
 */
export type Accumulator<T, R> = (acc: R, x: T, idx?: number) => R;

/**
 * A function that transforms an element into a new value.
 *
 * @template T - The input element type.
 * @template R - The output element type.
 *
 * @param x - The element to transform.
 * @param idx - The zero-based index of the element in the iteration (optional).
 *
 * @returns The transformed value.
 *
 * @remarks
 * Map functions are used by transformation operations such as `map` and `flatMap`.
 * The output type `R` may differ from the input type `T`, enabling type-changing
 * transformations.
 *
 * @example
 * const double: MapFn<number, number> = (x) => x * 2;
 * const toString: MapFn<number, string> = (x) => String(x);
 * const withIndex: MapFn<string, [number, string]> = (x, idx) => [idx!, x];
 */
export type MapFn<T, R> = (x: T, idx?: number) => R;
