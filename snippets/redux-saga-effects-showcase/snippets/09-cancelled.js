import createLogger from '@snippets/logger';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { cancelled, fork, cancel, delay } from 'redux-saga/effects';

const logger = createLogger('cancelled');

const rootReducer = state => state;
const sagaMiddleware = createSagaMiddleware();
createStore(rootReducer, applyMiddleware(sagaMiddleware));

function* childSaga() {
  try {
    logger.info('Started');
    yield delay(1000);
    logger.info('Finished (will be never logged)');
  } catch (e) {
    // error handling
  } finally {
    if (yield cancelled()) {
      // cleanup after cancellation
      logger.info(
        'Using cancelled you can detect wheter your saga got cancelled or just finished the execution',
      );
    }
  }
}

function* saga() {
  const task = yield fork(childSaga);
  logger.info('Calling the task');
  yield cancel(task);
}
sagaMiddleware.run(saga);
