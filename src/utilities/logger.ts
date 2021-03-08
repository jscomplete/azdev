import chalk from 'chalk';
import util from 'util';

const pp = (chalkMethod = chalk.cyan, consoleMethod = console.log) => (
  ...args
) =>
  consoleMethod(
    '⚡',
    ...args.map((arg) =>
      chalkMethod(
        typeof arg === 'string'
          ? arg
          : util.inspect(arg, { breakLength: Infinity }),
      ),
    ),
  );

const logger = pp(chalk.gray);

function isObject(val) {
  return val != null && typeof val === 'object' && Array.isArray(val) === false;
}

function sanitizeObject(obj, { maxStringLength = 30 } = {}) {
  const newObj = {};
  Object.entries(obj).forEach(([key, value]) => {
    if (key.match(/(password|passwd)/)) {
      value = '*******';
    }
    if (typeof value === 'string' && value.length > 30) {
      value = value.slice(0, maxStringLength) + '...';
    }
    if (isObject(value)) {
      value = sanitizeObject(value);
    }
    newObj[key] = value;
  });
  return newObj;
}

const morganString = (tokens, req, res) => {
  const chalker = tokens.status(req, res) > 400 ? chalk.red : chalk.gray;
  return chalker(
    '>>',
    chalk.bold(tokens.method(req, res), tokens.url(req, res)),
    '| Status:',
    chalk.bold(tokens.status(req, res)),
    '| Length:',
    chalk.bold(tokens.res(req, res, 'content-length')),
    '| Time:',
    chalk.bold(tokens['response-time'](req, res), 'ms'),
  );
};

const printParams = (req, res, next) => {
  const params = sanitizeObject({ ...req.body, ...req.params });
  if (Object.keys(params).length > 0) {
    logger('Params: ', params);
  }
  next();
};

const printBasicReq = (req, res, next) => {
  logger(`${req.method} ${req.url}`);
  next();
};

export { logger, printBasicReq, morganString, printParams, sanitizeObject };
