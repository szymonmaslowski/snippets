import createLogger from '@snippets/logger';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { select, put } from 'redux-saga/effects';

const logger = createLogger('put');

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

function* saga() {
  const fieldChangedAction = {
    type: 'FIELD_CHANGED',
    field: 'new field value',
  };
  yield put(fieldChangedAction);
  const state = yield select();
  logger.info(`Action provoked state change: ${JSON.stringify(state)}`);
}
sagaMiddleware.run(saga);
