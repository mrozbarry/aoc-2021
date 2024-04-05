import { h, text } from '../lib/hyperapp.js';
import * as commonEffects from '../lib/commonEffects.js';

export const mappings = {
  0: [1, 1, 1, 0, 1, 1, 1],
  1: [0, 0, 1, 0, 0, 1, 0],
  2: [1, 0, 1, 1, 1, 0, 1],
  3: [1, 0, 1, 1, 0, 1, 1],
  4: [0, 1, 1, 1, 0, 1, 0],
  5: [1, 1, 0, 1, 0, 1, 1],
  6: [1, 1, 0, 1, 1, 1, 1],
  7: [1, 0, 1, 0, 0, 1, 0],
  8: [1, 1, 1, 1, 1, 1, 1],
  9: [1, 1, 1, 1, 0, 1, 1],
};

export const initialState = {
  patterns: [],
  part1: 0,
};

export const subs = {};

export const effects = {};

export const segmentsToNumber = (on) => {
  if (on.length === 2) {
    return 1;
  } else if (on.length === 3) {
    return 7;
  } else if (on.length === 4) {
    return 4;
  } else if (on.length === 7) {
    return 8;
  }

  return '';
};

export const toSegment = (letters) => {
  return {
    letters,
    number: segmentsToNumber(letters),
  };
};

export const actions = {
  begin: (state, {input, map}) => {
    const patterns = input
      .split('\n')
      .filter(v => v)
      .map(line => {
        let [input, output] = line.split(' | ');
        return {
          input: input.split(' ').map(toSegment),
          output: output.split(' ').map(toSegment),
        }
      });

    const part1 = patterns.reduce((numbers, { input, output }) => {
      return numbers
        + output.filter(i => i.number !== '').length;
    }, 0);

    return [
      { ...state, patterns, part1 },
    ];
  },

  next: (state, {map}) => {
  },
};

const letterOrder = 'abcdefg'.split('');
export const lettersToSegments = (letters) => {
  return letters.split('').reduce((segs, letter) => {
    const index = letterOrder.findIndex((l => letter === l));
    if (index < 0) return segs;
    segs[index] = 1;
    return segs;
  }, [0, 0, 0, 0, 0, 0, 0, 0]);
};

const segment = ({ letters, number }, color = 'black') => {
  const [a, b, c, d, e, f, g] = lettersToSegments(letters);
  
  return h('div', {
    style: {
      display: 'grid',
      gridTemplateRows: '4px 16px 4px 16px 4px',
      gridTemplateColumns: '4px 16px 4px',
      gap: '1px',
    },
  }, [
    h('div', {}, []),
    h('div', { style: { backgroundColor: a && color } }, []), // a
    h('div', {}, []),

    h('div', { style: { backgroundColor: b && color } }, []), // b
    h('div', { style: { textAlign: 'center', fontFamily: 'monospace' } }, [text(number.toString())]),
    h('div', { style: { backgroundColor: c && color } }, []), // c

    h('div', {}, []),
    h('div', { style: { backgroundColor: d && color } }, []), // d
    h('div', {}, []),


    h('div', { style: { backgroundColor: e && color } }, []), // e
    h('div', {}, []),
    h('div', { style: { backgroundColor: f && color } }, []), // f

    h('div', {}, []),
    h('div', { style: { backgroundColor: g && color } }, []), // g
    h('div', {}, []),
  ]);
};

const remapInput = (letter, remapping) => h('label', {
  style: {
    marginRight: '8px',
  },
}, [
  text(`${letter} => `),
  h('input', {
    value: remapping[letter] || '',
    style: {
      border: 'none',
      outline: 'none',
      borderBottom: '1px black solid',
      padding: '4px',
      width: '2rem',
      textAlign: 'center',
    },
    maxlength: 1,
  }),
]);

export const view = (state) => h('div', {}, [
  h('div', {}, [
    text(`Part 1: [1/4/7/8 #${state.part1}]`),
  ]),
  h('div', {}, [
    text(`Part 2: []`),
  ]),

  h('div', {
    style: {
      marginBottom: '16px',
    },
  }, [
    ...Object.keys(state.remapping).map(key => remapInput(key, state.remapping)),
    h('label', {}, [
      h('input', {
        type: 'checkbox',
      }),
      text('Remap Segments'),
    ]),
  ]),

  ...state.patterns.map(({input, output}) => h('div', {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(16, 1fr)',
      gap: '4px',
      marginBottom: '8px',
      paddingBottom: '8px',
      borderBottom: '1px black solid',
    },
  }, [
    ...input.map(v => segment(v, 'black', state.remapping)),
    ...output.map(v => segment(v, 'red', state.remapping)),
  ])),
]);
