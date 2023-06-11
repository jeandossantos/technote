import { httpStatus } from '../constants.js';
import { CustomException } from '../exceptions/CustomException.js';
import { logEvents } from './logger.js';

export async function errorHandler(error, req, res, next) {
  if (error instanceof CustomException) {
    return res.status(error.code).json({
      message: error.message,
      code: error.code,
    });
  }

  logEvents(
    `${error.name}\t${error.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
    'errorLog.log'
  );

  console.error(error.stack);

  return res
    .status(httpStatus.INTERNAL_SERVER_ERROR)
    .send('Internal Server Error');
}
