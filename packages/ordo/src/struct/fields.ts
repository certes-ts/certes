import { type ArrayKeys, arrayTypes, type KeyedArray } from '../types';
import { assertDefined } from '../utils';

export type FieldType = {
  readonly size: number;
  readonly alignment: number;
  readonly get: (view: DataView, offset: number) => number;
  readonly set: (view: DataView, offset: number, value: number) => void;
};

// -------------------------------------------------
// Primitive Types

export const int8: FieldType = {
  size: 1,
  alignment: 1,
  get: (view, offset) => view.getInt8(offset),
  set: (view, offset, value) => view.setInt8(offset, value),
};

export const uint8: FieldType = {
  size: 1,
  alignment: 1,
  get: (view, offset) => view.getUint8(offset),
  set: (view, offset, value) => view.setUint8(offset, value),
};

export const int16: FieldType = {
  size: 2,
  alignment: 2,
  get: (view, offset) => view.getInt16(offset, true),
  set: (view, offset, value) => view.setInt16(offset, value, true),
};

export const uint16: FieldType = {
  size: 2,
  alignment: 2,
  get: (view, offset) => view.getUint16(offset, true),
  set: (view, offset, value) => view.setUint16(offset, value, true),
};

export const int32: FieldType = {
  size: 4,
  alignment: 4,
  get: (view, offset) => view.getInt32(offset, true),
  set: (view, offset, value) => view.setInt32(offset, value, true),
};

export const uint32: FieldType = {
  size: 4,
  alignment: 4,
  get: (view, offset) => view.getUint32(offset, true),
  set: (view, offset, value) => view.setUint32(offset, value, true),
};

export const float32: FieldType = {
  size: 4,
  alignment: 4,
  get: (view, offset) => view.getFloat32(offset, true),
  set: (view, offset, value) => view.setFloat32(offset, value, true),
};

export const float64: FieldType = {
  size: 8,
  alignment: 8,
  get: (view, offset) => view.getFloat64(offset, true),
  set: (view, offset, value) => view.setFloat64(offset, value, true),
};

// -------------------------------------------------
// Field Accessor Classes

export class Utf8StructField {
  readonly #buffer: ArrayBuffer;
  readonly #offset: number;
  readonly #byteLength: number;
  readonly #encoder = new TextEncoder();
  readonly #decoder = new TextDecoder();

  constructor(buffer: ArrayBuffer, offset: number, byteLength: number) {
    this.#buffer = buffer;
    this.#offset = offset;
    this.#byteLength = byteLength;
  }

  get(): string {
    const view = new Uint8Array(this.#buffer, this.#offset, this.#byteLength);
    // biome-ignore lint/suspicious/noControlCharactersInRegex: This is intentional
    return this.#decoder.decode(view).replace(/\u0000+$/, '');
  }

  set(value: string): void {
    try {
      const encoded = this.#encoder.encode(value);
      const view = new Uint8Array(this.#buffer, this.#offset, this.#byteLength);

      view.fill(0);

      const bytesToCopy = Math.min(encoded.length, this.#byteLength);
      view.set(encoded.subarray(0, bytesToCopy));
    } catch (err) {
      throw new Error(`Failed to encode UTF-8 string: ${err}`);
    }
  }

  getRaw(): Uint8Array {
    return new Uint8Array(this.#buffer, this.#offset, this.#byteLength);
  }
}

export class CircularBufferStructField<Key extends ArrayKeys> {
  readonly #capacity: number;
  readonly #view: DataView;
  readonly #data: KeyedArray[Key];

  constructor(
    buffer: ArrayBuffer,
    offset: number,
    arrayType: Key,
    capacity: number,
    dataOffset: number,
  ) {
    this.#capacity = capacity;
    this.#view = new DataView(buffer, offset, 12);

    const TypedArrayConstructor = arrayTypes[arrayType];

    this.#data = new TypedArrayConstructor(
      buffer,
      offset + dataOffset,
      capacity,
    ) as KeyedArray[Key];
  }

  private get head(): number {
    return this.#view.getUint32(0, true);
  }

  private set head(value: number) {
    this.#view.setUint32(0, value, true);
  }

  private get tail(): number {
    return this.#view.getUint32(4, true);
  }

  private set tail(value: number) {
    this.#view.setUint32(4, value, true);
  }

  private get current(): number {
    return this.#view.getUint32(8, true);
  }

  private set current(value: number) {
    this.#view.setUint32(8, value, true);
  }

  enqueue(value: KeyedArray[Key][number]): void {
    const wasFull = this.current >= this.#capacity;

    this.#data[this.tail] = value;
    this.tail = (this.tail + 1) % this.#capacity;

    if (wasFull) {
      this.head = (this.head + 1) % this.#capacity;
    } else {
      this.current = this.current + 1;
    }
  }

  dequeue(): KeyedArray[Key][number] {
    if (this.current === 0) {
      throw new RangeError('Cannot dequeue from empty circular buffer');
    }

    const value = this.#data[this.head];

    assertDefined(value);
    this.head = (this.head + 1) % this.#capacity;
    this.current = this.current - 1;

    return value;
  }

  peek(): KeyedArray[Key][number] {
    if (this.current === 0) {
      throw new RangeError('Cannot peek into empty circular buffer');
    }

    const value = this.#data[this.head];

    assertDefined(value);

    return value;
  }

  size(): number {
    return this.current;
  }

  capacity(): number {
    return this.#capacity;
  }

  clear(): void {
    this.head = 0;
    this.tail = 0;
    this.current = 0;
  }

  toArray(): KeyedArray[Key][number][] {
    const arr: KeyedArray[Key][number][] = new Array(this.current);

    for (let i = 0; i < this.current; i++) {
      const value = this.#data[(this.head + i) % this.#capacity];

      assertDefined(value);
      arr[i] = value;
    }

    return arr;
  }

  getRaw(): KeyedArray[Key] {
    return this.#data;
  }
}

// -------------------------------------------------
// Extended Field Types

export type ArrayFieldType<Key extends ArrayKeys> = {
  readonly kind: 'array';
  readonly arrayType: Key;
  readonly length: number;
  readonly size: number;
  readonly alignment: number;
  readonly elementSize: number;
  readonly get: (buffer: ArrayBuffer, offset: number) => KeyedArray[Key];
};

export type Utf8FieldType = {
  readonly kind: 'utf8';
  readonly byteLength: number;
  readonly size: number;
  readonly alignment: number;
  readonly get: (buffer: ArrayBuffer, offset: number) => Utf8StructField;
};

export type CircularBufferFieldType<Key extends ArrayKeys> = {
  readonly kind: 'circular';
  readonly arrayType: Key;
  readonly capacity: number;
  readonly size: number;
  readonly alignment: number;
  readonly get: (
    buffer: ArrayBuffer,
    offset: number,
  ) => CircularBufferStructField<Key>;
};

export type FieldTypeExtensions =
  | ArrayFieldType<ArrayKeys>
  | Utf8FieldType
  | CircularBufferFieldType<ArrayKeys>;

export type ExtendedFieldType = FieldType | FieldTypeExtensions;

export const isExtendedType = (
  type: ExtendedFieldType,
): type is FieldTypeExtensions => Object.hasOwn(type, 'kind');

// -------------------------------------------------
// Field Type Creators

export const array = <Key extends ArrayKeys>(
  arrayType: Key,
  length: number,
): ArrayFieldType<Key> => {
  const TypedArrayConstructor = arrayTypes[arrayType];
  const elementSize = TypedArrayConstructor.BYTES_PER_ELEMENT;

  return {
    kind: 'array',
    arrayType,
    length,
    size: elementSize * length,
    alignment: elementSize,
    elementSize,
    get: (buffer: ArrayBuffer, offset: number) => {
      return new TypedArrayConstructor(
        buffer,
        offset,
        length,
      ) as KeyedArray[Key];
    },
  };
};

export const utf8 = (byteLength: number): Utf8FieldType => {
  return {
    kind: 'utf8',
    byteLength,
    size: byteLength,
    alignment: 1,
    get: (buffer: ArrayBuffer, offset: number) => {
      return new Utf8StructField(buffer, offset, byteLength);
    },
  };
};

export const circular = <Key extends ArrayKeys>(
  arrayType: Key,
  capacity: number,
): CircularBufferFieldType<Key> => {
  const TypedArrayConstructor = arrayTypes[arrayType];
  const elementSize = TypedArrayConstructor.BYTES_PER_ELEMENT;

  const metadataSize = 12;
  const dataSize = elementSize * capacity;
  const dataAlignment = elementSize;

  const alignedMetadataSize =
    Math.ceil(metadataSize / dataAlignment) * dataAlignment;

  return {
    kind: 'circular',
    arrayType,
    capacity,
    size: alignedMetadataSize + dataSize,
    alignment: Math.max(4, dataAlignment),
    get: (buffer: ArrayBuffer, offset: number) => {
      return new CircularBufferStructField(
        buffer,
        offset,
        arrayType,
        capacity,
        alignedMetadataSize,
      );
    },
  };
};
