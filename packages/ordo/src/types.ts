export type KeyedArray = {
  u8: Uint8Array;
  i8: Int8Array;
  u16: Uint16Array;
  i16: Int16Array;
  u32: Uint32Array;
  i32: Int32Array;
  f32: Float32Array;
  f64: Float64Array;
  i64: BigInt64Array;
  u64: BigUint64Array;
};

export const arrayTypes = {
  u8: Uint8Array,
  i8: Int8Array,
  u16: Uint16Array,
  i16: Int16Array,
  u32: Uint32Array,
  i32: Int32Array,
  f32: Float32Array,
  f64: Float64Array,
  i64: BigInt64Array,
  u64: BigUint64Array,
} as const;

export type ArrayTypes = typeof arrayTypes;
export type ArrayKeys = keyof ArrayTypes;
