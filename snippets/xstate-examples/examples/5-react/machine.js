import { createMachine, assign } from 'xstate';

const machine = createMachine({
  initial: 'initial',
  context: {
    red: false,
    yellow: false,
    green: false,
  },
  on: {
    RESET: 'initial',
    BREAK: 'switchedOff',
  },
  states: {
    initial: {
      entry: 'logInitializing',
      always: 'stop',
    },
    stop: {
      entry: assign({
        red: true,
        yellow: false,
        green: false,
      }),
      after: {
        2000: {
          target: 'prepareToGo',
          actions: 'logContext',
        },
      },
    },
    prepareToGo: {
      entry: assign({
        red: true,
        yellow: true,
        green: false,
      }),
      after: {
        600: {
          target: 'go',
          actions: 'logContext',
        },
      },
    },
    go: {
      entry: assign({
        red: false,
        yellow: false,
        green: true,
      }),
      after: {
        2000: {
          target: 'prepareToStop',
          actions: 'logContext',
        },
      },
    },
    prepareToStop: {
      entry: assign({
        red: false,
        yellow: true,
        green: false,
      }),
      after: {
        1200: {
          target: 'stop',
          actions: 'logContext',
        },
      },
    },
    switchedOff: {
      type: 'final',
      entry: assign({
        red: false,
        yellow: false,
        green: false,
      }),
    },
  },
});

export default machine;
