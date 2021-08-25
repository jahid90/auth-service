import request from 'supertest';

import ClientError from '../../src/errors/client-error';
import logger from '../../src/shared/logger';
import loginService from '../../src/services/login';

import app, { ExtendedError } from '../../src/server';

describe('Server tests', () => {

    beforeAll(() => {
        // disable logs
        logger.info = jest.fn();
        logger.warn = jest.fn();
        logger.error = jest.fn();

        loginService.validate = jest.fn().mockImplementation(() => {

            const err : ExtendedError = new ClientError('Bad Input', 400);
            err.level = 'error';
            err.requestId = 'a-request-id';
            err.timestamp = 'a time stamp';

            throw err;
        });
    });

    it('should sanitize errors before sending them to', async () => {

        const res = await request(app).post('/login').send({});

        expect(res.status).toBe(400);
        expect(res.body).toEqual({
            error: {
                message: 'Bad Input',
                status: 400,
            },
        });
    });
});
