import { Machine, send, spawn, actions, assign } from 'xstate';

const { sendParent } = actions;

const authServerMachine = Machine({
  id: 'server',
  initial: 'waitingForCode',
  states: {
    waitingForCode: {
      on: {
        CODE: {
          actions: sendParent('TOKEN'),
        },
      },
    },
  },
});

const authClientMachine = Machine({
  id: 'client',
  initial: 'idle',
  context: {
    server: null,
  },
  states: {
    idle: {
      on: { AUTH: 'authorizing' },
    },
    authorizing: {
      entry: [
        assign({
          server: () => spawn(authServerMachine, 'server'),
        }),
        send('CODE', {
          to: ctx => ctx.server,
        }),
      ],
      on: {
        TOKEN: 'authorized',
      },
    },
    authorized: {
      type: 'final',
    },
  },
});

export default authClientMachine;
