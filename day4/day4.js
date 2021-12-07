import {h, text} from '../lib/hyperapp.js';
import * as commonEffects from '../lib/commonEffects.js';

const array = (length) => Array.from({ length }, (_, index) => index);

const nullBoard = () => ({ cells: array(5).map(() => array(5).map(() => null)), called: [], isDone: true });

const first = (arr, defaultValue) => arr[0] || defaultValue;
const last = (arr, defaultValue) => arr.slice(-1)[0] || defaultValue;
const sum = (arr) => arr.reduce((memo, number) => memo + number, 0);

const winConditions = [
  ...array(5).map((y) => array(5).map((x) => `{${x},${y}}`).join(',')),
  ...array(5).map((x) => array(5).map((y) => `{${x},${y}}`).join(',')),
];

const isComplete = (cells, called) => {
  const currentConditions = [
    ...array(5).map((y) => array(5).map((x) => called.includes(cells[y][x]) ? `{${x},${y}}` : 'X').join(',')),
    ...array(5).map((x) => array(5).map((y) => called.includes(cells[y][x]) ? `{${x},${y}}` : 'X').join(',')),
  ];

  return winConditions.some(w => currentConditions.includes(w));
};

const calculateScore = ({ cells, called }) => {
  const unmarked = cells.reduce((values, row) => {
    return [
      ...values,
      ...row.filter(v => !called.includes(v)),
    ];
  }, []);
  return sum(unmarked) * last(called);
};

export const initialState = {
  numbers: [],
  called: [],
  boards: [],
  winnerBoardIndex: -1,
  winOrder: [],
};

export const effects = {};

export const actions = {
  begin: (state, {input, map}) => {
    let [numbers, ...boards] = input.split('\n');

    numbers = numbers.split(',').map(Number);

    boards = boards.join('\n')
      .split('\n\n')
      .map((board) => ({
        cells: board.split('\n').map(row => row.split(' ').filter(v => v).map(Number)),
        called: [],
        isDone: false,
      }));

    return [
      {
        ...state,
        numbers,
        boards,
        lastCalled: null,
        winnerBoardIndex: -1,
        winnerBoardUncalled: [],
      },
      commonEffects.act(map(actions.playNumber), {map}),
    ];
  },

  playNumber: (state, {map}) => {
    if (state.winOrder.length === state.boards.length) return state;

    const numbers = [...state.numbers];
    const lastCalled = numbers.shift();

    if (!lastCalled) return state;

    let winnerBoardIndex = -1;
    const boards = state.boards.map((b, index) => {
      if (b.isDone) return b;

      const called = b.called.concat(lastCalled);
      const isDone = isComplete(b.cells, called);
      if (isDone) {
        winnerBoardIndex = index;
      }
      return {
        ...b,
        called,
        isDone,
      };
    });

    return [
      {
        ...state,
        boards,
        numbers,
        winOrder: winnerBoardIndex >= 0 ? [...state.winOrder, winnerBoardIndex ] : state.winOrder,
      },
      commonEffects.act(map(actions.playNumber), {map}),
    ];
  },
};

export const view = (state) => h('div', {}, [
  h('div', {}, [
    text(`Part 1: [first winning board index:${first(state.winOrder)}][score:${calculateScore(state.boards[first(state.winOrder, -1)] || nullBoard())}]`),
  ]),
  h('div', {}, [
    text(`Part 2: [last winning board index:${last(state.winOrder)}][score:${calculateScore(state.boards[last(state.winOrder, -1)] || nullBoard())}]`),
  ]),

  h('div', {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
    },
  }, state.boards.map((board, index) => h('div', {
    style: {
      backgroundColor: board.isDone ? '#ffbbbb' : 'none',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      paddingBottom: '2rem',
    },
  }, [
    //h('h2', {}, text(`Board ${index}`)),
    h('table', {
      style: {
        tableLayout: 'fixed',
        borderCollapse: 'collapse',
      },
    }, [
      h('tbody', {}, board.cells.map((row) => h('tr', {}, row.map((cell) => h('td', {
        style: {
          border: '1px #ccc solid',
        },
      }, [
        h('div', {
          style: {
            width: '2rem',
            height: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: board.called.includes(cell) ? '#aaa' : 'white',
          },
        }, text(cell.toString())),
      ])))))
    ])
  ]))),
]);
