import request from 'supertest';

process.env.NODE_ENV = 'production';

import app from '../../src/Server';

describe('Test prod setup', () => {
    it('should respond to ping', async () => {
        const res = await request(app).get('/ping');

        expect(res.status).toBe(200);
        expect(res.text).toEqual('Ok');
    });
});
