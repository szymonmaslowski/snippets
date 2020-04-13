import { take, fork, cancel, delay } from 'redux-saga/effects';

function* onCountdownRequested(action) {
  const {
    payload: { time },
  } = action;
  console.info('Counting down!');
  for (let i = time; i > 0; i -= 1) {
    console.info(i);
    yield delay(1000);
  }
  console.info('Finished!');
}

function* takeLatest(eventName, handler) {
  let task = null;
  while (true) {
    const action = yield take('COUNTDOWN_REQUESTED');
    if (task) {
      yield cancel(task);
    }
    task = yield fork(handler, action);
  }
}

export default function* rootSaga() {
  yield takeLatest('COUNTDOWN_REQUESTED', onCountdownRequested);
}
