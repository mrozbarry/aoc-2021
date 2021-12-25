import { h, text } from '../lib/hyperapp.js';
import * as commonEffects from '../lib/commonEffects.js';

export const initialState = {
  positions: [],
  range: [0, 0],
  part1: { position: null, cost: null },
  part2: { position: null, cost: null },
};

export const sequenceSum = (a, b = 0) => {
  const min = Math.min(a, b);
  const max = Math.max(a, b);
  const length = max - min + 1;
  let sum = 0;
  for(let i = 0; i < length; i++) {
    sum += i;
  }
  return sum;
};

export const diff = (a, b) => Math.abs(a - b);

export const cost = (positions, target, calculate = diff) => positions
  .reduce(
    (total, position) => total + calculate(position, target),
    0,
  );

export const subs = {};

export const effects = {};

export const actions = {
  begin: (state, {input, map}) => {
    const positions = input.split(',').map(Number);

    const range = [
      Math.min(...positions),
      Math.max(...positions),
    ];

    const part1 = { position: null, cost: null };

    return [
      { ...state, positions, range, part1 },
      commonEffects.act(map(actions.next), {map}),
    ];
  },

  next: (state, {map}) => {
    const length = state.range[1] - state.range[0];
    const part1 = Array
      .from({ length }, (_, p) => ({ position: p, cost: cost(state.positions, p, diff) }))
      .reduce((lowest, data) => data.cost < lowest.cost ? data : lowest);
    const part2 = Array
      .from({ length }, (_, p) => ({ position: p, cost: cost(state.positions, p, sequenceSum) }))
      .reduce((lowest, data) => data.cost < lowest.cost ? data : lowest);

    return { ...state, part1, part2 };
  },
};

export const view = (state) => h('div', {}, [
  h('div', {}, [
    text(`Part 1: [range:${state.range.join('...')}][position:${state.part1.position}][cost:${state.part1.cost}]`),
  ]),
  h('div', {}, [
    text(`Part 2: [position:${state.part2.position}][cost:${state.part2.cost}]`),
  ]),
]);
