import createLogger from '@snippets/logger';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { take } from 'redux-saga/effects';

const logger = createLogger('take');

const rootReducer = state => state;
const sagaMiddleware = createSagaMiddleware();
const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));

function* saga() {
  const action = yield take('TAKE_ACTION');
  logger.info(`received action ${JSON.stringify(action)}`);
  const action2 = yield take('TAKE_ACTION');
  logger.info(`received another action ${JSON.stringify(action2)}`);

  while (true) {
    const actionLoop = yield take('TAKE_ACTION');
    logger.info(`receiving action in an loop ${JSON.stringify(actionLoop)}`);
  }
}
sagaMiddleware.run(saga);
store.dispatch({ type: 'TAKE_ACTION' });
store.dispatch({ type: 'TAKE_ACTION', payload: 1 });
store.dispatch({ type: 'TAKE_ACTION', payload: 'first in loop' });
store.dispatch({ type: 'TAKE_ACTION', payload: 'second in loop' });
