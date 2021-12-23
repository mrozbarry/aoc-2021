import test from 'ava';
import { advance, splitByAge, sumAges } from './day6.js';

test('can split fish by age', (t) => {
  const fish = [3,4,3,1,2];

  t.deepEqual(splitByAge(fish), [
    0,
    1,
    1,
    2,
    1,
    0,
    0,
    0,
    0,
  ]);
});

test('can sum number of fish by ages', (t) => {
  const fish = [3,4,3,1,2];
  const ages = splitByAge(fish);

  t.is(sumAges(ages), fish.length);
});

test('can advance ages', (t) => {
  const ages = [
    0,
    1,
    1,
    2,
    1,
    0,
    0,
    0,
    0,
  ];

  t.deepEqual(advance(ages), [
    1,
    1,
    2,
    1,
    0,
    0,
    0,
    0,
    0,
  ]);
});

test('can advance ages and spawn', (t) => {
  const ages = [
    1,
    1,
    2,
    1,
    0,
    0,
    0,
    0,
    0,
  ];

  t.deepEqual(advance(ages), [
    1,
    2,
    1,
    0,
    0,
    0,
    1,
    0,
    1,
  ]);
});

test('completes sample data for 18 days', (t) => {
  const fish = [3,4,3,1,2];
  let ages = splitByAge(fish);
  for(let day = 0; day < 18; day++) {
    ages = advance(ages);
  }

  t.deepEqual(
    ages,
    splitByAge([6,0,6,4,5,6,0,1,1,2,6,0,1,1,1,2,2,3,3,4,6,7,8,8,8,8]),
  );
  t.is(sumAges(ages), 26);
});

test('completes sample data for 80 days', (t) => {
  const fish = [3,4,3,1,2];
  let ages = splitByAge(fish);
  for(let day = 0; day < 80; day++) {
    ages = advance(ages);
  }
  t.is(sumAges(ages), 5934);
});
