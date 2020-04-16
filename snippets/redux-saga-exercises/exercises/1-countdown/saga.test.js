import assert from 'assert';
import createStore from './store';

const testingSolution = process.env.SOLUTION === 'true';
let saga;
if (testingSolution) {
  saga = require('../../solutions/1-countdown/saga').default;
} else {
  saga = require('./saga').default;
}

const wait = time => new Promise(r => setTimeout(r, time));

describe('Exercise 1: countdown', () => {
  it('achieves functionality', async function() {
    this.timeout(5000);
    const originalConsoleInfo = console.info;
    let loggedMessages = '';
    const log = (...args) => {
      loggedMessages += `${args.join(' ')}\n`;
    };
    console.info = log;

    const store = createStore({ saga });
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
});
