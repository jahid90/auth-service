import request from 'supertest';
import app from '../../src/Server';

describe('Test /token/validate', () => {
    const AUTHORISATION_ROUTE = '/token/validate';

    it('responds to post request', async () => {
        const res = await request(app).post(AUTHORISATION_ROUTE);

        expect(res.status).toBe(200);
        expect(res.body).toEqual({});
    });
});
