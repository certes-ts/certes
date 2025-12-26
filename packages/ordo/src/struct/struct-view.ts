import {
  type ArrayFieldType,
  type CircularBufferFieldType,
  type CircularBufferStructField,
  type ExtendedFieldType,
  type FieldType,
  isExtendedType,
  type Utf8FieldType,
  type Utf8StructField,
} from './fields';
import type { ArrayKeys, KeyedArray } from '../types';
import type { Struct } from './struct';

type AnyTypedArray = KeyedArray[ArrayKeys];
type ExtractArrayKey<T> = T extends ArrayFieldType<infer K> ? K : never;
type ExtractCircularKey<T> =
  T extends CircularBufferFieldType<infer K> ? K : never;

export class StructView<T extends Record<string, ExtendedFieldType>> {
  readonly #def: Struct<T>;
  readonly #buffer: ArrayBuffer;
  readonly #byteOffset: number;

  constructor(def: Struct<T>, buffer: ArrayBuffer, byteOffset: number) {
    if (byteOffset % def.layout.alignment !== 0) {
      throw new Error(
        `byteOffset ${byteOffset} is not aligned to ${def.layout.alignment} bytes`,
      );
    }

    if (byteOffset + def.layout.stride > buffer.byteLength) {
      throw new RangeError(
        `Struct at offset ${byteOffset} exceeds buffer size ${buffer.byteLength}`,
      );
    }

    this.#def = def;
    this.#buffer = buffer;
    this.#byteOffset = byteOffset;
  }

  private get view(): DataView {
    return new DataView(
      this.#buffer,
      this.#byteOffset,
      this.#def.layout.stride,
    );
  }

  get<K extends keyof T>(fieldName: T[K] extends FieldType ? K : never): number;
  get<K extends keyof T>(
    // biome-ignore lint/suspicious/noExplicitAny: It's fine
    fieldName: T[K] extends ArrayFieldType<any> ? K : never,
  ): KeyedArray[ExtractArrayKey<T[K]>];
  get<K extends keyof T>(
    fieldName: T[K] extends Utf8FieldType ? K : never,
  ): Utf8StructField;
  get<K extends keyof T>(
    // biome-ignore lint/suspicious/noExplicitAny: It's fine
    fieldName: T[K] extends CircularBufferFieldType<any> ? K : never,
  ): CircularBufferStructField<ExtractCircularKey<T[K]>>;
  get(
    fieldName: keyof T,
  ):
    | number
    | AnyTypedArray
    | Utf8StructField
    | CircularBufferStructField<ArrayKeys> {
    const field = this.#def.getField(fieldName as string);
    const type = field.type;

    if (isExtendedType(type)) {
      if (type.kind === 'array') {
        return type.get(this.#buffer, this.#byteOffset + field.offset);
      }
      if (type.kind === 'utf8') {
        return type.get(this.#buffer, this.#byteOffset + field.offset);
      }
      if (type.kind === 'circular') {
        return type.get(this.#buffer, this.#byteOffset + field.offset);
      }
    }

    return (type as FieldType).get(this.view, field.offset);
  }

  set(fieldName: keyof T, value: number): void {
    const field = this.#def.getField(fieldName as string);
    const type = field.type;

    if (isExtendedType(type)) {
      throw new Error(
        `Cannot use set() on complex field '${String(fieldName)}'. ` +
          'Use get() to access the field and modify it directly.',
      );
    }

    (type as FieldType).set(this.view, field.offset, value);
  }

  init(values: Partial<Record<keyof T, number>>): void {
    for (const [key, value] of Object.entries(values)) {
      if (value !== undefined) {
        this.set(key as keyof T, value);
      }
    }
  }

  copyFrom(other: StructView<T>): void {
    const src = new Uint8Array(
      other.#buffer,
      other.#byteOffset,
      this.#def.layout.stride,
    );
    const dst = new Uint8Array(
      this.#buffer,
      this.#byteOffset,
      this.#def.layout.stride,
    );
    dst.set(src);
  }
}
