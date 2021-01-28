import { useMachine } from '@xstate/react';
import React from 'react';
import Light from './Light';
import machine from './machine';

const App = () => {
  const logContext = ctx => console.info('Context', ctx);
  const logInitializing = () => console.info('Initializing');

  const [state, send] = useMachine(machine, {
    actions: { logContext, logInitializing },
  });

  return (
    <>
      <div>
        <Light color="red" fired={state.context.red} />
        <Light color="yellow" fired={state.context.yellow} />
        <Light color="green" fired={state.context.green} />
      </div>
      <button type={'button'} onClick={() => send('RESET')}>
        reset
      </button>
      <button type={'button'} onClick={() => send('BREAK')}>
        break
      </button>
    </>
  );
};

export default App;
