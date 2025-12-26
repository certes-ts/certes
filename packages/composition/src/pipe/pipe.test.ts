import { describe, expect, it } from 'vitest';
import { pipe } from '.';

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

describe('Basic Functionality', () => {
  it('should support unary for first fn call and return the correct result', () => {
    const explodedStrNumVal = pipe(add3, stringifyNum, uppercase, splitIt);
    const upperStrNumVal = pipe(
      add3,
      stringifyNum,
      splitIt,
      upperMap,
      (a: string[]) => a.join(''),
    );

    const actualOne = explodedStrNumVal(3);
    const actualTwo = upperStrNumVal(3);

    expect(actualOne).toStrictEqual(['S', 'I', 'X']);
    expect(actualTwo).toBe('SIX');
  });

  it('should support n-ary for first fn call and return the correct result', () => {
    const explodedStrNumVal = pipe(binaryAdd, stringifyNum, uppercase, splitIt);
    const upperStrNumVal = pipe(
      binaryAdd,
      stringifyNum,
      splitIt,
      upperMap,
      (a: string[]) => a.join(''),
    );

    const actualOne = explodedStrNumVal(3, 3);
    const actualTwo = upperStrNumVal(3, 3);

    expect(actualOne).toStrictEqual(['S', 'I', 'X']);
    expect(actualTwo).toBe('SIX');
  });
});

describe('Pipe with n-ary Functions', () => {
  it('should pipe(f, g, h) where f is binary', () => {
    const f = (a: number, b: number): number => a + b;
    const g = multiply2;
    const h = add3;

    const piped = pipe(f, g, h);

    // f(5, 3) = 8, g(8) = 16, h(16) = 19
    expect(piped(5, 3)).toBe(19);
    expect(piped(5, 3)).toBe(h(g(f(5, 3))));
  });

  it('should pipe with a ternary leftmost function', () => {
    const f = (a: number, b: number, c: number): number => a + b + c;
    const g = multiply2;
    const h = stringify;

    const piped = pipe(f, g, h);

    // f(2, 3, 4) = 9, g(9) = 18, h(18) = '18'
    expect(piped(2, 3, 4)).toBe('18');
    expect(piped(2, 3, 4)).toBe(h(g(f(2, 3, 4))));
  });
});

/**
 * Axiom: (h | g) | f = h | (g | f)
 * Where | represents pipe
 *
 * Pipe must also be associative, just with left-to-right ordering.
 */
describe('Associativity Law', () => {
  it('pipe(pipe(f, g), h) ≡ pipe(f, pipe(g, h))', () => {
    const f = add3;
    const g = multiply2;
    const h = subtract1;

    // Left association: (f | g) | h
    const left = pipe(pipe(f, g), h);

    // Right association: f | (g | h)
    const right = pipe(f, pipe(g, h));

    // Direct pipe
    const direct = pipe(f, g, h);

    const testValue = 10;
    const expected = h(g(f(testValue))); // 25

    expect(left(testValue)).toBe(expected);
    expect(right(testValue)).toBe(expected);
    expect(direct(testValue)).toBe(expected);
    expect(left(testValue)).toBe(right(testValue));
  });

  it('associativity holds for multiple test values', () => {
    const f = add3;
    const g = multiply2;
    const h = subtract1;

    const left = pipe(pipe(f, g), h);
    const right = pipe(f, pipe(g, h));

    const testValues = [-10, -1, 0, 1, 5, 100, 1000];

    for (const value of testValues) {
      expect(left(value)).toBe(right(value));
      expect(left(value)).toBe(h(g(f(value))));
    }
  });

  it('associativity holds for type-changing pipes', () => {
    const f = multiply2;
    const g = stringify;
    const h = uppercase;

    const left = pipe(pipe(f, g), h);
    const right = pipe(f, pipe(g, h));
    const direct = pipe(f, g, h);

    const expected = h(g(f(5))); // '10'

    expect(left(5)).toBe(expected);
    expect(right(5)).toBe(expected);
    expect(direct(5)).toBe(expected);
    expect(left(5)).toBe(right(5));
  });

  it('associativity holds for longer pipe chains', () => {
    const f1 = add3;
    const f2 = multiply2;
    const f3 = subtract1;
    const f4 = add3;

    // Different groupings should produce same result
    const group1 = pipe(f1, pipe(f2, pipe(f3, f4)));
    const group2 = pipe(pipe(f1, f2), pipe(f3, f4));
    const direct = pipe(f1, f2, f3, f4);

    const testValue = 5;
    const expected = f4(f3(f2(f1(testValue))));

    expect(group1(testValue)).toBe(expected);
    expect(group2(testValue)).toBe(expected);
    expect(direct(testValue)).toBe(expected);
  });
});

/**
 * Axiom: id | f = f = f | id
 *
 * Identity must be both left and right identity for pipe.
 */
describe('Identity Laws', () => {
  it('left identity: pipe(id, f) ≡ f', () => {
    const f = add3;

    const pipedWithId = pipe(identity, f);

    const testValue = 10;
    expect(pipedWithId(testValue)).toBe(f(testValue));
    expect(pipedWithId(testValue)).toBe(13);
  });

  it('right identity: pipe(f, id) ≡ f', () => {
    const f = add3;

    const pipedWithId = pipe(f, identity);

    const testValue = 10;
    expect(pipedWithId(testValue)).toBe(f(testValue));
    expect(pipedWithId(testValue)).toBe(13);
  });

  it('Both identities: pipe(id, f, id) ≡ f', () => {
    const f = multiply2;

    const piped = pipe(identity, f, identity);

    const testValue = 7;
    expect(piped(testValue)).toBe(f(testValue));
    expect(piped(testValue)).toBe(14);
  });

  it('identity laws hold for type-changing functions', () => {
    const f = stringify;

    const leftId = pipe(identity, f);
    const rightId = pipe(f, identity);

    const testValue = 42;
    expect(leftId(testValue)).toBe(f(testValue));
    expect(rightId(testValue)).toBe(f(testValue));
    expect(leftId(testValue)).toBe('42');
  });

  it('pipe(id) ≡ id', () => {
    const pipedId = pipe(identity);

    const testValue = 42;
    expect(pipedId(testValue)).toBe(identity(testValue));
    expect(pipedId(testValue)).toBe(42);
  });
});

/**
 * Property: pipe(f, g, h)(x) ≡ h(g(f(x)))
 *
 * Verifies that pipe actually performs left-to-right composition.
 */
describe('Pipe Equivalence', () => {
  it('pipe(f, g, h)(x) ≡ h(g(f(x)))', () => {
    const f = subtract1;
    const g = multiply2;
    const h = add3;

    const piped = pipe(f, g, h);

    const testValue = 10;
    const manualPipe = h(g(f(testValue)));

    expect(piped(testValue)).toBe(manualPipe);
    // f(10) = 9, g(9) = 18, h(18) = 21
    expect(piped(testValue)).toBe(21);
  });

  it('pipe preserves computation order', () => {
    const f = multiply2;
    const g = stringify;
    const h = uppercase;

    const piped = pipe(f, g, h);

    const testValue = 5;
    // f(5) = 10, g(10) = '10', h('10') = '10'
    expect(piped(testValue)).toBe(uppercase(stringify(multiply2(testValue))));
    expect(piped(testValue)).toBe('10');
  });
});
