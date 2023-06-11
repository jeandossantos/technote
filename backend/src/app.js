import 'express-async-errors';
import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import cookieParser from 'cookie-parser';

import { routes } from './routes.js';
import { logEvents, logger } from '../middleware/logger.js';
import { errorHandler } from '../middleware/errorHandler.js';
import corsOptions from '../config/corOptions.js';
import { connectDb } from '../config/dbConnection.js';
import mongoose from 'mongoose';

await connectDb();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use(logger);
app.use('/', express.static(path.join(__dirname, '../public')));
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(helmet());
app.use(morgan('dev'));
app.use(routes);

// handle nonexisting routes
app.all('*', (req, resp) => {
  resp.status(404);

  if (req.accepts('html')) {
    return resp.sendFile(path.join(__dirname, '../views', '404.html'));
  } else if (req.accepts('json')) {
    return resp.json({ message: '404 Not Found.' });
  } else {
    return resp.type(txt).send('Not Found.');
  }
});

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB.');
});

mongoose.connection.on('error', (error) => {
  const { errno, code, syscall, hostname } = error;

  logEvents(`${errno}\t${code}\t${syscall}\t${hostname}`, 'mongoErrorLog.log');

  console.log(
    '🚀 ~ file: app.js:53 ~ mongoose.connection.on ~ error:\n',
    error
  );
});

app.use(errorHandler);

export { app };
