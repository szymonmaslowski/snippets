import createLogger from '@snippets/logger';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { call, cancelled, fork, cancel, delay } from 'redux-saga/effects';

const logger = createLogger('error handling');

const rootReducer = (state = { field: 'value' }, action) => {
  switch (action.type) {
    case 'FIELD_CHANGED': {
      const { field } = action;
      return { field };
    }
    default:
      return state;
  }
};
const sagaMiddleware = createSagaMiddleware();
createStore(rootReducer, applyMiddleware(sagaMiddleware));

function* sagaThatThrows() {
  yield delay(1000);
  throw new Error('Exception');
}

function* childSaga(name) {
  try {
    yield call(sagaThatThrows);
  } catch (e) {
    logger.info(`Saga ${name} handling exception`);
  } finally {
    if (yield cancelled()) {
      logger.info(`Saga ${name} canceled`);
    }
    logger.info(`Saga ${name} finishing`);
  }
}

function* saga() {
  const task = yield fork(childSaga, 1);
  yield cancel(task);
  const task2 = yield fork(childSaga, 2);
  yield delay(2000);
  yield cancel(task2);
}
sagaMiddleware.run(saga);
