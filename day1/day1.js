import {h, text} from '../lib/hyperapp.js';
import * as commonEffects from '../lib/commonEffects.js';

export const initialState = {
  values: [],
  index: 0,
  increases: 0,
  slidingIncreases: 0,
};

const sum = (values) => values.reduce((result, value) => result + value, 0);

export const effects = {
};

export const actions = {
  begin: (state, {input, map}) => {
    return [
      {
        ...state,
        values: input
          .split('\n')
          .map(line => line.trim())
          .filter(line => line)
          .map(Number),
        index: 0,
      },
      commonEffects.act(map(actions.increase), {map}),
    ];
  },

  increase: (state, {map}) => {
    if (state.index >= state.values.length) {
      return state;
    }

    const singleValue = state.values[state.index];
    const windowValues = state.values.slice(state.index, state.index + 3);

    let increaseCounters = {};

    const pIndex = state.index - 1;

    if (state.index > 0) {
      const previousValue = state.values[pIndex];
      if (singleValue > previousValue) {
        increaseCounters.increases = state.increases + 1;
      }
    }

    if (windowValues.length === 3) {
      const windowSum = sum(windowValues);
      const previousSum = sum(state.values.slice(pIndex, pIndex + 3));
      if (windowSum > previousSum) {
        increaseCounters.slidingIncreases = state.slidingIncreases + 1;
      }
    }

    return [
      {
        ...state,
        ...increaseCounters,
        index: state.index + 1,
      },
      commonEffects.act(map(actions.increase), {map}),
    ]
  },
};

export const view = (state) => h('div', {
  style: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
}, [
  h('div', {}, text(`Stats: [increases:${state.increases}] [slidingIncreases:${state.slidingIncreases}]`)),
  h('div', {}, [
    h('progress', {max: state.values.length, value: state.index})
  ]),
  h('div', {style: {flexGrow: 1, overflow: 'auto'}}, [
    h('ul', {}, state.values.slice(state.index).map((value, index) => h('li', {style: {color: state.index === index ? 'red' : 'black'}}, text(`${value}`)))),
  ]),
]);
