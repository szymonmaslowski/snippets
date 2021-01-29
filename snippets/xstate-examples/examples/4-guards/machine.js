const { assign, createMachine } = require('xstate');

const machine = createMachine(
  {
    context: {
      pin: '1234',
      triesLeft: 3,
    },
    initial: 'locked',
    states: {
      locked: {
        on: {
          ENTER_PIN: [
            {
              cond: 'isPinValid',
              target: 'open',
            },
            {
              cond: 'wasItLastChance',
              target: 'blocked',
            },
            {
              actions: 'noteATry',
            },
          ],
        },
      },
      open: {
        on: {
          entry: () => console.info('Open!'),
          CLOSE: 'locked',
        },
      },
      blocked: {
        type: 'final',
        entry: () => console.info('Blocked!'),
      },
    },
  },
  {
    actions: {
      noteATry: assign({
        triesLeft: ctx => ctx.triesLeft - 1,
      }),
    },
    guards: {
      isPinValid: (ctx, event) => ctx.pin === event.pin,
      wasItLastChance: ctx => ctx.triesLeft === 1,
    },
  },
);

module.exports = machine;
