import { interpret } from 'xstate';
import makeMachine from './machine';
import makeLightRenderer from './makeLightRenderer';

const rootElement = document.querySelector('#root');
const render = makeLightRenderer(rootElement);

const machine = makeMachine({
  fireRed: () => render('red'),
  fireYellow: () => render('yellow'),
  fireGreen: () => render('green'),
  log: console.info,
});

const service = interpret(machine).start();

window.service = service;
