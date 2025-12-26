import { type ExtendedFieldType, isExtendedType } from './fields';
import { StructArray } from './struct-array';
import { StructView } from './struct-view';

export type FieldDescriptor = {
  readonly name: string;
  readonly type: ExtendedFieldType;
  readonly offset: number;
};

export type StructLayout = {
  readonly fields: readonly FieldDescriptor[];
  readonly stride: number;
  readonly alignment: number;
};

const alignOffset = (offset: number, alignment: number): number => {
  const remainder = offset % alignment;
  return remainder === 0 ? offset : offset + (alignment - remainder);
};

const calculateLayout = (
  schema: Record<string, ExtendedFieldType>,
): StructLayout => {
  const fields: FieldDescriptor[] = [];
  let offset = 0;
  let maxAlignment = 1;

  for (const [name, type] of Object.entries(schema)) {
    offset = alignOffset(offset, type.alignment);
    fields.push({ name, type, offset });
    offset += type.size;
    maxAlignment = Math.max(maxAlignment, type.alignment);
  }

  const stride = alignOffset(offset, maxAlignment);

  return { fields, stride, alignment: maxAlignment };
};

export class Struct<T extends Record<string, ExtendedFieldType>> {
  readonly layout: StructLayout;
  private readonly fieldMap: Map<string, FieldDescriptor>;

  constructor(schema: T) {
    this.layout = calculateLayout(schema);
    this.fieldMap = new Map(
      this.layout.fields.map((field) => [field.name, field]),
    );
  }

  create(): StructView<T> {
    const buffer = new ArrayBuffer(this.layout.stride);

    return new StructView(this, buffer, 0);
  }

  createArray(capacity: number): StructArray<T> {
    return new StructArray(this, capacity);
  }

  getField(name: string): FieldDescriptor {
    const field = this.fieldMap.get(name);

    if (!field) {
      throw new Error(`Unknown field: ${name}`);
    }

    return field;
  }

  inspect(): void {
    // Header
    console.log(
      `\n${'Field'.padEnd(20)} ${'Offset'.padEnd(8)} ${'Size'.padEnd(8)}`,
    );
    console.log(`${'-'.repeat(20)} ${'-'.repeat(8)} ${'-'.repeat(8)}`);

    let lastEnd = 0;

    for (const field of this.layout.fields) {
      if (field.offset > lastEnd) {
        const paddingSize = field.offset - lastEnd;
        console.log(
          `${'[PADDING]'.padEnd(20)} ${lastEnd.toString().padEnd(8)} ${paddingSize.toString().padEnd(8)}`,
        );
      }

      const fieldDisplay = this.getFieldDisplay(field);
      console.log(
        `${fieldDisplay.padEnd(20)} ${field.offset.toString().padEnd(8)} ${field.type.size.toString().padEnd(8)}`,
      );

      lastEnd = field.offset + field.type.size;
    }

    if (this.layout.stride > lastEnd) {
      const paddingSize = this.layout.stride - lastEnd;
      console.log(
        `${'[PADDING]'.padEnd(20)} ${lastEnd.toString().padEnd(8)} ${paddingSize.toString().padEnd(8)}`,
      );
    }

    const wastedBytes =
      this.layout.stride -
      this.layout.fields.reduce((sum, f) => sum + f.type.size, 0);
    const efficiency = (
      ((this.layout.stride - wastedBytes) / this.layout.stride) *
      100
    ).toFixed(1);

    console.log(`\nTotal size: ${this.layout.stride} bytes`);
    console.log(`Actual data: ${this.layout.stride - wastedBytes} bytes`);
    console.log(`Wasted: ${wastedBytes} bytes`);
    console.log(`Efficiency: ${efficiency}%`);
  }

  private getFieldDisplay(field: FieldDescriptor): string {
    const type = field.type;

    if (isExtendedType(type)) {
      if (type.kind === 'array') {
        return `${field.name}[${type.length}]`;
      }
      if (type.kind === 'utf8') {
        return `${field.name}[${type.byteLength}]`;
      }
      if (type.kind === 'circular') {
        return `${field.name}[${type.capacity}]`;
      }
    }

    return field.name;
  }
}
