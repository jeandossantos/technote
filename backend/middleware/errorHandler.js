//import { ZodError } from 'zod';
import { httpStatus } from '../src/httpStatus.js';
import { logEvents } from './logger.js';

export async function errorHandler(error, req, res, next) {
  // if (error instanceof ZodError) {
  //   return res.status(statusCodes.BAD_REQUEST).send('Internal Server Error');
  // }

  logEvents(
    `${error.name}\t${error.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
    'errorLog.log'
  );

  console.error(error.stack);

  return res
    .status(httpStatus.Internal_Server_Error)
    .send('Internal Server Error');
}
