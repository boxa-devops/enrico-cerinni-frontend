const isDev = process.env.NODE_ENV !== 'production';

const noop = () => {};

export const logger = {
  debug: isDev ? console.debug.bind(console) : noop,
  info: isDev ? console.info.bind(console) : noop,
  warn: console.warn.bind(console),
  error: console.error.bind(console),
  log: isDev ? console.log.bind(console) : noop,
};

export default logger;


