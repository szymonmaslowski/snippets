import {
  take,
  cancel,
  fork,
  select,
  put,
  call,
  cancelled,
} from 'redux-saga/effects';
import { getBookContent } from './api';
import {
  eventContentRequested,
  eventFetchStarted,
  eventFetchSucceeded,
  eventFetchFailed,
  eventFetchCanceled,
  selectBookId,
  selectFetchingWrongBook,
} from './store';

function* fetchBookContent() {
  const abortController = new AbortController();
  // access bookId from store (use selectBookId selector)
  try {
    // perform a api call for a book content
    //  - notify that fetching begun (use eventFetchStarted action)
    //  - invoke api call getBookContent(bookId, abortController.signal) in proper "saga way"
    //  - notify that fetching succeeded (use eventFetchSucceeded action providing book content)
  } catch (e) {
    // handle error (use eventFetchFailed action passing e.message)
  } finally {
    // do the cleanup (remember to check if cancellation happened)
    //  - use abortController.abort() to cancel api call
    //  - use eventFetchCanceled() action
  }
}

export default function* rootSaga() {
  let task = null;
  while (true) {
    yield take(eventContentRequested.type);

    // prevent re-running fetchBookContent saga for same book id
    // (use selectFetchingWrongBook selector)
    if (task) yield cancel(task);
    task = yield fork(fetchBookContent);
  }
}
