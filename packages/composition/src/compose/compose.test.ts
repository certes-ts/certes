import { describe, expect, test } from 'vitest';
import { compose } from '.';

const identity = <T>(x: T): T => x;
const binaryAdd = (a: number, b: number): number => a + b;
const add3 = (x: number): number => x + 3;
const upperMap = (x: string[]): string[] => x.map((s) => s.toUpperCase());
const splitIt = (s: string): string[] => s.split('');
const multiply2 = (x: number): number => x * 2;
const subtract1 = (x: number): number => x - 1;
const stringify = (x: number): string => x.toString();
const uppercase = (x: string): string => x.toUpperCase();
const stringifyNum = (x: number) =>
  [
    'zero',
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine',
  ][x] ?? x.toString();

describe('Compose - Basic Functionality', () => {
  test('it should support unary for first fn call and return the correct result', () => {
    const strNumValue = compose(uppercase, stringifyNum, add3);
    const explodeStrNumVal = compose(upperMap, splitIt, stringifyNum, add3);

    const actualOne = strNumValue(4);
    const actualTwo = explodeStrNumVal(4);

    expect(actualOne).toBe('SEVEN');
    expect(actualTwo).toStrictEqual(['S', 'E', 'V', 'E', 'N']);
  });

  test('it should support n-ary for first fn call and return the correct result', () => {
    const strNumValue = compose(uppercase, stringifyNum, binaryAdd);
    const explodeStrNumVal = compose(
      upperMap,
      splitIt,
      stringifyNum,
      binaryAdd,
    );

    const actualOne = strNumValue(3, 4);
    const actualTwo = explodeStrNumVal(3, 4);

    expect(actualOne).toBe('SEVEN');
    expect(actualTwo).toStrictEqual(['S', 'E', 'V', 'E', 'N']);
  });
});

describe('Composition with n-ary Functions', () => {
  test('compose(f, g, h) where h is binary', () => {
    const f = add3;
    const g = multiply2;
    const h = (a: number, b: number): number => a + b;

    const composed = compose(f, g, h);

    // h(5, 3) = 8, g(8) = 16, f(16) = 19
    expect(composed(5, 3)).toBe(19);
    expect(composed(5, 3)).toBe(f(g(h(5, 3))));
  });

  test('compose with ternary rightmost function', () => {
    const f = stringify;
    const g = multiply2;
    const h = (a: number, b: number, c: number): number => a + b + c;

    const composed = compose(f, g, h);

    // h(2, 3, 4) = 9, g(9) = 18, f(18) = '18'
    expect(composed(2, 3, 4)).toBe('18');
    expect(composed(2, 3, 4)).toBe(f(g(h(2, 3, 4))));
  });
});

/**
 * Axiom: (f ∘ g) ∘ h = f ∘ (g ∘ h)
 *
 * In category theory, composition must be associative.
 * This means the grouping of compositions doesn't matter.
 */
describe('Associativity Law', () => {
  test('compose(f, compose(g, h)) ≡ compose(compose(f, g), h)', () => {
    const f = add3;
    const g = multiply2;
    const h = subtract1;

    // Create intermediate compositions with explicit types
    // in order to shut TS up.
    const gh: (x: number) => number = compose(g, h);
    const fg: (x: number) => number = compose(f, g);

    // Left association: f ∘ (g ∘ h)
    const left = compose(f, gh);

    // Right association: (f ∘ g) ∘ h
    const right = compose(fg, h);

    // Direct composition
    const direct = compose(f, g, h);

    const testValue = 10;
    const expected = f(g(h(testValue))); // 21

    expect(left(testValue)).toBe(expected);
    expect(right(testValue)).toBe(expected);
    expect(direct(testValue)).toBe(expected);
    expect(left(testValue)).toBe(right(testValue));
  });

  test('associativity holds for multiple test values', () => {
    const f = add3;
    const g = multiply2;
    const h = subtract1;

    // Create intermediate compositions with explicit types
    // in order to shut TS up.
    const gh: (x: number) => number = compose(g, h);
    const fg: (x: number) => number = compose(f, g);

    const left = compose(f, gh);
    const right = compose(fg, h);

    const testValues = [-10, -1, 0, 1, 5, 100, 1000];

    for (const value of testValues) {
      expect(left(value)).toBe(right(value));
      expect(left(value)).toBe(f(g(h(value))));
    }
  });

  test('associativity holds for type-changing compositions', () => {
    const f = uppercase;
    const g = stringify;
    const h = multiply2;

    // Create intermediate compositions with explicit types
    // in order to shut TS up.
    const gh: (x: number) => string = compose(g, h);
    const fg: (x: number) => string = compose(f, g);

    const left = compose(f, gh);
    const right = compose(fg, h);
    const direct = compose(f, g, h);

    const expected = f(g(h(5))); // '10'

    expect(left(5)).toBe(expected);
    expect(right(5)).toBe(expected);
    expect(direct(5)).toBe(expected);
    expect(left(5)).toBe(right(5));
  });

  test('associativity holds for longer composition chains', () => {
    const f1 = add3;
    const f2 = multiply2;
    const f3 = subtract1;
    const f4 = add3;

    // Different manual groupings
    const f3f4: (x: number) => number = compose(f3, f4);
    const f2f3f4: (x: number) => number = compose(f2, f3f4);
    const group1 = compose(f1, f2f3f4);

    const f1f2: (x: number) => number = compose(f1, f2);
    const group2 = compose(f1f2, f3, f4);

    const direct = compose(f1, f2, f3, f4);

    const testValue = 5;
    const expected = f1(f2(f3(f4(testValue))));

    expect(group1(testValue)).toBe(expected);
    expect(group2(testValue)).toBe(expected);
    expect(direct(testValue)).toBe(expected);
  });
});

/**
 * Axiom: id ∘ f = f = f ∘ id
 *
 * The identity function must be both a left and right identity
 * for composition. Composing with identity doesn't change behavior.
 */
describe('Identity Laws', () => {
  test('Left Identity: compose(id, f) ≡ f', () => {
    const f = add3;

    const composedWithId = compose(identity, f);

    const testValue = 10;
    expect(composedWithId(testValue)).toBe(f(testValue));
    expect(composedWithId(testValue)).toBe(13);
  });

  test('Right Identity: compose(f, id) ≡ f', () => {
    const f = add3;

    const composedWithId = compose(f, identity);

    const testValue = 10;
    expect(composedWithId(testValue)).toBe(f(testValue));
    expect(composedWithId(testValue)).toBe(13);
  });

  test('Both identities: compose(id, f, id) ≡ f', () => {
    const f = multiply2;

    const composed = compose(identity, f, identity);

    const testValue = 7;
    expect(composed(testValue)).toBe(f(testValue));
    expect(composed(testValue)).toBe(14);
  });

  test('identity laws hold for type-changing functions', () => {
    const f = stringify;

    const leftId = compose(identity, f);
    const rightId = compose(f, identity);

    const testValue = 42;
    expect(leftId(testValue)).toBe(f(testValue));
    expect(rightId(testValue)).toBe(f(testValue));
    expect(leftId(testValue)).toBe('42');
  });

  test('compose(id) ≡ id', () => {
    const composedId = compose(identity);

    const testValue = 42;
    expect(composedId(testValue)).toBe(identity(testValue));
    expect(composedId(testValue)).toBe(42);
  });
});

/**
 * Property: compose(f, g, h)(x) ≡ f(g(h(x)))
 *
 * Verifies that compose actually performs right-to-left composition.
 */
describe('Composition Equivalence', () => {
  test('compose(f, g, h)(x) ≡ f(g(h(x)))', () => {
    const f = add3;
    const g = multiply2;
    const h = subtract1;

    const composed = compose(f, g, h);

    const testValue = 10;
    const manualComposition = f(g(h(testValue)));

    expect(composed(testValue)).toBe(manualComposition);
    // h(10) = 9, g(9) = 18, f(18) = 21
    expect(composed(testValue)).toBe(21);
  });

  test('compose preserves computation order', () => {
    const f = uppercase;
    const g = stringify;
    const h = multiply2;

    const composed = compose(f, g, h);

    const testValue = 5;
    // h(5) = 10, g(10) = '10', f('10') = '10'
    expect(composed(testValue)).toBe(
      uppercase(stringify(multiply2(testValue))),
    );
    expect(composed(testValue)).toBe('10');
  });
});
