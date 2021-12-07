import {h, text} from '../lib/hyperapp.js';
import * as commonEffects from '../lib/commonEffects.js';

export const initialState = {
  values: [],
  positions: [],
  epsilonRate: null,
  gammaRate: null,
  oxygenGeneratorRating: '',
  co2ScrubberRating: '',
  position: 0,
};

export const effects = {};

export const mostCommon = (values) => {
  const numberOfOnes = values.filter(v => v === 1).length;
  const numberOfZeros = values.filter(v => v === 0).length;

  return {
    mostCommon: numberOfOnes >= numberOfZeros ? 1 : 0,
    leastCommon: numberOfOnes >= numberOfZeros ? 0 : 1,
  };
};

export const getCommonBits = (values) => {
  const bitLength = values[0].bits.length;

  const positions = Array.from({length: bitLength}, (_, bitIndex) => ({
    bits: values.map(v => v.bits[bitIndex]),
    mostCommon: null,
    leastCommon: null,
  }));

  return positions.map(p => ({
    ...p,
    ...mostCommon(p.bits),
  }));
};

export const actions = {
  begin: (state, {input, map}) => {
    const values = input
      .split('\n')
      .filter(v => v)
      .map(v => {
        return {
          original: v,
          bits: v.split('').map(Number),
        };
      });

    const positions = getCommonBits(values);
    const gammaRate = parseInt(positions.map(p => p.mostCommon).join(''), 2);
    const epsilonRate = parseInt(positions.map(p => Math.abs(1 - p.mostCommon)).join(''), 2);

    return [
      {
        ...state,
        values,
        positions,
        gammaRate,
        epsilonRate,
      },
      commonEffects.act(map(actions.beginPart2), {map}),
    ];
  },

  beginPart2: (state, {map}) => {
    return [
      {
        ...state,
        position: 0,
        oxygenGeneratorRating: '',
        co2ScrubberRating: '',
      },
      commonEffects.act(map(actions.nextOxygen), {map, values: state.values, filter: ''}),
      commonEffects.act(map(actions.nextCo2Scrubber), {map, values: state.values, filter: ''}),
    ];
  },

  nextOxygen: (state, {map, filter, values}) => {
    const commonBits = getCommonBits(values);
    const nextFilter = `${filter}${commonBits[filter.length].mostCommon}`;
    const nextValues = values.filter(v => v.original.startsWith(nextFilter));
    if (nextValues.length === 1) {
      return {
        ...state,
        oxygenGeneratorRating: nextValues[0].original,
      };
    }

    return [
      state,
      commonEffects.act(map(actions.nextOxygen), {map, values: nextValues, filter: nextFilter}),
    ];
  },

  nextCo2Scrubber: (state, {map, filter, values}) => {
    const commonBits = getCommonBits(values);
    const nextFilter = `${filter}${commonBits[filter.length].leastCommon}`;
    const nextValues = values.filter(v => v.original.startsWith(nextFilter));
    if (nextValues.length === 1) {
      return {
        ...state,
        co2ScrubberRating: nextValues[0].original,
      };
    }

    return [
      state,
      commonEffects.act(map(actions.nextCo2Scrubber), {map, values: nextValues, filter: nextFilter}),
    ];
  },
};

export const view = (state) => h('div', {}, [
  h('div', {}, [
    text(`Part 1: [gammaRate:${state.gammaRate}][epsilonRate:${state.epsilonRate}][power consumption:${state.gammaRate * state.epsilonRate}]`),
  ]),
  h('div', {}, [
    text(`Part 2: [oxygen generator rating:${state.oxygenGeneratorRating}(${parseInt(state.oxygenGeneratorRating, 2)})][co2 scrubber rating:${state.co2ScrubberRating}(${parseInt(state.co2ScrubberRating, 2)})][life support:${parseInt(state.oxygenGeneratorRating, 2) * parseInt(state.co2ScrubberRating, 2)}]`),
  ]),
]);
