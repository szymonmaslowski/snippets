const { createMachine } = require('xstate');

const machine = createMachine({
  id: 'root',
  initial: 'doorOpen',
  states: {
    doorOpen: {
      on: { DOOR_PUSHED: 'doorClosed' },
    },
    doorClosed: {
      initial: 'handleNotPressed',
      states: {
        handleNotPressed: {
          on: { HANDLE_PRESSED: 'handlePressed' },
        },
        handlePressed: {
          on: {
            HANDLE_RELEASED: 'handleNotPressed',
            DOOR_PULLED: '#root.doorOpen',
          },
        },
      },
    },
  },
});

module.exports = machine;
