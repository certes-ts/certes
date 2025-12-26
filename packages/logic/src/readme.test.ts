import { describe, expect, it } from 'vitest';
import {
  and,
  andFn,
  equality,
  equalityFn,
  nand,
  nor,
  not,
  notFn,
  nullishOr,
  or,
  orFn,
  swappedNullishOr,
  swappedOr,
  xor,
  xorFn,
} from '.';

// import { filter } from '@certes/list';
type Predicate<T> = (x: T, idx?: number) => boolean;
const filter =
  <T>(predicate: Predicate<T>) =>
  (arr: T[]): T[] => {
    const len = arr.length;
    const res: T[] = [];

    for (let i = 0; i < len; i++) {
      if (predicate(arr[i] as T, i)) {
        res.push(arr[i] as T);
      }
    }

    return res;
  };

describe('README Examples', () => {
  describe('Quick Start', () => {
    it('should perform basic Boolean operations', () => {
      expect(and(true)(false)).toBe(false);
      expect(or(true)(false)).toBe(true);
      expect(not(true)).toBe(false);
      expect(xor(true)(false)).toBe(true);
    });

    it('should handle type coercion', () => {
      expect(and(1)(0)).toBe(false);
      expect(or(0)('hello')).toBe(true);
    });
  });

  describe('Value-Level Operations', () => {
    describe('and', () => {
      it('should perform logical AND', () => {
        expect(and(true)(true)).toBe(true);
        expect(and(true)(false)).toBe(false);
        expect(and(1)(0)).toBe(false); // type coercion
      });
    });

    describe('or', () => {
      it('should perform logical OR', () => {
        expect(or(false)(true)).toBe(true);
        expect(or(0)(0)).toBe(false);
      });
    });

    describe('not', () => {
      it('should perform logical NOT', () => {
        expect(not(true)).toBe(false);
        expect(not(0)).toBe(true);
      });
    });

    describe('nand', () => {
      it('should perform NAND operation', () => {
        expect(nand(true)(true)).toBe(false);
        expect(nand(true)(false)).toBe(true);
      });
    });

    describe('nor', () => {
      it('should perform NOR operation', () => {
        expect(nor(false)(false)).toBe(true);
        expect(nor(true)(false)).toBe(false);
      });
    });

    describe('xor', () => {
      it('should perform XOR operation', () => {
        expect(xor(true)(false)).toBe(true);
        expect(xor(true)(true)).toBe(false);
      });
    });

    describe('equality', () => {
      it('should perform strict equality check', () => {
        expect(equality(4)(4)).toBe(true);
        expect(equality(4)('4')).toBe(false);
      });
    });
  });

  describe('Function-Level Operations', () => {
    const isEven = (x: number) => x % 2 === 0;
    const isPositive = (x: number) => x > 0;
    const isLarge = (x: number) => x > 100;

    describe('andFn', () => {
      it('should combine predicates with AND', () => {
        const isPositiveEven = andFn(isPositive)(isEven);

        expect(isPositiveEven(4)).toBe(true);
        expect(isPositiveEven(-4)).toBe(false);
      });
    });

    describe('orFn', () => {
      it('should combine predicates with OR', () => {
        const isEvenOrLarge = orFn(isEven)(isLarge);

        expect(isEvenOrLarge(3)).toBe(false);
        expect(isEvenOrLarge(101)).toBe(true);
      });
    });

    describe('notFn', () => {
      it('should negate a predicate', () => {
        const isOdd = notFn(isEven);

        expect(isOdd(3)).toBe(true);
        expect(isOdd(4)).toBe(false);
      });
    });

    describe('xorFn', () => {
      it('should perform exclusive OR between predicates', () => {
        const hasExactlyOneProperty = xorFn(isEven)(isLarge);

        expect(hasExactlyOneProperty(4)).toBe(true); // even but not large
        expect(hasExactlyOneProperty(101)).toBe(true); // large but not even
        expect(hasExactlyOneProperty(102)).toBe(false); // both
      });
    });

    describe('equalityFn', () => {
      it('should compare function results', () => {
        const sameModulo = equalityFn((x: number) => x % 3)(
          (x: number) => x % 2,
        );

        expect(sameModulo(6)).toBe(true); // both return 0
      });
    });
  });

  describe('Nullish Coalescing', () => {
    describe('nullishOr', () => {
      it('should handle standard nullish coalescing', () => {
        expect(nullishOr(null)(42)).toBe(42);
        expect(nullishOr(0)(100)).toBe(0); // preserves falsy
        expect(nullishOr(false)(true)).toBe(false); // preserves falsy
        expect(nullishOr('')('fallback')).toBe(''); // preserves falsy
      });
    });

    describe('swappedNullishOr', () => {
      it('should support swapped argument order', () => {
        const withDefault = swappedNullishOr(42);

        expect(withDefault(null)).toBe(42);
        expect(withDefault(7)).toBe(7);
      });

      it('should work with map for default values', () => {
        const values: (number | null)[] = [1, null, 3, null, 5];
        const result = values.map(swappedNullishOr(0));

        expect(result).toEqual([1, 0, 3, 0, 5]);
      });
    });
  });

  describe('Swapped Variants', () => {
    it('should use swappedOr to create predicates with default condition', () => {
      const isActiveOrDefault = swappedOr(false);

      expect(isActiveOrDefault(true)).toBe(true);
      expect(isActiveOrDefault(false)).toBe(false);
      expect(isActiveOrDefault(null)).toBe(false);
      expect(isActiveOrDefault(1)).toBe(true);
    });

    it('should provide swapped nullish coalescing', () => {
      const fallbackValue = 100;
      const withFallback = swappedNullishOr(fallbackValue);

      expect(withFallback(null)).toBe(fallbackValue);
      expect(withFallback(50)).toBe(50);
    });
  });

  describe('Composition', () => {
    it('should build complex predicates', () => {
      const isEven = (x: number) => x % 2 === 0;
      const isPositive = (x: number) => x > 0;
      const isSmall = (x: number) => x < 10;

      const isPositiveEven = andFn(isPositive)(isEven);
      const isEvenOrSmall = orFn(isEven)(isSmall);

      const numbers = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

      expect(filter(isPositiveEven)(numbers)).toEqual([2, 4, 6, 8, 10, 12]);
      expect(filter(isEvenOrSmall)(numbers)).toEqual([
        -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12,
      ]);
    });

    it('should compose predicates in filter chains', () => {
      const isEven = (x: number) => x % 2 === 0;
      const isPositive = (x: number) => x > 0;

      const numbers = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

      const processData = (arr: number[]) => {
        const filtered1 = filter(isPositive)(arr);
        const filtered2 = filter(isEven)(filtered1);
        return filtered2.slice(0, 3);
      };

      expect(processData(numbers)).toEqual([2, 4, 6]);
    });
  });

  describe('Truth Tables', () => {
    describe('AND / NAND', () => {
      it('should verify AND truth table', () => {
        expect(and(true)(true)).toBe(true);
        expect(and(true)(false)).toBe(false);
        expect(and(false)(true)).toBe(false);
        expect(and(false)(false)).toBe(false);
      });

      it('should verify NAND truth table', () => {
        expect(nand(true)(true)).toBe(false);
        expect(nand(true)(false)).toBe(true);
        expect(nand(false)(true)).toBe(true);
        expect(nand(false)(false)).toBe(true);
      });
    });

    describe('OR / NOR', () => {
      it('should verify OR truth table', () => {
        expect(or(true)(true)).toBe(true);
        expect(or(true)(false)).toBe(true);
        expect(or(false)(true)).toBe(true);
        expect(or(false)(false)).toBe(false);
      });

      it('should verify NOR truth table', () => {
        expect(nor(true)(true)).toBe(false);
        expect(nor(true)(false)).toBe(false);
        expect(nor(false)(true)).toBe(false);
        expect(nor(false)(false)).toBe(true);
      });
    });

    describe('XOR / XNOR (Equality)', () => {
      it('should verify XOR truth table', () => {
        expect(xor(true)(true)).toBe(false);
        expect(xor(true)(false)).toBe(true);
        expect(xor(false)(true)).toBe(true);
        expect(xor(false)(false)).toBe(false);
      });

      it('should verify XNOR (equality) truth table', () => {
        expect(equality(true)(true)).toBe(true);
        expect(equality(true)(false)).toBe(false);
        expect(equality(false)(true)).toBe(false);
        expect(equality(false)(false)).toBe(true);
      });
    });
  });

  describe('Practical Examples', () => {
    describe('Validation Logic', () => {
      it('should validate user permissions', () => {
        type User = { age: number; verified: boolean; banned: boolean };

        const isAdult = (user: User) => user.age >= 18;
        const isVerified = (user: User) => user.verified;
        const isBanned = (user: User) => user.banned;

        const canPost = andFn(andFn(isAdult)(isVerified))(notFn(isBanned));

        const user = { age: 25, verified: true, banned: false };
        expect(canPost(user)).toBe(true);
      });

      it('should reject banned users', () => {
        type User = { age: number; verified: boolean; banned: boolean };

        const isAdult = (user: User) => user.age >= 18;
        const isVerified = (user: User) => user.verified;
        const isBanned = (user: User) => user.banned;

        const canPost = andFn(andFn(isAdult)(isVerified))(notFn(isBanned));

        const bannedUser = { age: 25, verified: true, banned: true };
        expect(canPost(bannedUser)).toBe(false);
      });
    });

    describe('Toggle Detection', () => {
      it('should detect state changes', () => {
        const hasStateChanged = (prev: boolean, curr: boolean) =>
          xor(prev)(curr);

        expect(hasStateChanged(true, false)).toBe(true);
        expect(hasStateChanged(true, true)).toBe(false);
      });
    });

    describe('Default Value Handling', () => {
      it('should preserve 0 with nullishOr', () => {
        type Config = { timeout?: number | null };

        const getTimeout = (config: Config) => nullishOr(config.timeout)(5000);

        expect(getTimeout({ timeout: 0 })).toBe(0); // 0 (not 5000)
        expect(getTimeout({ timeout: null })).toBe(5000);
      });
    });
  });
});
