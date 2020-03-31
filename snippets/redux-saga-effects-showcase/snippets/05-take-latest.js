import createLogger from '@snippets/logger';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { delay, takeLatest } from 'redux-saga/effects';

const logger = createLogger('takeLatest');

const rootReducer = state => state;
const sagaMiddleware = createSagaMiddleware();
const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));

function* saga() {
  function* childSaga(argument, { actionNumber }) {
    logger.info(`stared | ${argument} | ${actionNumber}`);
    yield delay(1000);
    logger.info(`finished | ${argument} | ${actionNumber}`);
  }
  yield takeLatest('TAKE_LATEST_ACTION', childSaga, 'little pony');
}
sagaMiddleware.run(saga);
store.dispatch({ type: 'TAKE_LATEST_ACTION', actionNumber: 1 });
setTimeout(() => {
  store.dispatch({ type: 'TAKE_LATEST_ACTION', actionNumber: 2 });
}, 500);
