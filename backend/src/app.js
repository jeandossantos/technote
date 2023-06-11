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
import mongoose from 'mongoose';

import { logEvents, logger } from './middleware/logger.js';
import corsOptions from './config/corOptions.js';
import { connectDb } from './config/dbConnection.js';
import { rootRoutes } from './routes/root.js';
import { userRoutes } from './routes/userRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { noteRoutes } from './routes/noteRoutes.js';

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
app.use(rootRoutes);
app.use('/users', userRoutes);
app.use('/notes', noteRoutes);

// handle nonexisting routes
app.all('*', (req, resp) => {
  resp.status(404);

  if (req.accepts('html')) {
    return resp.sendFile(path.join(__dirname, 'views', '404.html'));
  } else if (req.accepts('json')) {
    return resp.json({ message: '404 Not Found.' });
  } else {
    return resp.type(txt).send('Not Found.');
  }
});

app.use(errorHandler);

export { app };
