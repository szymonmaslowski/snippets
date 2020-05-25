import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';

export const eventBookIdChanged = id => ({
  type: eventBookIdChanged.type,
  payload: { id },
});
eventBookIdChanged.type = 'BOOK_ID_CHANGED';

export const eventContentRequested = () => ({
  type: eventContentRequested.type,
});
eventContentRequested.type = 'CONTENT_REQUESTED';

export const eventFetchStarted = () => ({
  type: eventFetchStarted.type,
});
eventFetchStarted.type = 'FETCH_STARTED';

export const eventFetchSucceeded = content => ({
  type: eventFetchSucceeded.type,
  payload: { content },
});
eventFetchSucceeded.type = 'FETCH_SUCCEEDED';

export const eventFetchFailed = errorMessage => ({
  type: eventFetchFailed.type,
  payload: { errorMessage },
});
eventFetchFailed.type = 'FETCH_FAILED';

export const eventFetchCanceled = () => ({
  type: eventFetchCanceled.type,
});
eventFetchCanceled.type = 'FETCH_CANCELLED';

export const selectBookId = ({ bookId }) => bookId;
export const selectFetchingWrongBook = ({ bookId, fetchBookId }) => bookId !== fetchBookId;
export const selectViewData = ({
  bookId,
  booksContents,
  fetchInProgress,
  fetchTimestamp,
  fetchError,
}) => ({
  bookId,
  content: ((content = []) => content)(booksContents[bookId]),
  fetchInProgress,
  fetchTimestamp,
  fetchError,
});

const initialState = {
  bookId: 1,
  booksContents: {},
  fetchInProgress: false,
  fetchTimestamp: null,
  fetchBookId: null,
  fetchError: '',
};

const parseContent = content => content.split('\n\n');

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case eventBookIdChanged.type:
      return {
        ...state,
        bookId: action.payload.id,
        fetchError: '',
      };
    case eventFetchStarted.type:
    case eventFetchSucceeded.type:
    case eventFetchFailed.type:
    case eventFetchCanceled.type:
      return {
        ...state,
        booksContents:
          eventFetchSucceeded.type !== action.type
            ? state.booksContents
            : {
              ...state.booksContents,
              [state.fetchBookId]: parseContent(action.payload.content),
            },
        fetchInProgress: eventFetchStarted.type === action.type,
        fetchTimestamp:
          eventFetchStarted.type === action.type ? Date.now() : null,
        fetchBookId:
          eventFetchStarted.type === action.type ? state.bookId : null,
        fetchError:
          eventFetchFailed.type === action.type
            ? action.payload.errorMessage
            : '',
      };
    default:
      return state;
  }
};

export default ({ saga }) => {
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));
  sagaMiddleware.run(saga);
  return store;
};
