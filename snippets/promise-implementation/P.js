const statusPending = 'pending';
const statusResolved = 'resolved';
const statusRejected = 'rejected';

const isPromise = p =>
  p &&
  ['then', 'catch'].every(methodName => typeof p[methodName] === 'function');

function P(resolver) {
  if (new.target !== P) {
    throw new TypeError(`${new.target} is not a promise`);
  }
  if (typeof resolver !== 'function') {
    throw new TypeError(`Promise resolver ${resolver} is not a function`);
  }

  let status = statusPending;
  let value = null;
  let anyCallbackReleased = false;
  const resolutionCallbacks = new Map([
    [statusResolved, new Set()],
    [statusRejected, new Set()],
  ]);

  const promiseBody = {
    get status() {
      return status;
    },
  };

  const releaseCallback = (fn, ...args) => {
    anyCallbackReleased = true;
    process.nextTick(() => {
      fn(...args);
    });
  };

  const releaseCallbacks = () => {
    if (status === statusPending) return;
    const callbacks = resolutionCallbacks.get(status);
    callbacks.forEach(callback => releaseCallback(callback, value));
    callbacks.clear();
  };

  const _reject = error => {
    if (status !== statusPending) return;
    value = error;
    status = statusRejected;
    releaseCallbacks();
    setTimeout(() => {
      if (anyCallbackReleased) return;
      process.emit('unhandledRejection', error, promiseBody);
    });
  };

  const _resolve = data => {
    if (status !== statusPending) return;

    if (isPromise(data)) {
      data
        .then(_resolve)
        // suppress 'unhandledRejection' event since promise here is internal
        .catch(() => {});
      data.catch(_reject);
      return;
    }
    value = data;
    status = statusResolved;
    releaseCallbacks();
  };

  const makeMethod = (makeHandlers) => callback =>
    new P((resolve, reject) => {
      const handlers = makeHandlers({ resolve, reject, callback });
      [statusRejected, statusResolved].forEach(s => {
        resolutionCallbacks.get(s).add(handlers[s]);
      });
      releaseCallbacks();
    });

  promiseBody.then = makeMethod(({ resolve, reject, callback }) => ({
    [statusResolved]: data => {
      try {
        const nextValue = callback(data);
        resolve(nextValue);
      } catch (e) {
        reject(e);
      }
    },
    [statusRejected]: error => {
      reject(error);
    },
  }));

  promiseBody.catch = makeMethod(({ resolve, reject, callback }) => ({
    [statusRejected]: error => {
      try {
        const nextValue = callback(error);
        resolve(nextValue);
      } catch (e) {
        reject(e);
      }
    },
    [statusResolved]: data => {
      resolve(data);
    },
  }));

  try {
    resolver(_resolve, _reject);
  } catch (e) {
    _reject(e);
  }

  return promiseBody;
}

P.resolve = value =>
  new P(resolve => {
    resolve(value);
  });
P.reject = error =>
  new P((_, reject) => {
    reject(error);
  });

module.exports = P;
