import {h, text} from '../lib/hyperapp.js';
import * as commonEffects from '../lib/commonEffects.js';
import { Vec2 } from './Vec2.js';

export const initialState = {
  lines: [],
  part1: 0,
  part2: 0,
};

export const subs = {};

export const effects = {};

export const actions = {
  begin: (state, {input, map}) => {
    const lines = input
      .split('\n')
      .filter(line => line && !line.startsWith('#'))
      .map(line => {
        return line.split(' -> ').map(xy => Vec2.fromString(xy));
      });

    return [
      {
        ...state,
        lines,
      },
      commonEffects.act(map(actions.part1), {map}),
    ];
  },

  part1: (state, {map}) => {
    const points = state.lines
      .filter(([a, b]) => a.x === b.x || a.y === b.y)
      .reduce((pts, [a, b]) => {
        const points = a
          .pointsTo(b, a.id)
          .reduce((linePoints, p) => ({
            ...linePoints,
            [p.toString()]: pts[p.toString()]
              ? pts[p.toString()] + 1
              : 1,
          }), {});

        return {
          ...pts,
          ...points,
        };
      }, {});

    const grid = []
    Object.keys(points).forEach(p => {
      const [x, y] = p.split(',').map(Number);
      grid[y] ||= [];
      grid[y][x] = points[p];
    });

    const part1 = Object.keys(points)
      .filter(p => points[p] >= 2)
      .length;

    return [
      {
        ...state,
        part1,
      },
      commonEffects.act(map(actions.part2), {map}),
    ];
  },

  part2: (state) => {
    const points = state.lines
      .reduce((pts, [a, b]) => {
        const points = a
          .pointsTo(b, a.id)
          .reduce((linePoints, p) => ({
            ...linePoints,
            [p.toString()]: pts[p.toString()]
              ? pts[p.toString()] + 1
              : 1,
          }), {});

        return {
          ...pts,
          ...points,
        };
      }, {});


    const grid = []
    Object.keys(points).forEach(p => {
      const [x, y] = p.split(',').map(Number);
      grid[y] ||= []
      grid[y][x] = points[p];
    });

    const part2 = Object.keys(points)
      .filter(p => points[p] >= 2)
      .length;

    return [
      {
        ...state,
        part2,
      },
    ];
  },
};

export const view = (state) => h('div', {}, [
  h('div', {}, [
    text(`Part 1: [overlap count:${state.part1}]`),
  ]),
  h('div', {}, [
    text(`Part 2: [overlap count:${state.part2}]`),
  ]),

  //h('code', {}, [
    //h('pre', {}, outputPlots(state.lines, state.plots).map(row => text(row.join('') + '\n'))),
  //]),
]);

