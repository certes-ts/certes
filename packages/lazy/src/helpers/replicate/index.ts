import { repeat } from '@/generators/repeat';
import { take } from '@/iterators/take';

export const replicate =
  <T>(n: number) =>
  (value: T) =>
    take(n)(repeat(value));
