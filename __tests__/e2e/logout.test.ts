import request from 'supertest';
import jwt from 'jsonwebtoken';

import app from '../../src/server';
import logger from '../../src/shared/logger';
import User from '../../src/models/User';

describe('Test /logout', () => {
    const LOGOUT_ROUTE = '/logout';
    const SAMPLE_USER = {
        __id: 'dummy id',
        username: 'user',
        password: 'password',
        email: 'user@email.com',
        token: 'jwt token',
        createdAt: new Date().toISOString(),
        save: jest.fn(),
    };

    beforeAll(() => {
        // disable logs
        logger.info = jest.fn();
        logger.warn = jest.fn();
        logger.error = jest.fn();
    });

    it('should not allow request without authorisation header', async () => {
        const res = await request(app).post(LOGOUT_ROUTE);

        expect(res.status).toBe(403);
        expect(res.body).toEqual({
            error: {
                data: {
                    header: 'An authorization header must be provided',
                },
                message: 'Missing authorization header',
                status: 403,
            },
        });
    });

    it('should not allow request with empty authorisation header', async () => {
        const res = await request(app).delete(LOGOUT_ROUTE).set('Authorization', '').send();

        expect(res.status).toBe(403);
        expect(res.body).toEqual({
            error: {
                data: {
                    header: 'An authorization header must be provided',
                },
                message: 'Missing authorization header',
                status: 403,
            },
        });
    });

    it('should not allow request without proper authorisation header', async () => {
        const res = await request(app).delete(LOGOUT_ROUTE).set('Authorization', 'foo').send();

        expect(res.status).toBe(403);
        expect(res.body).toEqual({
            error: {
                data: {
                    header: 'Authorization header must be of the form <"Authorization: Bearer token">',
                },
                message: 'Bad authorization header',
                status: 403,
            },
        });
    });

    it('should not allow request with invalid token', async () => {
        const res = await request(app).delete(LOGOUT_ROUTE).set('Authorization', 'Bearer invalid-token').send();

        expect(res.status).toBe(403);
        expect(res.body).toEqual({
            error: {
                message: 'Token must be a valid jwt token',
                status: 403,
            },
        });
    });

    it('should allow request with valid token in authentication header', async () => {
        jwt.verify = jest.fn().mockReturnValue({ username: 'foo', email: 'foo', iat: 1, exp: 2 });
        User.findOne = jest.fn().mockResolvedValue(SAMPLE_USER);

        const res = await request(app).delete(LOGOUT_ROUTE).set('Authorization', 'Bearer valid-token').send();

        expect(res.status).toBe(204);
        expect(res.body).toEqual({});
    });

    it(
        'should allow request with valid token in authentication ' + 'header even if encoded user does not exist',
        async () => {
            jwt.verify = jest.fn().mockReturnValue({
                username: 'foo',
                email: 'foo',
                iat: 1,
                exp: 2,
            });
            User.findOne = jest.fn().mockResolvedValue(null);

            const res = await request(app).delete(LOGOUT_ROUTE).set('Authorization', 'Bearer valid-token').send();

            expect(res.status).toBe(204);
            expect(res.body).toEqual({});
        }
    );
});
