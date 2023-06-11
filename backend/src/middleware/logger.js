import path from 'node:path';
import fs from 'node:fs';
import fsPromises from 'node:fs/promises';
import { randomUUID as uuid } from 'node:crypto';
import { format } from 'date-fns';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function logEvents(message, logFileName) {
  const dateTime = `${format(new Date(), 'dd/MM/yyyy HH:mm:ss')}`;
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

  try {
    if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
      await fsPromises.mkdir(path.join(__dirname, '..', 'logs'));
    }

    await fsPromises.appendFile(
      path.join(__dirname, '..', 'logs', logFileName),
      logItem
    );
  } catch (error) {
    console.log(error);
  }
}

export function logger(req, res, next) {
  logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, 'reqLog.log');

  next();
}
