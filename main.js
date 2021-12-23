import {app, h, text} from './lib/hyperapp.js';
import * as commonEffects from './lib/commonEffects.js';

export const initialState = {
  dayNumber: null,
  input: '',
  error: '',
  module: {
    initialState: {},
    state: {},
    actions: {},
    view: () => h('div', {}, text('Select a day')),
  }
};

const map = (action) => (state, props) => {
  const result = action(state.module.state, props);
  return Array.isArray(result)
    ? [{...state, module: {...state.module, state: result[0]}}, ...result.slice(1)]
    : {...state, module: {...state.module, state: result}};
};

const dayFromHash = (hash) => {
  const checkHash = /\!\/day\/\d+$/;
  let dayNumber = 1;
  if (checkHash.test(hash)) {
    dayNumber = Number(hash.split('/').slice(-1)[0]);
  }
  return dayNumber;
};

export const subscriptions = {
  watchHash: (userProps) => [
    (dispatch, {setDay}) => {
      const onHashChange = (event) => {
        dispatch(setDay, dayFromHash(window.location.hash));
      };

      window.addEventListener('hashchange', onHashChange);

      return () => {
        window.removeEventListener('hashchange', onHashChange);
      };
    },
    userProps,
  ],
};

export const effects = {
  initFromHash: (dispatch, {setDay}) => {
    return dispatch(setDay, dayFromHash(window.location.hash));
  },

  load: (dispatch, {dayNumber, setModule}) => {
    import(`./day${dayNumber}/day${dayNumber}.js`)
      .then((module) => {
        dispatch(setModule, {
          ...module,
          state: module.initialState,
        })
      })
      .then(() => {
        window.location.hash = `!/day/${dayNumber}`;
      })
      .catch((err) => {
        dispatch((state) => ({...state, error: err.toString()}));
        console.error(err);
      });
  },
};

export const actions = {
  setDayFromEvent: (_state, event) => {
    event.preventDefault();
    const dayNumber = event.target.value;

    return [actions.setDay, dayNumber];
  },

  setDay: (state, dayNumber) => {
    return [
      {
        ...state,
        error: '',
        dayNumber,
      },
      [effects.load, {dayNumber, setModule: actions.setModule}],
    ];
  },

  setModule: (state, importedModule) => {
    return {
      ...state,
      module: importedModule,
    };
  },

  setInput: (state, event) => {
    event.preventDefault();
    return {...state, input: event.target.value};
  },

  onSubmit: (state, event) => {
    event.preventDefault();
    if (!state.module.actions.begin) {
      console.warn('Need to load day first', state);
      return state;
    }

    return [
      state,
      commonEffects.act(
        map(state.module.actions.begin),
        {
          input: state.input,
          map,
        },
      ),
    ];
  },
};

app({
  init: [
    initialState,
    [effects.initFromHash, {setDay: actions.setDay}],
  ],

  view: (state) => h(
    'body',
    {
      style: {
        display: 'grid',
        gridTemplateColumns: '350px auto',
        gridGap: '8px',
        height: '100vh',
        padding: 0,
        margin: 0,
      },
    },
    [
      // Input
      h('section', {
        style: {
          backgroundColor: '#ccc',
          height: '100%',
        },
      }, [
        h('form', {
          onsubmit: actions.onSubmit,
          style: {
            display: 'grid',
            gridTemplateRows: '32px auto 32px',
            gridGap: '8px',
            width: '100%',
            maxWidth: '100%',
            height: '100vh',
            padding: '8px',
            margin: 0,
            overflow: 'hidden',
          },
        }, [
          h('select', {
            style: {
              margin: 0,
              display: 'block',
              height: '32px',
            },
          }, [1, 2, 3, 4, 5, 6].map((dayNumber) => h('option', {
            ...(state.dayNumber === dayNumber ? { selected: true } : {}),
            value: dayNumber,
            onclick: actions.setDayFromEvent,
          }, text(`Day ${dayNumber}`)))),
          h('div', {}, [
            h('textarea', {
              value: state.input,
              oninput: actions.setInput,
              placeholder: 'Paste input here',
              style: {
                margin: 0,
                display: 'block',
                width: '100%',
                height: '100%',
                resize: 'none',
              },
            }),
          ]),
          h('button', {
            type: 'submit',
            style: {
              display: 'block',
              height: '32px',
            },
          }, text('Process >>')),
        ]),
      ]),

      // Output
      h('section', {
        style: {
          padding: '8px',
          height: '100vh',
          overflowY: 'auto',
        },
      }, [
        state.error
          ? text(state.error)
          : state.module.view(state.module.state, {map}),
      ]),
    ]
  ),

  subscriptions: (state) => {
    return [
      subscriptions.watchHash({ setDay: actions.setDay }),
      ...(
        (typeof state.module.subscriptions === 'function')
          ? state.module.subscriptions(state, map)
          : []
      ),
    ];
  },

  node: document.querySelector('body'),
});
