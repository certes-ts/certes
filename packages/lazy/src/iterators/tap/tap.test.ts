import { describe, expect, it, vi } from 'vitest';
import { collect } from '../../helpers/collect';
import { take } from '../take';
import { tap } from '.';

describe('Tap', () => {
  it('should call the function for each element without modifying them', () => {
    const sideEffects: number[] = [];

    const result = collect(
      tap((x: number) => sideEffects.push(x * 2))([1, 2, 3]),
    );

    expect(result).toEqual([1, 2, 3]);
    expect(sideEffects).toEqual([2, 4, 6]);
  });

  it('should pass the index as the second argument', () => {
    const indices: number[] = [];

    collect(tap((_, idx) => indices.push(idx as number))([10, 20, 30]));

    expect(indices).toEqual([0, 1, 2]);
  });

  it('should not call the function for empty input', () => {
    const fn = vi.fn();

    collect(tap(fn)([]));

    expect(fn).not.toHaveBeenCalled();
  });

  it('should be lazy', () => {
    const fn = vi.fn();
    const tapped = tap(fn)([1, 2, 3]);

    expect(fn).not.toHaveBeenCalled();

    collect(take(2)(tapped));

    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('should be reusable across multiple iterations', () => {
    const calls: number[] = [];
    const tapped = tap((x: number) => calls.push(x))([1, 2]);

    collect(tapped);
    collect(tapped);

    expect(calls).toEqual([1, 2, 1, 2]);
  });
});
