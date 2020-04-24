import createChain from './index';

describe('callback-chain', () => {
  let chain;

  beforeEach(() => {
    chain = createChain();
  });

  test('produces chain object with "run" and "append" properties', () => {
    expect(chain).toHaveProperty('run', expect.any(Function));
    expect(chain).toHaveProperty('append', expect.any(Function));
  });
  test('executes appended callback after run method gets fired', () => {
    let executed = false;
    chain.append(() => {
      executed = true;
    });
    chain.run();
    expect(executed).toBe(true);
  });
  test('supports chaining methods', () => {
    expect(() => {
      chain
        .append(() => {})
        .append(() => {})
        .run()
        .append(() => {})
        .run()
        .run();
    }).not.toThrow();
  });
  test('passes to the appended callbacks all arguments provided to the run method in correct order', () => {
    const arg1 = {};
    const arg2 = {};
    chain
      .append((...args) => {
        expect(args).toContain(arg1, arg2, expect.any(Function));
      })
      .run(arg1, arg2);
  });
  test('invokes appended callbacks in the correct order', () => {
    const calls = new Set();
    chain
      .append(() => {
        calls.add(1);
      })
      .append(() => {
        calls.add(2);
      })
      .run();
    expect(calls).toEqual(new Set([2, 1]));
  });
  test('invokes callbacks that has been appended later', () => {
    const mock = jest.fn();
    chain
      .run()
      .append(mock)
      .run();
    expect(mock).toHaveBeenCalledTimes(1);
  });
  test("doesn't invoke the callback again if it requested removal from the chain", () => {
    const mock = jest.fn().mockImplementation(removeEyelet => {
      removeEyelet();
    });
    chain
      .append(mock)
      .run()
      .run();
    expect(mock).toHaveBeenCalledTimes(1);
  });
});
