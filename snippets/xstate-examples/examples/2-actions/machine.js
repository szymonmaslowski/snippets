import { createMachine } from 'xstate';

/**
 * 1. Defining actions in options
 * 2. Three types of actions
 * 3. Invoking actions specifying names or inlining
 * 4. Invoking multiple actions
 */

const makeMachine = ({ fireRed, fireYellow, fireGreen, log }) =>
  createMachine(
    // Machine
    {
      initial: 'stop',
      states: {
        stop: {
          entry: fireRed,
          on: {
            CHANGE: 'prepare',
          },
        },
        prepare: {
          entry: ['fireYellow'],
          on: {
            CHANGE: 'go',
          },
        },
        go: {
          entry: 'fireGreen',
          on: {
            CHANGE: {
              target: 'stop',
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
