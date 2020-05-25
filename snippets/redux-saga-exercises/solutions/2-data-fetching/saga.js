import {
  take,
  select,
  cancel,
  fork,
  put,
  call,
  cancelled,
} from 'redux-saga/effects';
import { getBookContent } from '../../exercises/2-data-fetching/api';
import {
  eventContentRequested,
  eventFetchStarted,
  eventFetchSucceeded,
  eventFetchFailed,
  eventFetchCanceled,
  selectBookId,
  selectFetchingWrongBook,
} from '../../exercises/2-data-fetching/store';

function* fetchCategoryData() {
  const abortController = new AbortController();
  const bookId = yield select(selectBookId);
  try {
    yield put(eventFetchStarted());
    const data = yield call(getBookContent, bookId, abortController.signal);
    yield put(eventFetchSucceeded(data));
  } catch (e) {
    yield put(eventFetchFailed(e.message));
  } finally {
    if (yield cancelled()) {
      abortController.abort();
      yield put(eventFetchCanceled());
    }
  }
}

export default function* rootSaga() {
  let task = null;
  while (true) {
    yield take(eventContentRequested.type);
    const fetchingDifferentThanSelected = yield select(
      selectFetchingWrongBook,
    );
    if (fetchingDifferentThanSelected) {
      if (task) yield cancel(task);
      task = yield fork(fetchCategoryData);
    }
  }
}
