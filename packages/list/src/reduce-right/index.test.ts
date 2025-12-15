import { describe, expect, test } from 'vitest';
import { reduceRight } from '.';

const concatStr = (base: string, add: string) => `${base}${add}`;
const arr = ['a', 'b', 'c', 'd', 'e'];

describe('reduceRight', () => {
  test('it should correctly reduce the array from the right', () => {
    const sumItems = reduceRight(concatStr)('');

    expect(sumItems(arr)).toStrictEqual('edcba');
  });

  test('it should return initial value for empty array', () => {
    const concatItems = reduceRight(concatStr)('');

    expect(concatItems([])).toStrictEqual('');
  });
});
