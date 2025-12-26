import { type ArrayKeys, arrayTypes, type KeyedArray } from '../types';
import { assertDefined } from '../utils';

const SCALING_FACTOR = 2;

class _SparseArray<Key extends ArrayKeys> {
  #construct: (typeof arrayTypes)[Key];
  #buffer: KeyedArray[Key];
  #capacity: number;
  #maxCapacity: number;
  #current = 0;

  constructor(arrayType: Key, initialSize: number) {
    if (!arrayType) {
      throw new TypeError('arrayType must be provided');
    }

    if (!arrayTypes[arrayType]) {
      throw new TypeError(`Unknown array type "${arrayType}"`);
    }

    if (!initialSize || initialSize < 1) {
      throw new Error(
        `initialSize must be greater than 0, ${initialSize} given`,
      );
    }

    this.#construct = arrayTypes[arrayType];
    this.#buffer = new this.#construct(initialSize) as KeyedArray[Key];
    this.#capacity = initialSize;
    this.#maxCapacity = Math.floor(2 ** 31 / this.#construct.BYTES_PER_ELEMENT);
  }

  private resize(newCapacity: number): void {
    if (newCapacity > this.#maxCapacity) {
      throw new RangeError(
        `Capacity ${newCapacity} exceeds maximum ${this.#maxCapacity}`,
      );
    }

    const newBuffer = new this.#construct(newCapacity);

    // biome-ignore lint/suspicious/noExplicitAny: This is A -> A so it's fine
    newBuffer.set(this.#buffer.subarray(0, this.#current) as any);
    this.#buffer = newBuffer as KeyedArray[Key];
    this.#capacity = newCapacity;
  }

  size(): number {
    return this.#current;
  }

  capacity(): number {
    return this.#capacity;
  }

  push(element: KeyedArray[Key][number]): number {
    if (this.#current >= this.#capacity) {
      this.resize(this.#capacity * SCALING_FACTOR);
    }

    this.#buffer[this.#current] = element;
    this.#current++;

    return this.#current - 1;
  }

  at(index: number): KeyedArray[Key][number] {
    if (index < 0 || index >= this.#current) {
      throw new RangeError(
        `Index out of range. ${index} given, max index is ${this.#current - 1}`,
      );
    }

    const value = this.#buffer[index];

    assertDefined(value);

    return value;
  }

  set(index: number, value: KeyedArray[Key][number]): void {
    if (index < 0 || index >= this.#current) {
      throw new RangeError(
        `Index out of range. ${index} given, max index is ${this.#current - 1}`,
      );
    }

    this.#buffer[index] = value;
  }

  remove(index: number): void {
    if (index < 0 || index >= this.#current) {
      throw new RangeError(
        `Index out of range. ${index} given, max index is ${this.#current - 1}`,
      );
    }

    this.#buffer[index] = 0 as KeyedArray[Key][number];
  }

  toArray(): KeyedArray[Key][number][] {
    // biome-ignore lint/suspicious/noExplicitAny: Yes yes, I know
    return Array.from(this.#buffer.subarray(0, this.#current) as any);
  }

  /**
   * Creates a sparse array from an existing array.
   *
   * @template K - The TypedArray type key
   * @param arrayType - The data type for array elements
   * @param arr - Array of numbers to initialize with
   * @returns A new sparse array instance
   * @throws {Error} If array is empty or invalid
   *
   * @example
   * ```typescript
   * const arr = _SparseArray.from('f32', [1, 2, 3, 4, 5]);
   * console.log(arr.size());  // 5
   * ```
   */
  static from<K extends ArrayKeys>(
    arrayType: K,
    arr: KeyedArray[K][number][],
  ): _SparseArray<K> {
    if (!Array.isArray(arr) || arr.length < 1) {
      throw new Error('arr must be an array with length greater than 0');
    }

    const sparseArr = new _SparseArray(arrayType, arr.length);

    for (const e of arr) {
      sparseArr.push(e);
    }

    return sparseArr;
  }

  *[Symbol.iterator](): Iterator<KeyedArray[Key][number]> {
    for (let i = 0; i < this.#current; i++) {
      const value = this.#buffer[i];
      assertDefined(value);

      yield value;
    }
  }
}

export type SparseArray<T extends ArrayKeys> = _SparseArray<T>;

/**
 * Creates a sparse array that grows but never shrinks.
 *
 * Unlike DynamicArray, SparseArray maintains stable indices. When you
 * remove an element, it's set to 0 instead of shifting remaining elements.
 * This is useful for entity IDs, handle systems, and other cases where
 * index stability matters.
 *
 * @template Key - The TypedArray type key
 * @param arrayType - The data type of array elements
 * @param initialSize - The initial capacity
 * @returns A new sparse array instance
 * @throws {Error} If arrayType is invalid
 * @throws {Error} If initialSize is less than 1
 *
 * @remarks
 * - Removal sets value to 0 without shifting
 * - Array only grows, never shrinks
 * - Ideal for systems needing stable handles/IDs
 *
 * @example
 * ```typescript
 * const entityIds = sparseArray('u32', 100);
 *
 * const id1 = entityIds.push(42);  // Returns 0
 * const id2 = entityIds.push(43);  // Returns 1
 *
 * entityIds.remove(id1);  // Sets index 0 to 0
 *
 * console.log(entityIds.at(id1));  // 0 (removed)
 * console.log(entityIds.at(id2));  // 43 (index unchanged)
 * ```
 */
export const sparseArray = <Key extends ArrayKeys>(
  arrayType: Key,
  initialSize: number,
): SparseArray<Key> => {
  return new _SparseArray(arrayType, initialSize);
};

export const sparseArrayFrom = <Key extends ArrayKeys>(
  arrayType: Key,
  arr: KeyedArray[Key][number][],
): SparseArray<Key> => {
  return _SparseArray.from(arrayType, arr);
};
