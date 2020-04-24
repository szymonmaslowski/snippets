const createCallbackChain = () => {
  let firstEyelet = () => {};
  let instance = null;

  const run = (...args) => {
    firstEyelet(...args, replacement => {
      firstEyelet = replacement;
    });
    return instance;
  };

  const append = callback => {
    let oldFirstEyelet = firstEyelet;
    const takeOutEyelet = replacement => {
      oldFirstEyelet = replacement;
    };

    firstEyelet = (...args) => {
      const [
        takeOutEyeletFromUpperCall = () => {},
        ...userArgsReversed
      ] = args.reverse();
      const removeEyelet = () => {
        takeOutEyeletFromUpperCall(oldFirstEyelet);
      };
      const userArgs = userArgsReversed.reverse();

      callback(...userArgs, removeEyelet);
      oldFirstEyelet(...userArgs, takeOutEyelet);
    };

    return instance;
  };

  instance = {
    run,
    append,
  };

  return instance;
};

export default createCallbackChain;
