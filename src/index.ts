import './pre-start'; // Must be the first import
import app from '@server';
import logger from '@shared/Logger';
import { mongo } from './config/secrets';

import mongoose from 'mongoose';

// Connect to mongo db
mongoose
    .connect(
        `mongodb://${mongo.user}:${mongo.password}@${mongo.host}:${mongo.port}/${mongo.database}`,
        {
            useNewUrlParser: true,
        }
    )
    .then(() => {

        logger.info('Connected to mongo db');

        // Start the server
        const port = Number(process.env.PORT || 3000);
        app.listen(port, () => {
            logger.info('Express server started on port: ' + port);
        });
    })
    .catch((err) => {
        logger.err('Failed to connect to mongo db');
        logger.err(err);
    });
