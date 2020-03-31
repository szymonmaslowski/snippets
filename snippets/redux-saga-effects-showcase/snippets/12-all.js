import createLogger from '@snippets/logger';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { all, delay, call, cancelled } from 'redux-saga/effects';

const logger = createLogger('all');

const rootReducer = state => state;
const sagaMiddleware = createSagaMiddleware();
createStore(rootReducer, applyMiddleware(sagaMiddleware));

function* delaySaga(time) {
  try {
    yield delay(time);
  } finally {
    if (yield cancelled()) {
      logger.info('Do not cancell any effect (this log is not visible)');
    }
  }
}

function* saga() {
  yield all([delay(100), delay(200)]);
  logger.info('unblocks execution after ALL of effects finish');
  yield all([call(delaySaga, 100), call(delaySaga, 200), call(delaySaga, 300)]);
  const result = yield all([call(() => 'data'), delay(200)]);
  logger.info('returns results of all effects', result);
  const objectResult = yield all({
    apiCall: call(() => 'data'),
    dumbDelay: delay(1000),
  });
  logger.info('Returns same data structure as provided', objectResult);
}
sagaMiddleware.run(saga);
