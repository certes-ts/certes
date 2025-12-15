import { describe, expect, test } from 'vitest';
import { some } from '.';

const emptyArr: number[] = [];
const someEvenArr = [1, 3, 6, 9, 10];
const mostlyZeroArr = [0, 0, 6, 0, 0];
const oddArr = [1, 3, 5, 7, 9, 11];
const zeroArr = [0, 0, 0, 0, 0];

describe('some', () => {
  test('it should return false for empty array', () => {
    const someBool = some(Boolean);
    const someMod = some((x: number) => x % 2 === 0);

    expect(someBool(emptyArr)).toBe(false);
    expect(someMod(emptyArr)).toBe(false);
  });

  test('it should return true for truthy predicate', () => {
    const someBool = some(Boolean);
    const someMod = some((x: number) => x % 2 === 0);

    expect(someMod(someEvenArr)).toBe(true);
    expect(someBool(mostlyZeroArr)).toBe(true);
  });

  test('it should return false for falsey predicate', () => {
    const someBool = some(Boolean);
    const someMod = some((x: number) => x % 2 === 0);

    expect(someMod(oddArr)).toBe(false);
    expect(someBool(zeroArr)).toBe(false);
  });
});
