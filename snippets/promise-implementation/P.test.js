const scheduler = require('@snippets/scheduler');
const assert = require('assert');
const P = require('./P');
const { postponeDone } = require('./test-utils');

const originalPromise = process.env.ORIGINAL_PROMISE === 'true';

const ThePromise = originalPromise ? Promise : P;
const description = originalPromise ? 'Original Promise' : 'P';

const doAssertion = (done, expected, received) => {
  try {
    assert.strictEqual(expected, received);
    done();
  } catch (e) {
    done(e);
  }
};

const assertPromiseObject = promise => {
  assert.deepStrictEqual(typeof promise.then, 'function');
  assert.deepStrictEqual(typeof promise.catch, 'function');
};

describe(description, () => {
  afterEach(async () => {
    await scheduler.run();
  });

  it('throws when calling without "new"', () => {
    try {
      ThePromise();
    } catch (e) {
      assert.strictEqual(e instanceof TypeError, true);
      assert.strictEqual(e.message, 'undefined is not a promise');
      return;
    }
    throw new Error('Expression supposed to throw');
  });

  it('creates promise object', () => {
    const promise = new ThePromise(() => {});
    assertPromiseObject(promise);
  });

  it('calls resolver callback synchronously', () => {
    let calls = 0;
    // eslint-disable-next-line no-new
    new ThePromise(() => {
      calls += 1;
    });
    assert.strictEqual(calls, 1);
  });

  it('throws when provided resolver is not a function', () => {
    try {
      // eslint-disable-next-line no-new
      new ThePromise();
    } catch (e) {
      assert.strictEqual(e instanceof TypeError, true);
      assert.strictEqual(
        e.message,
        'Promise resolver undefined is not a function',
      );
      return;
    }
    throw new Error('Expression supposed to throw');
  });

  // eslint-disable-next-line mocha/no-setup-in-describe
  ['resolve', 'reject'].forEach(methodName => {
    it(`exposes ${methodName} method which creates a promise`, () => {
      assert.deepStrictEqual(typeof ThePromise[methodName], 'function');
      const promise = ThePromise[methodName]();
      assertPromiseObject(promise);
    });
  });

  it(
    `executes then's callback with correct value for promise created with resolve method`,
    postponeDone(done => {
      const theValue = 'The Value';
      ThePromise.resolve(theValue).then(value => {
        doAssertion(done, theValue, value);
      });
    }),
  );

  it(
    `executes catch's callback with correct error for promise created with reject method`,
    postponeDone(done => {
      const theError = new Error('The Error');
      ThePromise.reject(theError).catch(error => {
        doAssertion(done, theError, error);
      });
    }),
  );

  it(
    `executes catch's callback with correct error if an error has been thrown in the resolver`,
    postponeDone(done => {
      const theError = new Error('Error');
      new ThePromise(() => {
        throw theError;
      }).catch(error => {
        doAssertion(done, theError, error);
      });
    }),
  );

  it(
    `executes catch's callback with correct error if an error has been thrown in the then's callback`,
    postponeDone(done => {
      const theError = new Error('Error');
      ThePromise.resolve()
        .then(() => {
          throw theError;
        })
        .catch(error => {
          doAssertion(done, theError, error);
        });
    }),
  );

  it(
    `executes catch's callback with correct error if an error has been thrown in the catch's callback`,
    postponeDone(done => {
      const theError = new Error('Error');
      ThePromise.reject()
        .catch(() => {
          throw theError;
        })
        .catch(error => {
          doAssertion(done, theError, error);
        });
    }),
  );

  it(
    `executes then's callback with correct value if providing not a rejected promise to the resolve function`,
    postponeDone(done => {
      const theValue = 'NOT A REJECTED PROMISE';
      ThePromise.resolve(theValue).then(value => {
        doAssertion(done, theValue, value);
      });
    }),
  );

  it(
    `executes then's callback with correct value if returning not a rejected promise from then's callback`,
    postponeDone(done => {
      ThePromise.resolve()
        .then(() => 'NOT A REJECTED PROMISE')
        .then(value => {
          doAssertion(done, 'NOT A REJECTED PROMISE', value);
        });
    }),
  );

  it(
    `executes then's callback with correct value if returning not a rejected promise from catch's callback`,
    postponeDone(done => {
      ThePromise.reject()
        .catch(() => 'NOT A REJECTED PROMISE')
        .then(value => {
          doAssertion(done, 'NOT A REJECTED PROMISE', value);
        });
    }),
  );

  it(
    `executes catch's callback with correct error if providing rejected promise to resolve function`,
    postponeDone(done => {
      const handler = () => {};
      process.on('unhandledRejection', handler);
      scheduler.add(() => {
        process.off('unhandledRejection', handler);
      });

      const theError = new Error('The Error');
      const promise = ThePromise.resolve(ThePromise.reject(theError));

      promise.then(() => {
        done(new Error('The promise got resolved while it should not'));
      });
      promise.catch(e => {
        doAssertion(done, theError, e);
      });
    }),
  );

  it(
    `executes catch's callback with correct error if returning rejected promise from then's callback`,
    postponeDone(done => {
      const handler = () => {};
      process.on('unhandledRejection', handler);
      scheduler.add(() => {
        process.off('unhandledRejection', handler);
      });

      const theError = new Error('The Error');
      const promise = ThePromise.resolve().then(() =>
        ThePromise.reject(theError),
      );

      promise.then(() => {
        done(new Error('The promise got resolved while it should not'));
      });
      promise.catch(e => {
        doAssertion(done, theError, e);
      });
    }),
  );

  it(
    `executes catch's callback with correct error if returning rejected promise from catch's callback`,
    postponeDone(done => {
      const handler = () => {};
      process.on('unhandledRejection', handler);
      scheduler.add(() => {
        process.off('unhandledRejection', handler);
      });

      const theError = new Error('The Error');
      const promise = ThePromise.reject().catch(() =>
        ThePromise.reject(theError),
      );
      promise.then(() => {
        done(new Error('The promise got resolved while it should not'));
      });
      promise.catch(e => {
        doAssertion(done, theError, e);
      });
    }),
  );

  it(
    `executes then's callback with correct value if providing resolved promise to the resolve function`,
    postponeDone(done => {
      ThePromise.resolve(ThePromise.resolve('value')).then(value => {
        doAssertion(done, 'value', value);
      });
    }),
  );

  it(
    `executes then's callback with correct value if returning resolved promise from then's callback`,
    postponeDone(done => {
      ThePromise.resolve()
        .then(() => ThePromise.resolve('value'))
        .then(value => {
          doAssertion(done, 'value', value);
        });
    }),
  );

  it(
    `executes then's callback with correct value if returning resolved promise from catch's callback`,
    postponeDone(done => {
      ThePromise.reject()
        .catch(() => ThePromise.resolve('value'))
        .then(value => {
          doAssertion(done, 'value', value);
        });
    }),
  );

  it(
    `executes catch's callback with correct value provided to reject function`,
    postponeDone(done => {
      const theValue = ThePromise.reject(new Error('The Error'));
      // prevent emitting "unhandledRejection" event
      theValue.catch(() => {});
      ThePromise.reject(theValue).catch(value => {
        doAssertion(done, theValue, value);
      });
    }),
  );

  it(
    'emits "unhandledRejection" event when no catch callback attached',
    postponeDone(done => {
      const theError = new Error('Error');
      let thePromise = null;
      const handler = (reason, promise) => {
        try {
          assert.strictEqual(reason, theError);
          assert.strictEqual(promise, thePromise);
          done();
        } catch (e) {
          done(e);
        }
      };
      process.on('unhandledRejection', handler);
      scheduler.add(() => {
        process.off('unhandledRejection', handler);
      });
      thePromise = new ThePromise((_, reject) => reject(theError));
    }),
  );

  it(
    'does not emit "unhandledRejection" event when catch callback is attached',
    postponeDone(done => {
      let timeoutId = null;
      const handler = () => {
        clearTimeout(timeoutId);
        done(new Error('Unnecessary "unhandledRejection" event'));
      };
      process.on('unhandledRejection', handler);
      scheduler.add(() => {
        process.off('unhandledRejection', handler);
      });
      new ThePromise((_, reject) => reject(new Error('Error'))).catch(() => {});
      timeoutId = setTimeout(() => {
        done();
      });
    }),
  );

  it(
    'a',
    postponeDone(done => {
      const handler = (_, b) => {
        console.info('UNHANDLED REJECTION', p === b);
      };
      process.on('unhandledRejection', handler);
      scheduler.add(() => {
        process.off('unhandledRejection', handler);
      });

      const p = ThePromise.reject();
      ThePromise.reject().catch(() => {
        console.info(2);
      });
      new ThePromise((_, reject) => {
        setTimeout(() => {
          reject();
        });
      }).catch(() => {
        console.info(1);
      });
      setTimeout(() => {
        console.info('ATTACHING');
        p.catch(() => {
          console.info(3);
        });
      });
      console.info(0);
      setTimeout(done, 600);

      const theError = new Error('The Error');
      const promise = ThePromise.reject().catch(() =>
        ThePromise.reject(theError),
      );
      promise.then(() => {
        done(new Error('The promise got resolved while it should not'));
      });
      promise.catch(e => {
        doAssertion(done, theError, e);
      });
    }),
  );
});
