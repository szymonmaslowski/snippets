import createLogger from '@snippets/logger';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { delay } from 'redux-saga/effects';

const logger = createLogger('delay');

const rootReducer = state => state;
const sagaMiddleware = createSagaMiddleware();
createStore(rootReducer, applyMiddleware(sagaMiddleware));

function* saga() {
  yield delay(1000);
  logger.info('I am invoked after a delay of 1s');
}
sagaMiddleware.run(saga);
