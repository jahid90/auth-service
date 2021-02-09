import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';

import BaseRouter from './routes';
import logger from './shared/logger';
import ClientError from './services/ClientError';
import ServerError from './services/ServerError';

const app = express();

/************************************************************************************
 *                              Set basic express settings
 ***********************************************************************************/

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
    morgan(
        '[:date[iso]] :method :url :status :http-version ' +
            ':res[content-length] (:response-time ms)'
    )
);

// Security
if (process.env.NODE_ENV === 'production') {
    app.use(helmet());
}

// Add APIs
app.use('/', BaseRouter);

// Print API errors
app.use(
    (
        err: ClientError | ServerError,
        _req: Request,
        res: Response,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _next: NextFunction
    ) => {
        logger.err(err, true);
        return res
            .status(err.status)
            .send({ error: err });
    }
);

// Export express instance
export default app;
