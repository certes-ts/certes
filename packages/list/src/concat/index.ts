/**
 * Concatenate the two given arrays together.
 *
 * @template T - The type of array elements.
 *
 * @param concatable - The first array.
 * @param newValue - The second array to concatenate to the first.
 *
 * @returns A new array containing all elements from both arrays.
 *
 * @example
 * const first = [1, 2, 3];
 * const second = [4, 5, 6];
 * concat(first)(second);
 * // [1, 2, 3, 4, 5, 6]
 */
export const concat =
  <T>(concatable: T[]) =>
  (newValue: T[]): T[] =>
    concatable.concat(newValue);
