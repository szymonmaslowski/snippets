import createLogger from '@snippets/logger';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { delay, fork } from 'redux-saga/effects';

const logger = createLogger('fork');

const rootReducer = state => state;
const sagaMiddleware = createSagaMiddleware();
createStore(rootReducer, applyMiddleware(sagaMiddleware));

function* saga() {
  function* childSaga(argument) {
    logger.info('Forked saga runs in background');
    yield delay(100);
    logger.info(`An argument of child saga is ${argument}`);
  }
  yield fork(childSaga, 'pony tail');
  logger.info('Forked saga doesnt block execution of parrent saga');
}
sagaMiddleware.run(saga);
