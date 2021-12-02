import { app, h, text } from 'hyperapp';

export const initialState = {
  input: '',
  values: [],
  index: 0,
  increases: 0,
  slidingIncreases: 0,
  done: false,
};

const sum = (values) => values.reduce((result, value) => result + value, 0);

export const effects = {
  act: (dispatch, { action, props }) => setTimeout(() => dispatch(action, props), 0),
};

export const actions = {
  setInput: (state, event) => {
    event.preventDefault();
    return { ...state, input: event.target.value };
  },

  submit: (state, event) => {
    event.preventDefault();
    return [
      {
        ...state,
        values: state.input
          .split('\n')
          .map(line => line.trim())
          .filter(line => line)
          .map(v => parseInt(v)),
        index: 0,
        done: false,
      },
      [effects.act, { action: actions.increase }],
    ];
  },

  increase: (state) => {
    if (state.index >= state.values.length) {
      return { ...state, done: true };
    }

    const singleValue = state.values[state.index];
    const windowValues = state.values.slice(state.index, state.index + 3);

    let increaseCounters = {};

    if (state.index > 0) {
      const pIndex = state.index - 1;
      const previousValue = state.values[pIndex - 1];
      if (singleValue > previousValue) {
        increaseCounters.increases = state.increases + 1;
      }

      if (windowValues.length === 3) {
        const windowSum = sum(windowValues);
        const previousSum = sum(state.values.slice(pIndex, pIndex + 3));
        if (windowSum > previousSum) {
          increaseCounters.slidingIncreases = state.slidingIncreases + 1;
        }
      }

    }

    return [
      {
        ...state,
        ...increaseCounters,
        index: state.index + 1,
      },
      [effects.act, { action: actions.increase }],
    ]
  },
};

app({
  init: initialState,

  view: (state) => h(
    'div',
    {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
      },
    },
    [
      // Input
      h('section', {}, [
        h('form', {
          onsubmit: actions.submit,
          style: {
            display: 'flex',
            flexDirection: 'column',
          },
        }, [
          h('textarea', { value: state.input, oninput: actions.setInput }),
          h('button', {
            type: 'submit',
          }, text('Process')),
        ]),
      ]),

      // Output
      h('section', {}, [
        h('div', {}, text(`Stats: [increases:${state.increases}] [slidingIncreases:${state.slidingIncreases}]`)), 
        h('div', {}, [
          !state.done && h('progress', { max: state.values.length, value: state.index })
        ]),
        h('div', { style: { height: '25vh', overflow: 'auto' } }, [
          h('ul', {}, state.values.slice(state.index).map((value, index) => h('li', { style: { color: state.index === index ? 'red' : 'black' } }, text(`${value}`)))),
        ]),
      ]),
    ]
  ),

  node: document.querySelector('#main'),
});
