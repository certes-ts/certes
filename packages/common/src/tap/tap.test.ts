import { beforeEach, describe, expect, it } from 'vitest';
import { tap } from '.';

let sideEffect = 5;

const tapper = (n: number) => {
  sideEffect = sideEffect + n;
};

const tapped = tap(tapper);

describe('Tap', () => {
  beforeEach(() => {
    sideEffect = 5;
  });

  it('should tap the given function', () => {
    const _actual = tapped(5);

    expect(sideEffect).toEqual(10);
  });

  it('should return the given value', () => {
    const actual = tapped(5);

    expect(actual).toEqual(5);
  });

  it('should propagate exceptions from tapped function', () => {
    const thrower = () => {
      throw new Error('test');
    };
    const tappedThrower = tap(thrower);

    expect(() => tappedThrower(5)).toThrow('test');
  });
});
