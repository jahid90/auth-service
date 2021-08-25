import winston from 'winston';

// creates a new Winston Logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        // winston.format.errors({ stack: true }),
        winston.format.timestamp(),
        winston.format.colorize(),
        winston.format.simple(),
    ),
    transports: [
        new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
        }),
    ],
    exitOnError: false
});

export default logger;
