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
        logger.debug = jest.fn();
        logger.info = jest.fn();
        logger.warn = jest.fn();
        logger.error = jest.fn();
    });

    it('should not allow request without authorization header', async () => {
        const res = await request(app).delete(LOGOUT_ROUTE);

        expect(res.status).toBe(401);
        expect(res.body).toEqual({
            error: {
                status: 401,
                message: 'Are you logged in?',
                code: 4001,
                data: [
                    'Missing authorization header',
                ],
            },
        });
    });

    it('should not allow request with empty authorisztion header', async () => {
        const res = await request(app).delete(LOGOUT_ROUTE).set('Authorization', '').send();

        expect(res.status).toBe(401);
        expect(res.body).toEqual({
            error: {
                status: 401,
                message: 'Are you logged in?',
                code: 4001,
                data: [
                    'Missing authorization header',
                ],
            },
        });
    });

    it('should not allow request without proper authorization header', async () => {
        const res = await request(app).delete(LOGOUT_ROUTE).set('Authorization', 'foo').send();

        expect(res.status).toBe(401);
        expect(res.body).toEqual({
            error: {
                status: 401,
                message: 'Are you logged in?',
                code: 4001,
                data: [
                    'Bad authorization header',
                ],
            },
        });
    });

    it('should not allow request with invalid token', async () => {
        const res = await request(app).delete(LOGOUT_ROUTE).set('Authorization', 'Bearer invalid-token').send();

        expect(res.status).toBe(401);
        expect(res.body).toEqual({
            error: {
                message: 'Are you logged in?',
                status: 401,
                code: 4001,
                data: [
                    'Token must be a valid jwt token'
                ]
            },
        });
    });

    it('should not allow request with valid token in authentication header when encoded user does not exist',
        async () => {
            jwt.verify = jest.fn().mockReturnValue({
                username: 'foo',
                email: 'foo',
                iat: 1,
                exp: 2,
            });
            User.findOne = jest.fn().mockResolvedValue(null);

            const res = await request(app).delete(LOGOUT_ROUTE).set('Authorization', 'Bearer valid-token').send();

            expect(res.status).toBe(401);
            expect(res.body).toEqual({
                error: {
                    status: 401,
                    message: 'Are you logged in?',
                    code: 4001,
                    data: [
                        'Could not find user'
                    ]
                },

            });
        }
    );

    it('should allow request with valid token in authentication header', async () => {
        jwt.verify = jest.fn().mockReturnValue({ username: 'foo', email: 'foo', iat: 1, exp: 2 });
        User.findOne = jest.fn().mockResolvedValue(SAMPLE_USER);

        const res = await request(app).delete(LOGOUT_ROUTE).set('Authorization', 'Bearer valid-token').send();

        expect(res.status).toBe(204);
        expect(res.body).toEqual({});
    });

    it('should respond appropriately on server error', async () => {
        jwt.verify = jest.fn().mockReturnValue({ username: 'foo', email: 'foo', iat: 1, exp: 2 });
        User.findOne = jest.fn().mockResolvedValue(SAMPLE_USER);
        SAMPLE_USER.save = jest.fn().mockImplementationOnce(() => { throw new Error('cannot reach db'); });

        const res = await request(app).delete(LOGOUT_ROUTE).set('Authorization', 'Bearer valid-token').send();

        expect(res.status).toBe(500);
        expect(res.body).toEqual({
            error: {
                status: 500,
                message: 'Internal Server Error',
            }
        });
    });
});
