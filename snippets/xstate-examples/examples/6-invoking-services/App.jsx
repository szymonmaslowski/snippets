import { useMachine } from '@xstate/react';
import React, { useCallback, useRef } from 'react';
import fetchUserById from './fetchUserById';
import makeMachine from './machine';

const App = () => {
  const inputRef = useRef(null);
  const machine = makeMachine({ fetchUserById });
  const [state, send] = useMachine(machine);

  const triggerFetching = useCallback(() => {
    if (!inputRef.current) return;
    const userId = inputRef.current.value;

    send({ type: 'FETCH', userId });
  }, [inputRef, send]);

  const retry = useCallback(() => {
    send({ type: 'RETRY' });
  }, [send]);

  const tryAnotherUser = useCallback(() => {
    send({ type: 'ANOTHER_USER' });
  }, [send]);

  return (
    <div>
      {state.value === 'idle' && (
        <>
          <h3>Fetch user data by user id</h3>
          <input ref={inputRef} />
          <br />
          <button type={'button'} onClick={triggerFetching}>
            Fetch
          </button>
        </>
      )}
      {state.value === 'loading' && <h3>Loading..</h3>}
      {state.value === 'success' && (
        <>
          <h3>Received user data</h3>
          <pre>{JSON.stringify(state.context.userData, null, 2)}</pre>
          <button type={'button'} onClick={tryAnotherUser}>
            Try another user
          </button>
        </>
      )}
      {state.value === 'failure' && (
        <>
          <h3>Could not fetch data of user {state.context.userId}.</h3>
          <p>
            Received message: <strong>{state.context.error}</strong>
          </p>
          <button type={'button'} onClick={retry}>
            Retry
          </button>
          <button type={'button'} onClick={tryAnotherUser}>
            Try another user
          </button>
        </>
      )}
    </div>
  );
};

export default App;
