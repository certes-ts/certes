import { describe, expect, it } from 'vitest';
import {
  B,
  compose,
  constant,
  duplication,
  flip,
  fork,
  I,
  identity,
  K,
  KI,
  on,
  Phi,
  pair,
  pipe,
  Q,
  S,
  second,
  substitution,
  V,
  W,
} from '.';

describe('@certes/combinator - README Examples', () => {
  describe('Quick Start', () => {
    it('should compose functions right-to-left', () => {
      const addThenDouble = compose((x: number) => x * 2)((x: number) => x + 3);

      expect(addThenDouble(5)).toBe(16); // (5 + 3) * 2
    });

    it('should pipe functions left-to-right', () => {
      const doubleThenAdd = pipe((x: number) => x * 2)((x: number) => x + 3);

      expect(doubleThenAdd(5)).toBe(13); // (5 * 2) + 3
    });

    it('should calculate average using fork', () => {
      const average = fork((sum: number) => (length: number) => sum / length)(
        (nums: number[]) => nums.reduce((a, b) => a + b, 0),
      )((nums: number[]) => nums.length);

      expect(average([1, 2, 3, 4, 5])).toBe(3);
    });
  });

  describe('Practical Examples', () => {
    describe('Data Transformation Pipelines', () => {
      it('should transform user data through pipeline', () => {
        const processUser = pipe((user: { name: string }) => user.name)(
          (name: string) => name.toUpperCase(),
        );

        expect(processUser({ name: 'alice' })).toBe('ALICE');
      });
    });

    describe('Partial Application with Flip', () => {
      it('should flip division arguments', () => {
        const divide = (a: number) => (b: number) => a / b;
        const divideBy10 = flip(divide)(10);

        expect(divideBy10(100)).toBe(10); // 100 / 10
        expect(divideBy10(50)).toBe(5); // 50 / 10
      });
    });

    describe('Duplicate and Apply', () => {
      it('should square numbers using duplication', () => {
        const multiply = (a: number) => (b: number) => a * b;
        const square = duplication(multiply);

        expect(square(7)).toBe(49); // 7 * 7
        expect(square(12)).toBe(144); // 12 * 12
      });
    });

    describe('Fork Pattern', () => {
      it('should calculate variance', () => {
        const variance = fork(
          (sumSq: number) => (sum: number) => sumSq - sum * sum,
        )(
          (nums: number[]) =>
            nums.reduce((acc, x) => acc + x * x, 0) / nums.length,
        )(
          (nums: number[]) => nums.reduce((acc, x) => acc + x, 0) / nums.length,
        );

        expect(variance([1, 2, 3, 4, 5])).toBe(2);
      });
    });

    describe('On Combinator (Psi)', () => {
      it('should compare strings by length', () => {
        const compareByLength = on((a: number) => (b: number) => a - b)(
          (s: string) => s.length,
        );

        expect(compareByLength('hello')('world')).toBe(0); // same length
        expect(compareByLength('hi')('world')).toBe(-3); // 2 - 5
      });
    });

    describe('Substitution Pattern', () => {
      it('should add argument with its doubled version', () => {
        const addWithDouble = substitution((a: number) => (b: number) => a + b)(
          (x: number) => x * 2,
        );

        expect(addWithDouble(5)).toBe(15); // 5 + 10
      });
    });
  });

  describe('Compose vs Pipe', () => {
    const double = (x: number) => x * 2;
    const addThree = (x: number) => x + 3;

    it('should compose right-to-left', () => {
      const result = compose(addThree)(double)(5);
      expect(result).toBe(13); // addThree(double(5))
    });

    it('should pipe left-to-right', () => {
      const result = pipe(double)(addThree)(5);
      expect(result).toBe(13); // double(5) then addThree
    });
  });

  describe('Combinator Identities', () => {
    describe('Identity laws', () => {
      it('I(x) ≡ x', () => {
        expect(I(42)).toBe(42);
        expect(identity('test')).toBe('test');
      });

      it('K(x)(y) ≡ x', () => {
        expect(K(5)(10)).toBe(5);
        expect(constant('first')('second')).toBe('first');
      });

      it('KI(x)(y) ≡ y', () => {
        expect(KI(5)(10)).toBe(10);
        expect(second('first')('second')).toBe('second');
      });
    });

    describe('Composition', () => {
      it('B(f)(g)(x) ≡ f(g(x))', () => {
        const f = (x: number) => x * 2;
        const g = (x: number) => x + 3;
        const x = 5;

        expect(B(f)(g)(x)).toBe(f(g(x)));
        expect(compose(f)(g)(x)).toBe(f(g(x)));
      });

      it('Q(f)(g)(x) ≡ g(f(x))', () => {
        const f = (x: number) => x * 2;
        const g = (x: number) => x + 3;
        const x = 5;

        expect(Q(f)(g)(x)).toBe(g(f(x)));
        expect(pipe(f)(g)(x)).toBe(g(f(x)));
      });
    });

    describe('Self-application', () => {
      it('W(f)(x) ≡ f(x)(x)', () => {
        const f = (a: number) => (b: number) => a + b;
        const x = 7;

        expect(W(f)(x)).toBe(f(x)(x));
        expect(duplication(f)(x)).toBe(14);
      });

      it('V(x)(y)(f) ≡ f(x)(y)', () => {
        const x = 10;
        const y = 5;
        const f = (a: number) => (b: number) => a - b;

        expect(V(x)(y)(f)).toBe(f(x)(y));
        expect(pair(x)(y)(f)).toBe(5);
      });
    });

    describe('Distributive', () => {
      it('S(f)(g)(x) ≡ f(x)(g(x))', () => {
        const f = (a: number) => (b: number) => a + b;
        const g = (x: number) => x * 2;
        const x = 5;

        expect(S(f)(g)(x)).toBe(f(x)(g(x)));
        expect(substitution(f)(g)(x)).toBe(15); // 5 + 10
      });

      it('Phi(f)(g)(h)(x) ≡ f(g(x))(h(x))', () => {
        const f = (a: number) => (b: number) => a + b;
        const g = (x: number) => x * 2;
        const h = (x: number) => x + 3;
        const x = 5;

        expect(Phi(f)(g)(h)(x)).toBe(f(g(x))(h(x)));
        expect(fork(f)(g)(h)(x)).toBe(18); // 10 + 8
      });
    });
  });
});
