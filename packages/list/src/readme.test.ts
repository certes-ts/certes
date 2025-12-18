import { describe, expect, it } from 'vitest';
import {
  concat,
  every,
  filter,
  find,
  findIndex,
  findLast,
  findLastIndex,
  flatMap,
  flatten,
  includes,
  indexOf,
  map,
  push,
  reduce,
  reduceRight,
  reverse,
  shift,
  slice,
  some,
  unshift,
} from '.';

describe('@certes/list - README Examples', () => {
  describe('Usage Section', () => {
    it('should double numbers with map', () => {
      const nums = [1, 2, 3, 4, 5];
      const doubled = map((x: number) => x * 2)(nums);

      expect(doubled).toStrictEqual([2, 4, 6, 8, 10]);
    });

    it('should filter even numbers with partial application', () => {
      const nums = [1, 2, 3, 4, 5];
      const filterEven = filter((x: number) => !(x & 1));
      const evens = filterEven(nums);

      expect(evens).toStrictEqual([2, 4]);
    });

    it('should compose filter and reduce for sum of evens', () => {
      const nums = [1, 2, 3, 4, 5];
      const filterEven = filter((x: number) => !(x & 1));
      const sum = reduce((acc: number, x: number) => acc + x)(0);
      const sumOfEvens = (arr: number[]) => sum(filterEven(arr));

      expect(sumOfEvens(nums)).toEqual(6);
    });
  });

  describe('Transformation', () => {
    describe('map', () => {
      it('should square numbers', () => {
        const square = (x: number) => x * x;
        const result = map(square)([1, 2, 3]);

        expect(result).toStrictEqual([1, 4, 9]);
      });
    });

    describe('filter', () => {
      it('should filter positive numbers', () => {
        const isPositive = (x: number) => x > 0;
        const result = filter(isPositive)([-1, 0, 1, 2]);

        expect(result).toStrictEqual([1, 2]);
      });
    });

    describe('flatMap', () => {
      it('should duplicate and flatten', () => {
        const duplicate = (x: number) => [x, x];
        const result = flatMap(duplicate)([1, 2, 3]);

        expect(result).toStrictEqual([1, 1, 2, 2, 3, 3]);
      });
    });

    describe('flatten', () => {
      it('should flatten nested array by one level', () => {
        const result = flatten([[1, 2], [3, 4], [5]]);

        expect(result).toStrictEqual([1, 2, 3, 4, 5]);
      });
    });

    describe('reverse', () => {
      it('should reverse array order', () => {
        const result = reverse([1, 2, 3, 4]);

        expect(result).toStrictEqual([4, 3, 2, 1]);
      });
    });
  });

  describe('Reduction', () => {
    describe('reduce', () => {
      it('should multiply numbers left-to-right', () => {
        const multiply = (acc: number, x: number) => acc * x;
        const result = reduce(multiply)(1)([2, 3, 4]);

        expect(result).toEqual(24);
      });
    });

    describe('reduceRight', () => {
      it('should concatenate strings right-to-left', () => {
        const concat = (acc: string, x: string) => `${acc}${x}`;
        const result = reduceRight(concat)('')(['a', 'b', 'c']);

        expect(result).toEqual('cba');
      });
    });
  });

  describe('Searching', () => {
    describe('find', () => {
      it('should return first element matching predicate', () => {
        const result = find((x: number) => x > 3)([1, 2, 3, 4, 5]);

        expect(result).toEqual(4);
      });
    });

    describe('findIndex', () => {
      it('should return index of first match', () => {
        const result = findIndex((x: number) => x > 3)([1, 2, 3, 4, 5]);

        expect(result).toEqual(3);
      });
    });

    describe('findLast', () => {
      it('should return last even number', () => {
        const result = findLast((x: number) => !(x & 1))([1, 2, 3, 4, 5]);

        expect(result).toEqual(4);
      });
    });

    describe('findLastIndex', () => {
      it('should return index of last even number', () => {
        const result = findLastIndex((x: number) => !(x & 1))([1, 2, 3, 4, 5]);

        expect(result).toEqual(3);
      });
    });

    describe('includes', () => {
      it('should determine if array contains element', () => {
        const result = includes(3)([1, 2, 3, 4, 5]);

        expect(result).toEqual(true);
      });
    });

    describe('indexOf', () => {
      it('should return first index of element', () => {
        const result = indexOf(3)([1, 2, 3, 4, 5]);

        expect(result).toEqual(2);
      });
    });
  });

  describe('Testing', () => {
    describe('every', () => {
      it('should test if all elements are positive', () => {
        const result = every((x: number) => x > 0)([1, 2, 3]);

        expect(result).toEqual(true);
      });
    });

    describe('some', () => {
      it('should test if any element is greater than 3', () => {
        const result = some((x: number) => x > 3)([1, 2, 3, 4, 5]);

        expect(result).toEqual(true);
      });
    });
  });

  describe('Construction', () => {
    describe('concat', () => {
      it('should concatenate two arrays', () => {
        const result = concat([1, 2])([3, 4]);

        expect(result).toStrictEqual([1, 2, 3, 4]);
      });
    });

    describe('push', () => {
      it('should append element to array', () => {
        const result = push([1, 2, 3])(4);

        expect(result).toStrictEqual([1, 2, 3, 4]);
      });
    });

    describe('unshift', () => {
      it('should prepend element to array', () => {
        const result = unshift([2, 3, 4])(1);

        expect(result).toStrictEqual([1, 2, 3, 4]);
      });
    });

    describe('slice', () => {
      it('should return slice from start to end', () => {
        const result = slice(1)(3)([0, 1, 2, 3, 4]);

        expect(result).toStrictEqual([1, 2]);
      });
    });

    describe('shift', () => {
      it('should return head and tail for non-empty array', () => {
        const result = shift([1, 2, 3, 4]);

        expect(result).toStrictEqual([1, [2, 3, 4]]);
      });

      it('should return null and empty array for empty array', () => {
        const result = shift([]);

        expect(result).toStrictEqual([null, []]);
      });
    });
  });

  describe('Design Principles - Currying', () => {
    it('should enable reusable predicates', () => {
      const isPositive = (x: number) => x > 0;
      const filterPositive = filter(isPositive);

      const result1 = filterPositive([-1, 0, 1, 2]);
      const result2 = filterPositive([-5, -3, 5, 10]);

      expect(result1).toStrictEqual([1, 2]);
      expect(result2).toStrictEqual([5, 10]);
    });

    it('should compose filter and reduce operations', () => {
      const isPositive = (x: number) => x > 0;
      const filterPositive = filter(isPositive);

      const sumPositive = (arr: number[]) =>
        reduce((a: number, b: number) => a + b)(0)(filterPositive(arr));

      expect(sumPositive([-1, 2, -3, 4, 5])).toEqual(11);
    });

    it('should enable pipeline-style composition', () => {
      const isPositive = (x: number) => x > 0;
      const filterPositive = filter(isPositive);

      const processNumbers = (arr: number[]) => {
        const positives = filterPositive(arr);
        const doubled = map((x: number) => x * 2)(positives);
        return every((x: number) => x < 100)(doubled);
      };

      expect(processNumbers([1, 2, 3, 4, 5])).toEqual(true);
      expect(processNumbers([1, 2, 50, 60])).toEqual(false);
    });
  });

  describe('Design Principles - Purity', () => {
    it('should not mutate original array', () => {
      const original = [1, 2, 3];
      const reversed = reverse(original);

      expect(original).toStrictEqual([1, 2, 3]); // unchanged
      expect(reversed).toStrictEqual([3, 2, 1]);
    });
  });
});
