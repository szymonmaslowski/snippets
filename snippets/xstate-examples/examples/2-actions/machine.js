import { createMachine } from 'xstate';

/**
 * 1. Defining actions in options
 * 2. Three types of actions
 * 3. Invoking actions specifying names or inligning
 * 4. Invoking multiple actions
 */

const makeMachine = ({ fireRed, fireYellow, fireGreen, log }) =>
  createMachine(
    // Machine
    {
      initial: 'stop',
      states: {
        stop: {
          entry: [fireRed, () => log('Entered stop')],
          exit: () => log('Quiting stop'),
          on: {
            CHANGE: 'prepare',
          },
        },
        prepare: {
          entry: ['fireYellow', () => log('Entered stop')],
          exit: 'logQuitingPrepareState',
          on: {
            CHANGE: 'go',
          },
        },
        go: {
          entry: 'fireGreen',
          exit: 'logQuitingGoState',
          on: {
            CHANGE: {
              target: 'stop',
              actions: [() => log('Received CHANGE action')],
            },
          },
        },
      },
    },

    // Options
    {
      actions: {
        fireYellow,
        fireGreen,
        logQuitingPrepareState: () => log('Quiting prepare'),
        logQuitingGoState: () => log('Quiting go'),
      },
    },
  );

export default makeMachine;
