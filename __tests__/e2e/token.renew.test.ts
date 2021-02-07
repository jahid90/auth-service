import request from 'supertest';
import app from '../../src/Server';

describe('Test /token/renew', () => {
    const TOKEN_RENEWAL_ROUTE = '/token/renew';

    it('responds to post request', async () => {
        const res = await request(app).post(TOKEN_RENEWAL_ROUTE);

        expect(res.status).toBe(200);
        expect(res.body).toEqual({});
    });
});
