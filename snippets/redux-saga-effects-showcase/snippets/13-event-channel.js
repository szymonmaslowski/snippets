import createLogger from '@snippets/logger';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware, { eventChannel, END } from 'redux-saga';
import { delay, call, take } from 'redux-saga/effects';

const logger = createLogger('eventChannel');

const rootReducer = state => state;
const sagaMiddleware = createSagaMiddleware();
createStore(rootReducer, applyMiddleware(sagaMiddleware));

const createIntervalChannel = () => {
  return eventChannel(emit => {
    let num = 0;
    const interval = setInterval(() => {
      num += 1;
      emit(num);

      if (num === 4) {
        emit(END);
      }
    }, 1000);
    // message emitted immediately will be lost
    emit('LOST');

    return () => {
      logger.info('cleanup callback invoked');
      clearInterval(interval);
    };
  });
};

function* saga() {
  const intervalChannel = yield call(createIntervalChannel);
  // comment to prevent losing 1 message
  yield delay(1500);
  while (true) {
    const data = yield take(intervalChannel);
    if (data === 3) {
      // comment to make channel close itself (END action)
      intervalChannel.close();
    }
    logger.info(`Data from channel ${data}`);
  }
  // Execution never goes outside of the loop
}
sagaMiddleware.run(saga);
