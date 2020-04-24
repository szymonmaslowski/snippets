const createCallbackChain = () => {
  let firstEyelet = () => {};

  const run = (...args) =>
    firstEyelet(...args, replacement => {
      firstEyelet = replacement;
    });

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
  };

  return {
    run,
    append,
  };
};

export default createCallbackChain;
