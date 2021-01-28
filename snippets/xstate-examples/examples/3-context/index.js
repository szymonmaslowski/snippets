const { assign, interpret } = require('xstate');
const makeMachine = require('./machine');

const machine = makeMachine({
  logContext: ctx => console.info('Context', ctx),
  logBump: (ctx, event) => console.info('Bumping by', event.count),
  bumpCount: assign({
    count: (ctx, event) => ctx.count + event.count,
  }),
});

const service = interpret(machine).start();

service.send('ITERATE');
service.send('ITERATE');
service.send('ITERATE');
service.send('ITERATE_AND_BUMP', { count: 10 });
service.send('ITERATE');
service.send('ITERATE_AND_BUMP', { count: -15 });
service.send('ITERATE');
