import { compose } from '@certes/composition/compose';
import { collect } from '../../helpers/collect';
import { take } from '../../iterators/take';

/**
 * Takes `n` elements and immediately collects them into an array.
 *
 * @param n - Number of elements to take
 *
 * @param iter - Source iterable
 *
 * @returns An array of the first `n` elements
 *
 * @remarks
 * Composed from `take` and `collect`.
 *
 * @example
 * takeEager(3)(range(1, 100)); // [1, 2, 3]
 */
export const takeEager = (n: number) => compose(collect, take(n));
