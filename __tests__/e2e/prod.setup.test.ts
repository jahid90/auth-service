import request from 'supertest';

process.env.NODE_ENV = 'production';

import app from '../../src/server';
import logger from '../../src/shared/logger';

describe('Test prod setup', () => {

    beforeAll(() => {
        // disable logs
        logger.debug = jest.fn();
        logger.info = jest.fn();
        logger.warn = jest.fn();
        logger.error = jest.fn();
    });

    it('should respond to ping', async () => {
        const res = await request(app).get('/ping');

        expect(res.status).toBe(200);
        expect(res.text).toEqual('Ok');
    });
});
