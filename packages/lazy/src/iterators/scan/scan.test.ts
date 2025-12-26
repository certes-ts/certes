import { describe, expect, it } from 'vitest';
import { collect } from '../../helpers/collect';
import { scan } from '.';

describe('Scan', () => {
  it('should yield intermediate accumulator values', () => {
    const result = collect(
      scan((acc: number, x: number) => acc + x, 0)([1, 2, 3, 4]),
    );

    expect(result).toEqual([1, 3, 6, 10]);
  });

  it('should pass the index as the third argument', () => {
    const result = collect(
      scan(
        (acc: string, x: number, idx: number) => `${acc}${idx}:${x},`,
        '',
      )([10, 20, 30]),
    );

    expect(result).toEqual(['0:10,', '0:10,1:20,', '0:10,1:20,2:30,']);
  });

  it('should return an empty iterable for empty input', () => {
    const result = collect(scan((acc: number, x: number) => acc + x, 0)([]));

    expect(result).toEqual([]);
  });

  it('should be reusable across multiple iterations', () => {
    const scanned = scan((acc: number, x: number) => acc + x, 0)([1, 2, 3]);

    expect(collect(scanned)).toEqual([1, 3, 6]);
    expect(collect(scanned)).toEqual([1, 3, 6]);
  });

  it('should yield single accumulated value for single element input', () => {
    const result = collect(scan((acc: number, x: number) => acc + x, 0)([5]));

    expect(result).toEqual([5]);
  });
});
