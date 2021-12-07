import { h, text } from '../lib/hyperapp.js';
import * as commonEffects from '../lib/commonEffects.js';

const defaultPosition = {
  horizontal: 0,
  depth: 0,
  aim: 0,
};

export const initialState = {
  total: 0,
  values: [],
  position: defaultPosition,
};

export const effects = {
  act: (dispatch, { action, props }) => setTimeout(() => dispatch(action, props), 0),
};

const directionTranslation = {
  forward: { horizontal: 1, depth: 0, aim: 0 },
  up: { horizontal: 0, depth: 0, aim: -1 },
  down: { horizontal: 0, depth: 0, aim: 1 },
};

export const translateDirection = (direction, amount) => {
  const translated = directionTranslation[direction];
  return {
    horizontal: translated.horizontal * amount,
    depth: translated.depth * amount,
    aim: translated.aim * amount,
  };
};

export const addOffset = (offset, previous) => {
  const aim = previous.aim + offset.aim;
  return {
    horizontal: previous.horizontal + offset.horizontal,
    depth: previous.depth + (offset.horizontal * aim),
    aim,
  };
};

export const actions = {
  begin: (state, { input, map}) => {
    const values = input
      .split('\n')
      .filter(v => v)
      .map(v => {
        const [direction, value] = v.split(' ')
        return {
          original: v,
          ...translateDirection(direction, value),
        };
      });

    return [
      {
        ...state,
        position: defaultPosition,
        values,
        total: values.length,
      },
      commonEffects.act(map(actions.next), {map}),
    ];
  },

  next: (state, { map}) => {
    if (state.values.length === 0) {
      return state;
    }
    const values = [...state.values];
    const offset = values.shift();

    return [
      {
        ...state,
        values,
        position: addOffset(offset, state.position),
      },
      commonEffects.act(map(actions.next), { map}),
    ];
  },
};

export const view = (state) => h('div', {}, [
  h('div', {}, [
    text(`Results: [position:[horizontal:${state.position.horizontal}][depth:${state.position.depth}][aim:${state.position.aim}]][output:${state.position.horizontal * state.position.depth}]`),
  ]),

  h('progress', { max: state.total, value: state.total - state.values.length, style: { width: '100%', display: 'block' } }),

  h('ul', {}, state.values.map(({ original }) => h('li', {}, text(original)))),
]);
