import './pre-start'; // Must be the first import
import app from './server';
import logger from './shared/logger';

import mongoose from 'mongoose';

// Extract configs from environment
const {
    MONGO_USER = 'auth',
    MONGO_PASSWORD = 'auth',
    MONGO_HOST = 'localhost',
    MONGO_PORT = '27017',
    MONGO_DATABASE = 'auth',
} = process.env;

// Connect to mongo db
mongoose
    .connect(
        `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABASE}`,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
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
