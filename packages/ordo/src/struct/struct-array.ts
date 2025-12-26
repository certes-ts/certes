import {
  type ExtendedFieldType,
  type FieldType,
  isExtendedType,
} from './fields';
import { StructView } from './struct-view';
import type { Struct } from './struct';

export class StructArray<T extends Record<string, ExtendedFieldType>> {
  readonly #buffer: ArrayBuffer;
  readonly #capacity: number;
  readonly #view: DataView;
  readonly #def: Struct<T>;
  #length = 0;

  constructor(def: Struct<T>, capacity: number) {
    this.#capacity = capacity;
    this.#buffer = new ArrayBuffer(capacity * def.layout.stride);
    this.#view = new DataView(this.#buffer);
    this.#def = def;
  }

  get length(): number {
    return this.#length;
  }

  get capacity(): number {
    return this.#capacity;
  }

  at(index: number): StructView<T> {
    if (index < 0 || index >= this.#length) {
      throw new RangeError(`Index out of bounds: ${index}`);
    }

    const offset = index * this.#def.layout.stride;

    return new StructView(this.#def, this.#buffer, offset);
  }

  push(values?: Partial<Record<keyof T, number>>): number {
    if (this.#length >= this.#capacity) {
      throw new RangeError('StructArray capacity exceeded');
    }

    const index = this.#length++;

    if (values) {
      this.at(index).init(values);
    }

    return index;
  }

  get(index: number, fieldName: keyof T): number {
    if (index < 0 || index >= this.#length) {
      throw new RangeError(`Index out of bounds: ${index}`);
    }

    const field = this.#def.getField(fieldName as string);
    const type = field.type;

    if (isExtendedType(type)) {
      throw new Error(
        `Cannot use array.get() on complex field '${String(fieldName)}'. ` +
          `Use array.at(${index}).get('${String(fieldName)}') instead.`,
      );
    }

    const offset = index * this.#def.layout.stride + field.offset;

    return (type as FieldType).get(this.#view, offset);
  }

  set(index: number, fieldName: keyof T, value: number): void {
    if (index < 0 || index >= this.#length) {
      throw new RangeError(`Index out of bounds: ${index}`);
    }

    const field = this.#def.getField(fieldName as string);
    const type = field.type;

    if (isExtendedType(type)) {
      throw new Error(
        `Cannot use array.set() on complex field '${String(fieldName)}'. ` +
          `Use array.at(${index}).get('${String(fieldName)}') to access and modify.`,
      );
    }

    const offset = index * this.#def.layout.stride + field.offset;

    (type as FieldType).set(this.#view, offset, value);
  }

  forEach(fn: (view: StructView<T>, index: number) => void): void {
    for (let i = 0; i < this.#length; i++) {
      fn(this.at(i), i);
    }
  }

  clear(): void {
    this.#length = 0;
  }
}
