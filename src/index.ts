import './pre-start'; // Must be the first import

import app from './server';

import mongoose from 'mongoose';

// Extract configs from environment
const {
    MONGO_USER = 'auth',
    MONGO_PASSWORD = 'auth',
    MONGO_HOST = 'localhost',
    MONGO_PORT = '27017',
    MONGO_DATABASE = 'auth',
} = process.env;

const startUp = async () => {
    await mongoose.connect(`mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABASE}`);

    console.info('Connected to mongo db');

    // Start the server
    const port = Number(process.env.PORT || 3000);
    const server = app.listen(port, () => {
        console.info(`Express server started on port: ${port}`);
    });

    const handleShutdown = async (signal: string) => {
        const serverShutdown = () => {
            return new Promise((resolve, reject) => {
                server.close((err) => {
                    if (err) reject(err);
                    resolve('Done');
                });
            });
        };

        console.info(`Received signal: ${signal}`);

        await serverShutdown();
        console.info('Server successfully shut down');

        await mongoose.disconnect();
        console.info('Connection to db successfully disconnected');
    };

    // Attach shutdown listeners
    ['SIGINT', 'SIGTERM'].forEach((signal) => {
        process.on(signal, (sig) => {
            (async () => {
                try {
                    await handleShutdown(sig as string);
                } catch (err) {
                    console.error(err);
                    throw err;
                }
            })();
        });
    });
};

(async () => {
    try {
        await startUp();
    } catch (err) {
        console.error(err);
        throw err;
    }
})();
