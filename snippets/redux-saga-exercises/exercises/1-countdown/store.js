import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import saga from './saga';

const initialState = {};
const rootReducer = (state = initialState) => state;

export default () => {
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));
  sagaMiddleware.run(saga);
  return store;
};
