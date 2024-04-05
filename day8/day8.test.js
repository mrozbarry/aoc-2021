import test from 'ava';
import { sequenceSum } from './day7.js';

test('can get the sum of a sequence', (t) => {
  t.is(sequenceSum(0, 5), 15);
  t.is(sequenceSum(1, 5), 10);
  t.is(sequenceSum(5, 16), 66);
  t.is(sequenceSum(14, 5), 45);
});
