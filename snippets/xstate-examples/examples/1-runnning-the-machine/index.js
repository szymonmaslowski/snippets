const { interpret } = require('xstate');
const machine = require('./machine');

const service = interpret(machine);
service.start();

service.send('HANDLE_PRESSED');
service.send('DOOR_PUSHED');
service.send('HANDLE_PRESSED', { additional: 'data' });
service.send({ type: 'HANDLE_RELEASED', additional: 'data' });
