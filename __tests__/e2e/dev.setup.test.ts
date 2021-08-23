import request from 'supertest';

process.env.NODE_ENV = 'development';

import app from '../../src/server';
import logger from '../../src/shared/logger';

describe('Test dev setup', () => {

    beforeAll(() => {
        // disable logs
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
