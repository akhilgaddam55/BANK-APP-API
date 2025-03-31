/* eslint-disable no-unused-vars */
import morgan from 'morgan';
import { token } from 'morgan';
import { transports as _transports, format as _format, createLogger } from 'winston';

const { File } = _transports;
const { combine, timestamp, json, errors } = _format;

import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const logDir = 'logs'; // directory path you want to set
if (!existsSync(logDir)) {
  // Create the directory if it does not exist
  mkdirSync(logDir);
}

const logger = createLogger({
  level: 'http',
  format: combine(
    timestamp({
      format: 'YYYY-MM-DD hh:mm:ss.SSS A',
    }),
    json(),
  ),
  transports: [new File({
    filename: join(logDir, '/requests.log'),
    level: 'http',
    format: combine(
      errors({ stack: true }),
      timestamp({
        format: 'DD-MMM-YYYY hh:mm:ss.SSS A',
      }),
      json(),
    ),
  })],
});

token('host', (req, res) => req.hostname);

const morganMiddleware = morgan(
  (tokens, req, res) => JSON.stringify({
    method: tokens.method(req, res),
    url: tokens.url(req, res),
    status: Number.parseFloat(tokens.status(req, res)),
    content_length: tokens.res(req, res, 'content-length'),
    response_time: Number.parseFloat(tokens['response-time'](req, res)),
    hostname: tokens.host(req, res),
  }),
  {
    stream: {
      // Configure Morgan to use our custom logger with the http severity
      write: (message) => {
        const data = JSON.parse(message);
        logger.http('incoming request: ', data);
      },
    },
  },
);

export default morganMiddleware;
