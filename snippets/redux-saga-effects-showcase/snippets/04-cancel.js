import createLogger from '@snippets/logger';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { cancel, delay, fork } from 'redux-saga/effects';

const logger = createLogger('cancel');

const rootReducer = state => state;
const sagaMiddleware = createSagaMiddleware();
createStore(rootReducer, applyMiddleware(sagaMiddleware));

function* saga() {
  function* childSaga() {
    yield delay(2000);
    logger.info('I will never be invoked');
  }
  const task = yield fork(childSaga);
  yield delay(1000);
  yield cancel(task);
  logger.info('Child task got canceled after 1s');
}
sagaMiddleware.run(saga);
