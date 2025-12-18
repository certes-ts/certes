import { beforeEach, describe, expect, it } from 'vitest';
import { once } from '.';

let globalVal = 10;

describe('once', () => {
  beforeEach(() => {
    globalVal = 10;
  });

  it('should call the given function only once', () => {
    const addGlobal = (n: number) => {
      globalVal = globalVal + n;
    };

    const onceAdd = once(addGlobal);

    expect(globalVal).toEqual(10);
    onceAdd(5);
    expect(globalVal).toEqual(15);
    onceAdd(5);
    expect(globalVal).toEqual(15);
    onceAdd(5);
    expect(globalVal).toEqual(15);
  });

  it('should preserve return value on first call', () => {
    const multiply = (a: number, b: number) => a * b;
    const onceMultiply = once(multiply);

    expect(onceMultiply(3, 4)).toEqual(12);
    expect(onceMultiply(5, 6)).toEqual(12);
  });

  it('should ignore subsequent calls with different arguments', () => {
    const collect: number[] = [];
    const collector = (n: number) => collect.push(n);
    const onceCollect = once(collector);

    onceCollect(1);
    onceCollect(2);
    onceCollect(3);

    expect(collect).toStrictEqual([1]);
  });

  it('should work with functions that take no arguments', () => {
    let count = 0;
    const increment = () => ++count;
    const onceIncrement = once(increment);

    expect(onceIncrement()).toEqual(1);
    expect(onceIncrement()).toEqual(1);
    expect(count).toEqual(1);
  });
});
