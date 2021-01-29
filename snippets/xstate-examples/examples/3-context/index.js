const { interpret } = require('xstate');
const machine = require('./machine');

const service = interpret(machine).start();

service.send('ITERATE');
service.send('ITERATE');
service.send('ITERATE');
service.send('ITERATE_AND_BUMP', { count: 10 });
service.send('ITERATE');
service.send('ITERATE_AND_BUMP', { count: -15 });
service.send('ITERATE');
