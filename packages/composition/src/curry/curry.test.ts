import { describe, expect, it } from 'vitest';
import { curry } from '.';

describe('Curry', () => {
  describe('Arity 0 (passthrough)', () => {
    const nullary = (): number => 42;
    const curried = curry(nullary);

    it('should return the function as-is', () => {
      expect(curried()).toBe(42);
    });
  });

  describe('Arity 1 (passthrough)', () => {
    const identity = (x: number): number => x;
    const curried = curry(identity);

    it('should return the function as-is', () => {
      expect(curried(42)).toBe(42);
      expect(curried(-1)).toBe(-1);
    });
  });

  describe('Arity 2', () => {
    const add = (a: number, b: number): number => a + b;
    const curried = curry(add);

    it('should support f(a, b)', () => {
      expect(curried(1, 2)).toBe(3);
    });

    it('should support f(a)(b)', () => {
      expect(curried(1)(2)).toBe(3);
    });

    it('should support partial application reuse', () => {
      const add10 = curried(10);
      expect(add10(5)).toBe(15);
      expect(add10(20)).toBe(30);
    });
  });

  describe('Arity 3', () => {
    const add = (a: number, b: number, c: number): number => a + b + c;
    const curried = curry(add);

    it('should support f(a, b, c)', () => {
      expect(curried(1, 2, 3)).toBe(6);
    });

    it('should support f(a)(b)(c)', () => {
      expect(curried(1)(2)(3)).toBe(6);
    });

    it('should support f(a, b)(c)', () => {
      expect(curried(1, 2)(3)).toBe(6);
    });

    it('should support f(a)(b, c)', () => {
      expect(curried(1)(2, 3)).toBe(6);
    });

    it('should support partial application reuse', () => {
      const add10 = curried(10);
      expect(add10(5, 3)).toBe(18);
      expect(add10(5)(3)).toBe(18);

      const add15 = add10(5);
      expect(add15(3)).toBe(18);
      expect(add15(7)).toBe(22);
    });
  });

  describe('Arity 4', () => {
    const add = (a: number, b: number, c: number, d: number): number =>
      a + b + c + d;
    const curried = curry(add);

    it('should support f(a, b, c, d)', () => {
      expect(curried(1, 2, 3, 4)).toBe(10);
    });

    it('should support f(a)(b)(c)(d)', () => {
      expect(curried(1)(2)(3)(4)).toBe(10);
    });

    it('should support f(a, b)(c, d)', () => {
      expect(curried(1, 2)(3, 4)).toBe(10);
    });

    it('should support f(a)(b, c)(d)', () => {
      expect(curried(1)(2, 3)(4)).toBe(10);
    });

    it('should support f(a, b, c)(d)', () => {
      expect(curried(1, 2, 3)(4)).toBe(10);
    });

    it('should support f(a)(b)(c, d)', () => {
      expect(curried(1)(2)(3, 4)).toBe(10);
    });

    it('should support partial application reuse', () => {
      const add10 = curried(10);
      const add15 = add10(5);
      const add18 = add15(3);

      expect(add18(2)).toBe(20);
      expect(add15(3, 2)).toBe(20);
      expect(add10(5, 3, 2)).toBe(20);
    });
  });

  describe('Arity 5', () => {
    const add = (
      a: number,
      b: number,
      c: number,
      d: number,
      e: number,
    ): number => a + b + c + d + e;
    const curried = curry(add);

    it('should support f(a, b, c, d, e)', () => {
      expect(curried(1, 2, 3, 4, 5)).toBe(15);
    });

    it('should support f(a)(b)(c)(d)(e)', () => {
      expect(curried(1)(2)(3)(4)(5)).toBe(15);
    });

    it('should support f(a, b)(c, d)(e)', () => {
      expect(curried(1, 2)(3, 4)(5)).toBe(15);
    });

    it('should support f(a)(b, c, d, e)', () => {
      expect(curried(1)(2, 3, 4, 5)).toBe(15);
    });

    it('should support partial application reuse', () => {
      const add10 = curried(10);
      expect(add10(1)(2)(3)(4)).toBe(20);
      expect(add10(1, 2)(3, 4)).toBe(20);
      expect(add10(1, 2, 3, 4)).toBe(20);
    });
  });

  describe('Arity 6', () => {
    const add = (
      a: number,
      b: number,
      c: number,
      d: number,
      e: number,
      f: number,
    ): number => a + b + c + d + e + f;
    const curried = curry(add);

    it('should support f(a, b, c, d, e, f)', () => {
      expect(curried(1, 2, 3, 4, 5, 6)).toBe(21);
    });

    it('should support f(a)(b)(c)(d)(e)(f)', () => {
      expect(curried(1)(2)(3)(4)(5)(6)).toBe(21);
    });

    it('should support f(a, b, c)(d, e, f)', () => {
      expect(curried(1, 2, 3)(4, 5, 6)).toBe(21);
    });

    it('should support partial application reuse', () => {
      const add10 = curried(10);
      expect(add10(1)(2)(3)(4)(5)).toBe(25);
      expect(add10(1, 2, 3, 4, 5)).toBe(25);
    });
  });

  describe('Preserves `this` Context', () => {
    it('should work with methods when bound', () => {
      const obj = {
        multiplier: 10,
        multiply(a: number, b: number): number {
          return this.multiplier * a * b;
        },
      };

      const boundMultiply = obj.multiply.bind(obj);
      const curried = curry(boundMultiply);

      expect(curried(2, 3)).toBe(60);
      expect(curried(2)(3)).toBe(60);
    });
  });

  describe('Type Preservation', () => {
    it('should preserve return types', () => {
      const concat = (a: string, b: string): string => a + b;
      const curried = curry(concat);

      const result: string = curried('hello')(' world');
      expect(result).toBe('hello world');
    });

    it('should work with complex types', () => {
      type User = { name: string; age: number };

      const createUser = (name: string, age: number): User => ({ name, age });
      const curried = curry(createUser);

      const result = curried('Alice')(30);
      expect(result).toEqual({ name: 'Alice', age: 30 });
    });

    it('should work with array types', () => {
      const zip = <T, U>(a: T[], b: U[]): [T, U][] =>
        a.map((x, i) => [x, b[i]] as [T, U]);

      const curried = curry(zip<number, string>);
      const result = curried([1, 2, 3])(['a', 'b', 'c']);

      expect(result).toEqual([
        [1, 'a'],
        [2, 'b'],
        [3, 'c'],
      ]);
    });

    it('should work with null and undefined args', () => {
      const fn = (a: number | null, b: number | undefined): string =>
        `${a}-${b}`;
      const curried = curry(fn);

      expect(curried(null)(undefined)).toBe('null-undefined');
      expect(curried(null, undefined)).toBe('null-undefined');
    });
  });
});
