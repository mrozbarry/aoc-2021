import { app, h, text } from 'hyperapp';

const defaultPosition = {
  horizontal: 0,
  depth: 0,
  aim: 0,
};

export const initialState = {
  input: '',
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
  setInput: (state, event) => {
    return {
      ...state,
      input: event.target.value,
    };
  },

  submit: (state, event) => {
    event.preventDefault();

    const values = state.input
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
      [effects.act, { action: actions.next }],
    ];
  },

  next: (state) => {
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
      [effects.act, { action: actions.next }],
    ];
  },
};

app({
  init: initialState,

  view: (state) => h(
    'div',
    {
      style: {
        width: '50%',
        maxWidth: '350px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
      },
    },
    [
      h('form', {
        onsubmit: actions.submit,
        style: {
          display: 'flex',
          flexDirection: 'column',
        },
      }, [
        h('textarea', { value: state.input, oninput: actions.setInput, style: { maxWidth: '100%' } }),
        h('button', { type: 'submit' }, text('Process')),
      ]),

      h('div', {}, [
        text(`Results: [position:[horizontal:${state.position.horizontal}][depth:${state.position.depth}][aim:${state.position.aim}]][output:${state.position.horizontal * state.position.depth}]`),
      ]),

      h('progress', { max: state.total, value: state.total - state.values.length, style: { width: '100%', display: 'block' } }),

      h('ul', {}, state.values.map(({ original }) => h('li', {}, text(original)))),

    ],
  ),

  node: document.querySelector('#main'),
});
