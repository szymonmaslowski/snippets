import createLogger from '@snippets/logger';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { select } from 'redux-saga/effects';

const logger = createLogger('select');

const rootReducer = (state = { field: 'value' }) => state;
const sagaMiddleware = createSagaMiddleware();
createStore(rootReducer, applyMiddleware(sagaMiddleware));

const selectField = state => state.field;
function* saga() {
  const state = yield select();
  logger.info(
    `Returning whole state when no selector: ${JSON.stringify(state)}`,
  );
  const field = yield select(selectField);
  logger.info(
    `Returning data mapped by provided selector: ${JSON.stringify(field)}`,
  );
}
sagaMiddleware.run(saga);
