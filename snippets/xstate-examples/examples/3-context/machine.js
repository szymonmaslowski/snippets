const { assign, createMachine } = require('xstate');

const makeMachine = ({ bumpCount, logBump, logContext }) =>
  createMachine(
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
        bumpCount,
        logBump,
        logContext,
      },
    },
  );

module.exports = makeMachine;
