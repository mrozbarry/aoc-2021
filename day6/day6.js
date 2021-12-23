import { h, text } from '../lib/hyperapp.js';
import * as commonEffects from '../lib/commonEffects.js';

export const initialState = {
  ages: [],
  part1: 0,
  part2: 0,
  remainingDays: 0,
};


export const subs = {};

export const effects = {};

export const splitByAge = fish => fish
  .reduce((memo, age) => {
    const next = [...memo];
    next[age] += 1;
    return next;
  }, [0, 0, 0, 0, 0, 0, 0, 0, 0]);

export const sumAges = ages => ages.reduce((sum, a) => sum + a, 0);
export const advance = (prevAges) => {
  const [willSpawn, ...ages] = prevAges;
  ages[6] += willSpawn;
  ages.push(willSpawn);

  return ages;
};

export const actions = {
  begin: (state, {input, map}) => {
    const lanternfish = input
      .split(',')
      .map(Number);

    const ages = splitByAge(lanternfish);
    const remainingDays = 256;

    return [
      { ...state, remainingDays, ages },
      commonEffects.act(map(actions.advanceDay), {map}),
    ];
  },

  advanceDay: (state, {map}) => {
    if (state.remainingDays === 0) {
      return state;
    }

    const ages = advance(state.ages);
    const remainingDays = state.remainingDays - 1;

    let solutions = {};
    if (remainingDays === (256 - 80)) {
      solutions.part1 = sumAges(ages);
    }

    return [
      {
        ...state,
        ...solutions,
        remainingDays,
        ages,
      },
      commonEffects.act(map(actions.advanceDay), {map}),
    ];
  },
};

export const view = (state, {map}) => h('div', {}, [
  h('div', {}, [
    text(`Part 1: [day:${state.part1 ? 80 : (256 - state.remainingDays)}][fish:${state.part1 || sumAges(state.ages)}]`),
  ]),
  h('div', {}, [
    text(`Part 2: [day:${256 - state.remainingDays}][count:${sumAges(state.ages)}]`),
  ]),

]);
