import { type ArrayKeys, arrayTypes, type KeyedArray } from '../types';
import { assertDefined } from '../utils';

const SCALING_FACTOR = 2;

class _DynamicArray<Key extends ArrayKeys> {
  readonly #construct: (typeof arrayTypes)[Key];
  #buffer: KeyedArray[Key];
  #capacity: number;
  readonly #maxCapacity: number;
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

    for (let i = index; i < this.#current - 1; i++) {
      const value = this.#buffer[i + 1];

      assertDefined(value);
      this.#buffer[i] = value;
    }

    this.#current--;

    const minCapacity = Math.max(
      1,
      Math.floor(this.#capacity / SCALING_FACTOR),
    );

    if (this.#current <= minCapacity) {
      this.resize(minCapacity);
    }
  }

  toArray(): KeyedArray[Key][number][] {
    // biome-ignore lint/suspicious/noExplicitAny: Yes yes, I know
    return Array.from(this.#buffer.subarray(0, this.#current) as any);
  }

  /**
   * Creates a dynamic array from an existing array.
   *
   * @template K - The TypedArray type key
   * @param arrayType - The data type for array elements
   * @param arr - Array of numbers to initialize with
   * @returns A new dynamic array instance
   * @throws {Error} If array is empty or invalid
   *
   * @example
   * ```typescript
   * const arr = _DynamicArray.from('f32', [1, 2, 3, 4, 5]);
   * console.log(arr.size());  // 5
   * ```
   */
  static from<K extends ArrayKeys>(
    arrayType: K,
    arr: KeyedArray[K][number][],
  ): _DynamicArray<K> {
    if (!Array.isArray(arr) || arr.length < 1) {
      throw new Error('arr must be an array');
    }

    const filtered = arr.filter(
      (x) => typeof x === 'number' && !Number.isNaN(x),
    );

    if (filtered.length < 1) {
      throw new Error(
        'arr must be an array with non-null length greater than 0',
      );
    }

    const dynArr = new _DynamicArray(arrayType, filtered.length);

    for (const e of filtered) {
      dynArr.push(e);
    }

    return dynArr;
  }

  *[Symbol.iterator](): Iterator<KeyedArray[Key][number]> {
    for (let i = 0; i < this.#current; i++) {
      const value = this.#buffer[i];

      assertDefined(value);
      yield value;
    }
  }
}

export type DynamicArray<T extends ArrayKeys> = _DynamicArray<T>;

/**
 * Creates an auto-growing typed array with dynamic resizing.
 *
 * Unlike standard TypedArrays, DynamicArray automatically grows when
 * capacity is reached (2x scaling) and shrinks when size drops below
 * capacity/2 (to save memory). Elements are stored contiguously in
 * a TypedArray for performance.
 *
 * @template Key - The TypedArray type key
 * @param arrayType - The data type of array elements
 * @param initialSize - The initial capacity of the array
 * @returns A new dynamic array instance
 * @throws {Error} If arrayType is invalid
 * @throws {Error} If initialSize is less than 1
 *
 * @remarks
 * - Growth: When full, capacity doubles (capacity * 2)
 * - Shrink: When size ≤ capacity/2, capacity halves
 * - Use SparseArray if you need stable indices
 *
 * @example
 * ```typescript
 * const positions = dynamicArray('f32', 100);
 *
 * // Add elements
 * positions.push(10.5);
 * positions.push(20.3);
 *
 * console.log(positions.size());      // 2
 * console.log(positions.capacity());  // 100
 *
 * // Auto-grows when needed
 * for (let i = 0; i < 200; i++) {
 *   positions.push(i * 0.1);
 * }
 * console.log(positions.capacity());  // 200 (auto-grew)
 * ```
 */
export const dynamicArray = <Key extends ArrayKeys>(
  arrayType: Key,
  initialSize: number,
): DynamicArray<Key> => {
  return new _DynamicArray(arrayType, initialSize);
};

export const dynamicArrayFrom = <Key extends ArrayKeys>(
  arrayType: Key,
  arr: KeyedArray[Key][number][],
): DynamicArray<Key> => {
  return _DynamicArray.from(arrayType, arr);
};
