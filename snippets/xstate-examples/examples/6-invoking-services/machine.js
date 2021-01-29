import { assign, createMachine } from 'xstate';

const makeMachine = ({ fetchUserById }) =>
  createMachine(
    {
      initial: 'idle',
      context: {
        userId: undefined,
        userData: undefined,
        error: undefined,
      },
      states: {
        idle: {
          on: {
            FETCH: {
              target: 'loading',
              actions: assign({
                userId: (_, event) => event.userId,
              }),
            },
          },
        },
        loading: {
          invoke: {
            src: 'fetchUser',
            onDone: {
              target: 'success',
              actions: 'grabData',
            },
            onError: {
              target: 'failure',
              actions: 'grabError',
            },
          },
        },
        success: {
          on: {
            ANOTHER_USER: 'idle',
          },
        },
        failure: {
          on: {
            RETRY: 'loading',
            ANOTHER_USER: 'idle',
          },
        },
      },
    },
    {
      actions: {
        grabData: assign({
          userData: (context, event) => event.data,
        }),
        grabError: assign({
          error: (context, event) => event.data.message,
        }),
      },
      services: {
        fetchUser: ctx => fetchUserById(ctx.userId),
      },
    },
  );

export default makeMachine;
