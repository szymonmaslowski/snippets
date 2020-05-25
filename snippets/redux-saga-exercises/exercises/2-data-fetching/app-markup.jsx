import React, { useCallback, useEffect, useState } from 'react';
import {
  eventBookIdChanged,
  eventContentRequested,
  selectViewData,
} from './store';

const BookIdInput = ({ value, onChange }) => {
  const onChangeCallback = useCallback(
    e => {
      onChange(e.target.value);
    },
    [onChange],
  );
  return <input value={value} type={'number'} onChange={onChangeCallback} />;
};

const Loader = ({ fetchTimestamp }) => {
  const [time, setTime] = useState(0);
  useEffect(() => {
    const intervalId = setInterval(() => {
      const seconds = (Date.now() - fetchTimestamp) / 1000;
      setTime(seconds);
    }, 100);
    return () => {
      clearInterval(intervalId);
    };
  }, [fetchTimestamp]);
  return <h2>Loading ({time}s)</h2>;
};

const Error = ({ message }) => <h2 style={{ color: 'red' }}>{message}</h2>;

const App = ({
  bookId,
  content,
  fetchInProgress,
  fetchTimestamp,
  fetchError,
  onBookIdChange,
  onFetchRequest,
}) => (
  <div>
    <form>
      Book id <BookIdInput value={bookId} onChange={onBookIdChange} />
      <button type={'button'} onClick={onFetchRequest}>
        Get content
      </button>
    </form>
    <hr />
    {fetchInProgress && <Loader fetchTimestamp={fetchTimestamp} />}
    {!fetchInProgress && fetchError && <Error message={fetchError} />}
    {!fetchInProgress
      && Boolean(content.length)
      && content.map(paragraph => <p>{paragraph}</p>)}
    {!fetchInProgress
      && !content.length
      && <p>No book content.</p>}
  </div>
);

const Subscribe = ({ store, children }) => {
  const [state, setState] = useState(store.getState());
  useEffect(() => {
    store.subscribe(() => setState(store.getState()));
  }, []);
  return children(state);
};

const makeAppMarkup = store => (
  <Subscribe store={store}>
    {state => {
      const {
        bookId,
        content,
        fetchInProgress,
        fetchTimestamp,
        fetchError,
      } = selectViewData(state);
      return (
        <App
          bookId={bookId}
          content={content}
          fetchInProgress={fetchInProgress}
          fetchTimestamp={fetchTimestamp}
          fetchError={fetchError}
          onBookIdChange={id => {
            store.dispatch(eventBookIdChanged(id));
          }}
          onFetchRequest={() => {
            store.dispatch(eventContentRequested());
          }}
        />
      );
    }}
  </Subscribe>
);

export default makeAppMarkup;
