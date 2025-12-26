export class Utf8TypedArray {
  readonly #arr: Uint8Array;
  readonly #byteLen: number;
  #index = 0;
  readonly #encoder = new TextEncoder();
  readonly #decoder = new TextDecoder();

  constructor(stringLen: number, maxCollectionLen: number) {
    this.#arr = new Uint8Array(maxCollectionLen);
    this.#byteLen = stringLen;
  }

  push(val: string): void {
    // Check if we have space for another string
    if (this.#index >= Math.floor(this.#arr.length / this.#byteLen)) {
      throw new RangeError(
        `Utf8TypedArray capacity exceeded. Current index: ${this.#index}, ` +
          `max index: ${Math.floor(this.#arr.length / this.#byteLen) - 1}`,
      );
    }

    const encoding = this.#encoder.encode(val);
    const offset = this.#byteLen * this.#index;

    this.#arr.set(encoding, offset);
    this.#index += 1;
  }

  at(index: number): string {
    // Bounds check
    if (index < 0 || index >= this.#index) {
      throw new RangeError(
        `Index out of range. ${index} given, max index is ${this.#index - 1}`,
      );
    }

    return (
      this.#decoder
        .decode(
          new Uint8Array(
            this.#arr.buffer,
            index * this.#byteLen,
            this.#byteLen,
          ),
        )
        // biome-ignore lint/suspicious/noControlCharactersInRegex: This is intentional
        .replace(/\u0000+$/, '')
    );
  }

  array(): Uint8Array {
    return this.#arr;
  }

  static from(chunkSize: number, buffer: ArrayBuffer): Utf8TypedArray {
    const len = buffer.byteLength;
    const ta = new Utf8TypedArray(chunkSize, len);

    ta.#arr.set(new Uint8Array(buffer));

    return ta;
  }
}
