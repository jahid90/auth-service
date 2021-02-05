import request from 'supertest';
import app from '../src/Server';

describe('Test /authenticate', () => {

    const AUTHENTICATION_ROUTE = '/authenticate';

    it('responds to post request', async () => {
        const res = await request(app)
                        .post(AUTHENTICATION_ROUTE);

        expect(res.status).toBe(200);
        expect(res.body).toEqual({});
    });
});
