import cookieParser from 'cookie-parser';
import express, { NextFunction, Request, Response } from 'express';
import requestIdGenerator from 'express-request-id';
import 'express-async-errors';
import helmet from 'helmet';
import morgan from 'morgan';

import BaseRouter from './routes';
import ClientError from './services/ClientError';
import ServerError from './services/ServerError';
import logger from './shared/logger';
import addRequestIdToRequest from './middlewares/addRequestIdToRequest';
import appendRequestIdToLog from './middlewares/appendRequestIdToLog';

const app = express();

/************************************************************************************
 *                              Set basic express settings
 ***********************************************************************************/

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(requestIdGenerator())
app.use(addRequestIdToRequest);
app.use(appendRequestIdToLog)
app.use(morgan(':method :url :status :http-version :res[content-length] (:response-time ms)',
        { stream: { write: (msg) => logger.info(msg.trim()) } }));

// Security
if (process.env.NODE_ENV === 'production') {
    app.use(helmet());
}

// Add APIs
app.use('/', BaseRouter);

type ExtendedError = (ClientError | ServerError) & {
    level?: string,
    timestamp?: string,
    requestId?: string
}

// Logger adds metadata to the passed in object before logging
const sanitize = (err: ExtendedError) =>  {
    err.level && delete err.level;
    err.requestId && delete err.requestId
    err.timestamp && delete err.timestamp

    return err;
}

// Print API errors
app.use(
    (
        err: ClientError | ServerError,
        _req: Request,
        res: Response,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _next: NextFunction
    ) => {
        logger.error(err);
        return res.status(err.status).send({ error: sanitize(err) });
    }
);

// Export express instance
export default app;
