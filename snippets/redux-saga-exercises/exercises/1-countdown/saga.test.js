import assert from 'assert';
import createStore from './store';

const wait = time => new Promise(r => setTimeout(r, time));

it('Exercise 1: countdown', async function() {
  this.timeout(5000);
  const originalConsoleInfo = console.info;
  let loggedMessages = '';
  const log = (...args) => {
    loggedMessages += `${args.join(' ')}\n`;
  };
  console.info = log;

  const store = createStore();
  log('starting');
  store.dispatch({ type: 'COUNTDOWN_REQUESTED', payload: { time: 3 } });
  await wait(1000);
  log('a second later');
  log('starting');
  store.dispatch({ type: 'COUNTDOWN_REQUESTED', payload: { time: 2 } });
  await wait(3000);
  log('three seconds later');

  const expectedLoggedMessages = `\
starting
Counting down!
3
2
a second later
starting
Counting down!
2
1
Finished!
three seconds later
`;

  assert.equal(loggedMessages, expectedLoggedMessages);

  console.info = originalConsoleInfo;
});
