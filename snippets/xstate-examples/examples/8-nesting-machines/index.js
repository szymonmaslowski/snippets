import { interpret } from 'xstate';
import machineInvoking from './machineInvoking';
import machineSpawning from './machineSpawning';

const service = interpret(machineInvoking)
  .onTransition(state => console.info(state.value))
  .start();

service.send('AUTH');
