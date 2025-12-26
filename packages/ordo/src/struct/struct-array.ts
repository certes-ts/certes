import {
  type ExtendedFieldType,
  type FieldType,
  isExtendedType,
} from './fields';
import { StructView } from './struct-view';
import type { Struct } from './struct';

export class StructArray<T extends Record<string, ExtendedFieldType>> {
  readonly buffer: ArrayBuffer;
  readonly capacity: number;
  private readonly _view: DataView;
  private _length = 0;

  constructor(
    readonly def: Struct<T>,
    capacity: number,
  ) {
    this.capacity = capacity;
    this.buffer = new ArrayBuffer(capacity * def.layout.stride);
    this._view = new DataView(this.buffer);
  }

  get length(): number {
    return this._length;
  }

  at(index: number): StructView<T> {
    if (index < 0 || index >= this._length) {
      throw new RangeError(`Index out of bounds: ${index}`);
    }
    const offset = index * this.def.layout.stride;
    return new StructView(this.def, this.buffer, offset);
  }

  push(values?: Partial<Record<keyof T, number>>): number {
    if (this._length >= this.capacity) {
      throw new RangeError('StructArray capacity exceeded');
    }

    const index = this._length++;

    if (values) {
      this.at(index).init(values);
    }

    return index;
  }

  get(index: number, fieldName: keyof T): number {
    if (index < 0 || index >= this._length) {
      throw new RangeError(`Index out of bounds: ${index}`);
    }

    const field = this.def.getField(fieldName as string);
    const type = field.type;

    if (isExtendedType(type)) {
      throw new Error(
        `Cannot use array.get() on complex field '${String(fieldName)}'. ` +
          `Use array.at(${index}).get('${String(fieldName)}') instead.`,
      );
    }

    const offset = index * this.def.layout.stride + field.offset;

    return (type as FieldType).get(this._view, offset);
  }

  set(index: number, fieldName: keyof T, value: number): void {
    if (index < 0 || index >= this._length) {
      throw new RangeError(`Index out of bounds: ${index}`);
    }

    const field = this.def.getField(fieldName as string);
    const type = field.type;

    if (isExtendedType(type)) {
      throw new Error(
        `Cannot use array.set() on complex field '${String(fieldName)}'. ` +
          `Use array.at(${index}).get('${String(fieldName)}') to access and modify.`,
      );
    }

    const offset = index * this.def.layout.stride + field.offset;

    (type as FieldType).set(this._view, offset, value);
  }

  forEach(fn: (view: StructView<T>, index: number) => void): void {
    for (let i = 0; i < this._length; i++) {
      fn(this.at(i), i);
    }
  }

  clear(): void {
    this._length = 0;
  }
}
