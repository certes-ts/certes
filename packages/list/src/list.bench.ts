import { bench, describe } from 'vitest';
import { concat } from './concat';
import { every } from './every';
import { filter } from './filter';
import { find } from './find';
import { findIndex } from './find-index';
import { findLast } from './find-last';
import { findLastIndex } from './find-last-index';
import { includes } from './includes';
import { indexOf } from './index-of';
import { map } from './map';
import { push } from './push';
import { reduce } from './reduce';
import { reduceRight } from './reduce-right';
import { reverse } from './reverse';
import { slice } from './slice';
import { some } from './some';
import { unshift } from './unshift';

// Test data generators
const createNumberArray = (size: number): number[] =>
  Array.from({ length: size }, (_, i) => i);

const createStringArray = (size: number): string[] =>
  Array.from({ length: size }, (_, i) => `item_${i}`);

// Predicates and functions
const isEven = (x: number) => !(x & 1);
const double = (x: number) => x * 2;
const sum = (a: number, b: number) => a + b;
const concatStr = (a: string, b: string) => `${a}${b}`;

// Small dataset (10 elements)
const small = createNumberArray(10);
const smallStr = createStringArray(10);

// Medium dataset (1,000 elements)
const medium = createNumberArray(1000);
const mediumStr = createStringArray(1000);

// Large dataset (100,000 elements)
const large = createNumberArray(100000);

describe('map - small dataset (10 elements)', () => {
  bench('@certes/list', () => {
    map(double)(small);
  });

  bench('native', () => {
    small.map(double);
  });
});

describe('map - medium dataset (1,000 elements)', () => {
  bench('@certes/list', () => {
    map(double)(medium);
  });

  bench('native', () => {
    medium.map(double);
  });
});

describe('map - large dataset (100,000 elements)', () => {
  bench('@certes/list', () => {
    map(double)(large);
  });

  bench('native', () => {
    large.map(double);
  });
});

describe('filter - small dataset (10 elements)', () => {
  bench('@certes/list', () => {
    filter(isEven)(small);
  });

  bench('native', () => {
    small.filter(isEven);
  });
});

describe('filter - medium dataset (1,000 elements)', () => {
  bench('@certes/list', () => {
    filter(isEven)(medium);
  });

  bench('native', () => {
    medium.filter(isEven);
  });
});

describe('filter - large dataset (100,000 elements)', () => {
  bench('@certes/list', () => {
    filter(isEven)(large);
  });

  bench('native', () => {
    large.filter(isEven);
  });
});

describe('reduce - small dataset (10 elements)', () => {
  bench('@certes/list', () => {
    reduce(sum)(0)(small);
  });

  bench('native', () => {
    small.reduce(sum, 0);
  });
});

describe('reduce - medium dataset (1,000 elements)', () => {
  bench('@certes/list', () => {
    reduce(sum)(0)(medium);
  });

  bench('native', () => {
    medium.reduce(sum, 0);
  });
});

describe('reduce - large dataset (100,000 elements)', () => {
  bench('@certes/list', () => {
    reduce(sum)(0)(large);
  });

  bench('native', () => {
    large.reduce(sum, 0);
  });
});

describe('reduceRight - small dataset (10 elements)', () => {
  bench('@certes/list', () => {
    reduceRight(concat)('')(smallStr);
  });

  bench('native', () => {
    smallStr.reduceRight(concatStr, '');
  });
});

describe('reduceRight - medium dataset (1,000 elements)', () => {
  bench('@certes/list', () => {
    reduceRight(concat)('')(mediumStr);
  });

  bench('native', () => {
    mediumStr.reduceRight(concatStr, '');
  });
});

describe('find - best case (early match)', () => {
  const arr = createNumberArray(10000);
  const findEarly = (x: number) => x === 10;

  bench('@certes/list', () => {
    find(findEarly)(arr);
  });

  bench('native', () => {
    arr.find(findEarly);
  });
});

describe('find - worst case (late match)', () => {
  const arr = createNumberArray(10000);
  const findLate = (x: number) => x === 9999;

  bench('@certes/list', () => {
    find(findLate)(arr);
  });

  bench('native', () => {
    arr.find(findLate);
  });
});

describe('find - no match', () => {
  const arr = createNumberArray(10000);
  const findNone = (x: number) => x === 99999;

  bench('@certes/list', () => {
    find(findNone)(arr);
  });

  bench('native', () => {
    arr.find(findNone);
  });
});

describe('findIndex - medium dataset (1,000 elements)', () => {
  const target = (x: number) => x === 500;

  bench('@certes/list', () => {
    findIndex(target)(medium);
  });

  bench('native', () => {
    medium.findIndex(target);
  });
});

describe('findLast - medium dataset (1,000 elements)', () => {
  const target = (x: number) => x === 500;

  bench('@certes/list', () => {
    findLast(target)(medium);
  });

  bench('native', () => {
    medium.findLast(target);
  });
});

describe('findLastIndex - medium dataset (1,000 elements)', () => {
  const target = (x: number) => x === 500;

  bench('@certes/list', () => {
    findLastIndex(target)(medium);
  });

  bench('native', () => {
    medium.findLastIndex(target);
  });
});

describe('every - all pass', () => {
  const allEven = createNumberArray(10000).map((x) => x * 2);

  bench('@certes/list', () => {
    every(isEven)(allEven);
  });

  bench('native', () => {
    allEven.every(isEven);
  });
});

describe('every - early exit', () => {
  const earlyFail = [2, 4, 6, 7, 8, 10, ...createNumberArray(10000)];

  bench('@certes/list', () => {
    every(isEven)(earlyFail);
  });

  bench('native', () => {
    earlyFail.every(isEven);
  });
});

describe('some - early match', () => {
  const earlyMatch = [1, 3, 5, 6, ...createNumberArray(10000)];

  bench('@certes/list', () => {
    some(isEven)(earlyMatch);
  });

  bench('native', () => {
    earlyMatch.some(isEven);
  });
});

describe('some - late match', () => {
  const lateMatch = [...createNumberArray(10000).map((x) => x * 2 + 1), 10];

  bench('@certes/list', () => {
    some(isEven)(lateMatch);
  });

  bench('native', () => {
    lateMatch.some(isEven);
  });
});

describe('includes - early match', () => {
  bench('@certes/list', () => {
    includes(10)(large);
  });

  bench('native', () => {
    large.includes(10);
  });
});

describe('includes - late match', () => {
  bench('@certes/list', () => {
    includes(99999)(large);
  });

  bench('native', () => {
    large.includes(99999);
  });
});

describe('indexOf - early match', () => {
  bench('@certes/list', () => {
    indexOf(10)(large);
  });

  bench('native', () => {
    large.indexOf(10);
  });
});

describe('indexOf - late match', () => {
  bench('@certes/list', () => {
    indexOf(99999)(large);
  });

  bench('native', () => {
    large.indexOf(99999);
  });
});

describe('reverse - small dataset (10 elements)', () => {
  bench('@certes/list', () => {
    reverse(small);
  });

  bench('native', () => {
    [...small].reverse();
  });
});

describe('reverse - medium dataset (1,000 elements)', () => {
  bench('@certes/list', () => {
    reverse(medium);
  });

  bench('native', () => {
    [...medium].reverse();
  });
});

describe('reverse - large dataset (100,000 elements)', () => {
  bench('@certes/list', () => {
    reverse(large);
  });

  bench('native', () => {
    [...large].reverse();
  });
});

describe('slice - small range', () => {
  bench('@certes/list', () => {
    slice(0)(10)(large);
  });

  bench('native', () => {
    large.slice(0, 10);
  });
});

describe('slice - large range', () => {
  bench('@certes/list', () => {
    slice(0)(50000)(large);
  });

  bench('native', () => {
    large.slice(0, 50000);
  });
});

describe('concat - small arrays', () => {
  const arr1 = createNumberArray(100);
  const arr2 = createNumberArray(100);

  bench('@certes/list', () => {
    concat(arr1)(arr2);
  });

  bench('native', () => {
    arr1.concat(arr2);
  });
});

describe('concat - large arrays', () => {
  const arr1 = createNumberArray(50000);
  const arr2 = createNumberArray(50000);

  bench('@certes/list', () => {
    concat(arr1)(arr2);
  });

  bench('native', () => {
    arr1.concat(arr2);
  });
});

describe('push - single element', () => {
  bench('@certes/list', () => {
    push(medium)(999);
  });

  bench('native', () => {
    [...medium, 999];
  });
});

describe('unshift - single element', () => {
  bench('@certes/list', () => {
    unshift(medium)(999);
  });

  bench('native', () => {
    [999, ...medium];
  });
});

describe('chained operations - small dataset', () => {
  bench('@certes/list', () => {
    const filtered = filter(isEven)(small);
    const mapped = map(double)(filtered);
    reduce(sum)(0)(mapped);
  });

  bench('native', () => {
    small.filter(isEven).map(double).reduce(sum, 0);
  });
});

describe('chained operations - medium dataset', () => {
  bench('@certes/list', () => {
    const filtered = filter(isEven)(medium);
    const mapped = map(double)(filtered);
    reduce(sum)(0)(mapped);
  });

  bench('native', () => {
    medium.filter(isEven).map(double).reduce(sum, 0);
  });
});

describe('chained operations - large dataset', () => {
  bench('@certes/list', () => {
    const filtered = filter(isEven)(large);
    const mapped = map(double)(filtered);
    reduce(sum)(0)(mapped);
  });

  bench('native', () => {
    large.filter(isEven).map(double).reduce(sum, 0);
  });
});
