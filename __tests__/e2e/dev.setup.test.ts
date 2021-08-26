import request from 'supertest';

import app from '../../src/server';
import logger from '../../src/shared/logger';

describe('Test dev setup', () => {

    beforeAll(() => {
        // disable logs
        logger.debug = jest.fn();
        logger.info = jest.fn();
        logger.warn = jest.fn();
        logger.error = jest.fn();
    });

    it('should respond to ping', async () => {

        process.env = { ...process.env, NODE_ENV: 'development' };

        const res = await request(app).get('/ping');

        expect(res.status).toBe(200);
        expect(res.header['x-server-environment']).toEqual('Development');
        expect(res.text).toEqual('Ok');
    });
});
