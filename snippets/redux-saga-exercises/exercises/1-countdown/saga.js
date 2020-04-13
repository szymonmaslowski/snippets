import { take, fork, cancel, delay } from 'redux-saga/effects';

// Fix onCountdownRequested handler
function* onCountdownRequested(action) {
  const time = 2;
  console.info('Counting down!');
  for (let i = time; i > 0; i -= 1) {
    console.info(i);
  }
  console.info('Finished!');
}

// implement body of takeLatest
function* takeLatest(eventName, handler) {
}

export default function* rootSaga() {
  yield takeLatest('COUNTDOWN_REQUESTED', onCountdownRequested);
}
