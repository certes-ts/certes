import { describe, expect, it } from 'vitest';
import {
  nullishOr,
  nullishOrFn,
  swappedNullishOr,
  swappedNullishOrFn,
} from '.';

const isEven = (x: number) => !(x & 1);

// biome-ignore lint/suspicious/noExplicitAny: For testing
const nullVal = (_x: any) => null;

describe('NullishOr', () => {
  it('should return true for true ?? true', () => {
    expect(nullishOr(true)(true)).toEqual(true);
  });

  it('should return true for true ?? null', () => {
    expect(nullishOr(true)(null)).toEqual(true);
  });

  it('should return true for null ?? true', () => {
    expect(nullishOr(null)(true)).toEqual(true);
  });

  it('should return null for null ?? null', () => {
    expect(nullishOr(null)(null)).toBeNull();
  });

  it('should preserve 0 as non-nullish', () => {
    const a = 0;
    const b = 100;
    const actual = nullishOr(a)(b);

    expect(actual).toBe(0);
  });

  it('should preserve false as non-nullish', () => {
    const a = false;
    const b = true;
    const actual = nullishOr(a)(b);

    expect(actual).toBe(false);
  });

  it('should preserve empty string as non-nullish', () => {
    const a = '';
    const b = 'fallback';
    const actual = nullishOr(a)(b);

    expect(actual).toBe('');
  });

  it('should treat undefined as nullish', () => {
    const a = undefined;
    const b = 'fallback';
    const actual = nullishOr(a)(b);

    expect(actual).toBe('fallback');
  });
});

describe('NullishOrFn', () => {
  it('should return true for true ?? true', () => {
    expect(nullishOrFn(isEven)(isEven)(6)).toEqual(true);
  });

  it('should return true for null ?? true', () => {
    expect(nullishOrFn(nullVal)(isEven)(6)).toEqual(true);
  });

  it('should return true for true ?? null', () => {
    expect(nullishOrFn(isEven)(nullVal)(6)).toEqual(true);
  });

  it('should return null for null ?? null', () => {
    expect(nullishOrFn(nullVal)(nullVal)(6)).toEqual(null);
  });
});

describe('SwappedNullishOr', () => {
  it('should return true for true ?? true', () => {
    expect(swappedNullishOr(true)(true)).toEqual(true);
  });

  it('should return true for true ?? null', () => {
    expect(swappedNullishOr(true)(null)).toEqual(true);
  });

  it('should return true for null ?? true', () => {
    expect(swappedNullishOr(null)(true)).toEqual(true);
  });

  it('should return null for null ?? null', () => {
    expect(swappedNullishOr(null)(null)).toEqual(null);
  });
});

describe('SwappedNullishOrFn', () => {
  it('should return true for true ?? true', () => {
    expect(swappedNullishOrFn(isEven)(isEven)(6)).toEqual(true);
  });

  it('should return true for null ?? true', () => {
    expect(swappedNullishOrFn(nullVal)(isEven)(6)).toEqual(true);
  });

  it('should return true for true ?? null', () => {
    expect(swappedNullishOrFn(isEven)(nullVal)(6)).toEqual(true);
  });

  it('should return null for null ?? null', () => {
    expect(swappedNullishOrFn(nullVal)(nullVal)(6)).toEqual(null);
  });
});
