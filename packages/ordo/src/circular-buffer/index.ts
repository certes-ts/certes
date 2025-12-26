import { type ArrayKeys, arrayTypes, type KeyedArray } from '../types';
import { assertDefined } from '../utils';

export class _CircularBuffer<Key extends ArrayKeys> {
  readonly #construct: (typeof arrayTypes)[Key];
  readonly #buffer: KeyedArray[Key];
  readonly #capacity: number;
  #current = 0;
  #head = 0;
  #tail = 0;

  constructor(bufferType: Key, capacity: number) {
    if (!bufferType) {
      throw new TypeError('bufferType must be provided');
    }

    if (!arrayTypes[bufferType]) {
      throw new TypeError(`Unknown buffer type "${bufferType}"`);
    }

    if (!capacity || capacity < 1) {
      throw new Error(`capacity must be greater than 0, ${capacity} given`);
    }

    this.#construct = arrayTypes[bufferType];

    const maxCapacity = Math.floor(2 ** 31 / this.#construct.BYTES_PER_ELEMENT);

    if (capacity > maxCapacity) {
      throw new RangeError(
        `Capacity ${capacity} exceeds maximum ${maxCapacity} for ${bufferType}`,
      );
    }

    this.#buffer = new this.#construct(capacity) as KeyedArray[Key];
    this.#capacity = capacity;
  }

  enqueue(value: KeyedArray[Key][number]): void {
    const wasFull = this.#current >= this.#capacity;

    this.#buffer[this.#tail] = value;
    this.#tail = (this.#tail + 1) % this.#capacity;

    if (wasFull) {
      this.#head = (this.#head + 1) % this.#capacity;
    } else {
      this.#current++;
    }
  }

  dequeue(): KeyedArray[Key][number] {
    if (this.#current === 0) {
      throw new RangeError('Cannot dequeue from empty buffer');
    }

    const value = this.#buffer[this.#head];

    assertDefined(value);
    this.#head = (this.#head + 1) % this.#capacity;
    this.#current--;

    return value;
  }

  peek(): KeyedArray[Key][number] {
    if (this.#current === 0) {
      throw new RangeError('Cannot peek into empty buffer');
    }

    const value = this.#buffer[this.#head];

    assertDefined(value);

    return value;
  }

  size(): number {
    return this.#current;
  }

  capacity(): number {
    return this.#capacity;
  }

  clear(): void {
    this.#head = 0;
    this.#tail = 0;
    this.#current = 0;
  }

  toArray(): KeyedArray[Key][number][] {
    const arr: KeyedArray[Key][number][] = new Array(this.#current);

    for (let i = 0; i < this.#current; i++) {
      const value = this.#buffer[(this.#head + i) % this.#capacity];

      assertDefined(value);
      arr[i] = value;
    }

    return arr;
  }

  /**
   * Creates a circular buffer from an existing array.
   *
   * @template K - The TypedArray type key
   * @param bufferType - The data type for buffer elements
   * @param arr - Array of numbers to initialize with
   * @returns A new circular buffer instance
   * @throws {Error} If array is empty
   *
   * @example
   * ```typescript
   * const buf = _CircularBuffer.from('f32', [1, 2, 3, 4, 5]);
   * console.log(buf.size());  // 5
   * ```
   */
  static from<K extends ArrayKeys>(
    bufferType: K,
    arr: KeyedArray[K][number][],
  ): _CircularBuffer<K> {
    if (!Array.isArray(arr) || arr.length < 1) {
      throw new Error('arr must be an array with length greater than 0');
    }

    const buf = new _CircularBuffer(bufferType, arr.length);

    for (const e of arr) {
      buf.enqueue(e);
    }

    return buf;
  }

  *[Symbol.iterator](): Iterator<KeyedArray[Key][number]> {
    for (let i = 0; i < this.#current; i++) {
      const value = this.#buffer[(this.#head + i) % this.#capacity];

      assertDefined(value);
      yield value;
    }
  }
}

export type CircularBuffer<T extends ArrayKeys> = _CircularBuffer<T>;

/**
 * Creates a fixed-capacity circular buffer (FIFO queue) with automatic wraparound.
 *
 * When the buffer is full, enqueueing a new element overwrites the oldest element.
 * This is useful for sliding windows, frame timing, sensor readings, and other
 * time-series data where only recent values matter.
 *
 * @template Key - The TypedArray type key (e.g., 'f32', 'u32')
 * @param bufferType - The data type of elements in the buffer
 * @param capacity - The maximum number of elements the buffer can hold
 * @returns A new circular buffer instance
 * @throws {Error} If bufferType is invalid or not recognized
 * @throws {Error} If capacity is less than 1
 *
 * @remarks
 * The buffer uses contiguous memory (TypedArray) for cache-friendly access.
 *
 * @example
 * ```typescript
 * // Create buffer for last 60 frame times
 * const frameTimes = circularBuffer('f64', 60);
 *
 * frameTimes.enqueue(16.67);  // Add frame time
 * frameTimes.enqueue(16.33);
 *
 * console.log(frameTimes.size());    // 2
 * console.log(frameTimes.peek());    // 16.67 (oldest)
 * console.log(frameTimes.dequeue()); // 16.67 (removes oldest)
 * ```
 *
 * @see {@link circularBufferFrom} for creating from existing array
 */
export const circularBuffer = <Key extends ArrayKeys>(
  bufferType: Key,
  capacity: number,
): CircularBuffer<Key> => {
  return new _CircularBuffer(bufferType, capacity);
};

/**
 * Creates a circular buffer from an existing array of numbers.
 *
 * All elements from the input array are enqueued in order. The buffer
 * capacity is set to the array length.
 *
 * @template Key - The TypedArray type key
 * @param bufferType - The data type for buffer elements
 * @param arr - Array of numbers to initialize the buffer with
 * @returns A new circular buffer containing the array elements
 * @throws {Error} If array is empty or has length less than 1
 *
 * @example
 * ```typescript
 * const readings = circularBufferFrom('f32', [1.0, 2.0, 3.0, 4.0, 5.0]);
 *
 * console.log(readings.size());    // 5
 * console.log(readings.toArray()); // [1, 2, 3, 4, 5]
 * ```
 */
export const circularBufferFrom = <Key extends ArrayKeys>(
  bufferType: Key,
  arr: KeyedArray[Key][number][],
): CircularBuffer<Key> => {
  return _CircularBuffer.from(bufferType, arr);
};
