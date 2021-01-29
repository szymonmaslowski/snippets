const { assign, createMachine } = require('xstate');

const machine = createMachine(
  {
    context: {
      count: 0,
    },
    initial: 'singleState',
    states: {
      singleState: {
        exit: [
          assign({
            count: ctx => ctx.count + 1,
          }),
          'logContext',
        ],
        on: {
          ITERATE: 'singleState',
          ITERATE_AND_BUMP: {
            actions: ['logBump', 'bumpCount'],
          },
        },
      },
    },
  },
  {
    actions: {
      logContext: ctx => console.info('Context', ctx),
      logBump: (ctx, event) => console.info('Adding', event.count),
      bumpCount: assign({
        count: (ctx, event) => ctx.count + event.count,
      }),
    },
  },
);

module.exports = machine;
