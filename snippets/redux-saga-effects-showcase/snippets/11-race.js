import createLogger from '@snippets/logger';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { race, delay, call, cancelled, fork, take } from 'redux-saga/effects';

const logger = createLogger('race');

const rootReducer = state => state;
const sagaMiddleware = createSagaMiddleware();
createStore(rootReducer, applyMiddleware(sagaMiddleware));

function* delaySaga(time) {
  try {
    yield delay(time);
  } finally {
    if (yield cancelled()) {
      logger.info('Cancels sagas that didnt finish', time);
    }
  }
}

function* saga() {
  yield race([delay(100), delay(200)]);
  logger.info('unblocks execution after just one effect finishes');
  yield race([
    call(delaySaga, 100),
    call(delaySaga, 200),
    call(delaySaga, 300),
  ]);
  const result = yield race([call(() => 'data'), delay(200)]);
  logger.info(
    'returns results of all effects (undefined for cancelled)',
    result,
  );
  const objectResult = yield race({
    apiCall: call(() => 'data'),
    timeout: delay(1000),
    cancel: take('CANCELLED'),
  });
  logger.info('Returns same data structure as provided', objectResult);
  yield race({
    pararel: fork(function* inlineSaga() {
      yield delay(1000);
      logger.info('forked task finished');
    }),
    timeout: delay(1000),
  });
  logger.info('Do not use fork with race (fork returns immediately)');
}
sagaMiddleware.run(saga);
