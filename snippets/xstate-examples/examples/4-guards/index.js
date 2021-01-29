const { interpret } = require('xstate');
const machine = require('./machine');

const service = interpret(machine).start();

service.send('ENTER_PIN', { pin: 'incorrect' });
service.send('ENTER_PIN', { pin: 'incorrect' });
service.send('ENTER_PIN', { pin: 'incorrect' });
