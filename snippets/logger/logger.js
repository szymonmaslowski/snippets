const disabledAll = process.env.LOGGER_DISABLE === 'true';
const disabledInfo = process.env.LOGGER_DISABLE_INFO === 'true';
const disabledError = process.env.LOGGER_DISABLE_ERROR === 'true';
const disabledDebug =
  process.env.LOGGER_DISABLE_DEBUG === 'true' ||
  process.env.NODE_ENV === 'production';

const colorRed = '\x1b[31m';
const colorBlue = '\x1b[34m';
const colorReset = '\x1b[0m';
const colorDefault = '\x1b[39m';

const makeMethod = ({ bracketsContent, disabled, color }) => (...messages) => {
  if (disabledAll || disabled) return;

  const message = messages.join(` ${color}`);
  const prefix = bracketsContent ? `[${bracketsContent}] ` : '';
  process.stdout.write(`${prefix}${color}${message}${colorReset}\n`);
};

const createLogger = name => ({
  info: makeMethod({ name, disable: disabledInfo, color: colorDefault }),
  error: makeMethod({ name, disable: disabledError, color: colorRed }),
  debug: makeMethod({ name, disable: disabledDebug, color: colorBlue }),
});

// exposing methods directly on the `createLogger`
Object.assign(createLogger, createLogger());

module.exports = createLogger;
