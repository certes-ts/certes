import {
  type ExtendedFieldType,
  type FieldType,
  isExtendedType,
} from './fields';
import { StructView } from './struct-view';
import type { Struct } from './struct';

const SCALING_FACTOR = 2;

export class DynamicStructArray<T extends Record<string, ExtendedFieldType>> {
  readonly def: Struct<T>;
  #buffer: ArrayBuffer;
  #capacity: number;
  #view: DataView;
  #length = 0;

  constructor(def: Struct<T>, initialCapacity: number) {
    if (initialCapacity < 1) {
      throw new Error('initialCapacity must be greater than 0');
    }

    this.def = def;
    this.#capacity = initialCapacity;
    this.#buffer = new ArrayBuffer(initialCapacity * def.layout.stride);
    this.#view = new DataView(this.#buffer);
  }

  get length(): number {
    return this.#length;
  }

  get capacity(): number {
    return this.#capacity;
  }

  private resize(newCapacity: number): void {
    const newBuffer = new ArrayBuffer(newCapacity * this.def.layout.stride);
    const oldView = new Uint8Array(
      this.#buffer,
      0,
      this.#length * this.def.layout.stride,
    );
    const newView = new Uint8Array(newBuffer);

    newView.set(oldView);

    this.#buffer = newBuffer;
    this.#capacity = newCapacity;
    this.#view = new DataView(this.#buffer);
  }

  push(values?: Partial<Record<keyof T, number>>): number {
    if (this.#length >= this.#capacity) {
      this.resize(this.#capacity * SCALING_FACTOR);
    }

    const index = this.#length++;

    if (values) {
      this.at(index).init(values);
    }

    return index;
  }

  pop(): StructView<T> | undefined {
    if (this.#length === 0) {
      return undefined;
    }

    const view = this.at(this.#length - 1);
    this.#length--;

    const minCapacity = Math.max(
      1,
      Math.floor(this.#capacity / SCALING_FACTOR),
    );
    if (this.#length <= minCapacity) {
      this.resize(minCapacity);
    }

    return view;
  }

  at(index: number): StructView<T> {
    if (index < 0 || index >= this.#length) {
      throw new RangeError(
        `Index out of range: ${index}, length is ${this.#length}`,
      );
    }

    const offset = index * this.def.layout.stride;
    return new StructView(this.def, this.#buffer, offset);
  }

  remove(index: number): void {
    if (index < 0 || index >= this.#length) {
      throw new RangeError(
        `Index out of range: ${index}, length is ${this.#length}`,
      );
    }

    const view = new Uint8Array(this.#buffer);
    const stride = this.def.layout.stride;
    const srcOffset = (index + 1) * stride;
    const dstOffset = index * stride;
    const bytesToMove = (this.#length - index - 1) * stride;

    view.copyWithin(dstOffset, srcOffset, srcOffset + bytesToMove);

    this.#length--;

    const minCapacity = Math.max(
      1,
      Math.floor(this.#capacity / SCALING_FACTOR),
    );

    if (this.#length <= minCapacity) {
      this.resize(minCapacity);
    }
  }

  get(index: number, fieldName: keyof T): number {
    if (index < 0 || index >= this.#length) {
      throw new RangeError(
        `Index out of range: ${index}, length is ${this.#length}`,
      );
    }

    const field = this.def.getField(fieldName as string);
    const type = field.type;

    if (isExtendedType(type)) {
      throw new Error(
        `Cannot use get() on complex field '${String(fieldName)}'. ` +
          `Use at(${index}).get('${String(fieldName)}') instead.`,
      );
    }

    const offset = index * this.def.layout.stride + field.offset;

    return (type as FieldType).get(this.#view, offset);
  }

  set(index: number, fieldName: keyof T, value: number): void {
    if (index < 0 || index >= this.#length) {
      throw new RangeError(
        `Index out of range: ${index}, length is ${this.#length}`,
      );
    }

    const field = this.def.getField(fieldName as string);
    const type = field.type;

    if (isExtendedType(type)) {
      throw new Error(
        `Cannot use set() on complex field '${String(fieldName)}'. ` +
          `Use at(${index}).get('${String(fieldName)}') to access and modify.`,
      );
    }

    const offset = index * this.def.layout.stride + field.offset;

    (type as FieldType).set(this.#view, offset, value);
  }

  clear(): void {
    this.#length = 0;
  }

  forEach(fn: (view: StructView<T>, index: number) => void): void {
    for (let i = 0; i < this.#length; i++) {
      fn(this.at(i), i);
    }
  }

  *[Symbol.iterator](): Iterator<StructView<T>> {
    for (let i = 0; i < this.#length; i++) {
      yield this.at(i);
    }
  }

  getRawBuffer(): ArrayBuffer {
    return this.#buffer.slice(0, this.#length * this.def.layout.stride);
  }
}
