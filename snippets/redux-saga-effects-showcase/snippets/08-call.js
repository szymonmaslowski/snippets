import createLogger from '@snippets/logger';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { call, delay } from 'redux-saga/effects';

const logger = createLogger('call');

const rootReducer = state => state;
const sagaMiddleware = createSagaMiddleware();
createStore(rootReducer, applyMiddleware(sagaMiddleware));

const apiMethod = id =>
  new Promise(resolve => {
    setTimeout(() => resolve(`Data for id: ${id}`), 1000);
  });
function* saga() {
  yield call(logger.info, 'You can provide standard function');
  function* childSaga() {
    yield delay(1000);
  }
  yield call(childSaga);
  logger.info('Use it to run other saga - will block execution');
  const data = yield call(apiMethod, 22);
  logger.info(
    `It will also wait for promise to resolve: ${JSON.stringify(data)}`,
  );
}
sagaMiddleware.run(saga);
