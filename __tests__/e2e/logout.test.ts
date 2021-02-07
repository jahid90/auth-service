import request from 'supertest';
import app from '../../src/Server';

describe('Test /logout', () => {
    const LOGOUT_ROUTE = '/logout';

    it('responds to post request', async () => {
        const res = await request(app).post(LOGOUT_ROUTE);

        expect(res.status).toBe(200);
        expect(res.body).toEqual({});
    });
});
