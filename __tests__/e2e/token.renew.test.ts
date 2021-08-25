import jwt from 'jsonwebtoken';
import request from 'supertest';

import app from '../../src/server';
import logger from '../../src/shared/logger';
import User from '../../src/models/User';

describe('Test /renew', () => {
    const TOKEN_RENEWAL_ROUTE = '/renew';
    const SAMPLE_USER = {
        username: 'foo',
        email: 'foo@email.com',
        password: 'secret',
        roles: [],
        token: 'valid',
        tokenVersion: 4,
        save: jest.fn(),
    };

    beforeAll(() => {
        // disbale all logs
        logger.info = jest.fn();
        logger.warn = jest.fn();
        logger.error = jest.fn();
    });

    it('should not allow request without refresh token', async () => {
        const res = await request(app).post(TOKEN_RENEWAL_ROUTE);

        expect(res.status).toBe(403);
        expect(res.body).toEqual({
            error: {
                message: 'Bad authorization header',
                code: 4002,
                status: 403,
                data: {
                    header: 'Authorization header must be of the form <"Authorization: Bearer token">',
                },
            },
        });
    });

    it('should not allow request with invalid token', async () => {
        const res = await request(app).post(TOKEN_RENEWAL_ROUTE).set('Cookie', ['token=invalid']).send();

        expect(res.status).toBe(403);
        expect(res.body).toEqual({
            error: {
                message: 'Bad authorization header',
                status: 403,
                code: 4002,
                data: {
                    header: 'Authorization header must be of the form <"Authorization: Bearer token">',
                },
            },
        });
    });

    it('should not allow request when encoded user does not exist', async () => {
        jwt.verify = jest.fn().mockReturnValue({ username: 'foo' });
        User.findOne = jest.fn().mockResolvedValue(null);

        const res = await request(app).post(TOKEN_RENEWAL_ROUTE).set('Cookie', ['token=valid']).send();

        expect(res.status).toBe(403);
        expect(res.body).toEqual({
            error: {
                message: 'Could not find user',
                code: 4003,
                status: 403,
            },
        });
    });

    it('should not allow request when encoded token version is invalid', async () => {
        jwt.verify = jest.fn().mockReturnValue({ username: 'foo', tokenVersion: 2 });
        User.findOne = jest.fn().mockResolvedValue(SAMPLE_USER);

        const res = await request(app).post(TOKEN_RENEWAL_ROUTE).set('Cookie', ['token=valid']).send();

        expect(res.status).toBe(403);
        expect(res.body).toEqual({
            error: {
                message: 'Are you logged in?',
                code: 4001,
                status: 403,
            },
        });
    });

    it('should allow request with valid token', async () => {
        jwt.verify = jest.fn().mockReturnValue({ username: 'foo', tokenVersion: 4 });
        jwt.sign = jest.fn().mockReturnValue('new valid token');
        User.findOne = jest.fn().mockResolvedValue(SAMPLE_USER);

        const res = await request(app).post(TOKEN_RENEWAL_ROUTE).set('Cookie', ['token=valid']).send();

        expect(res.status).toBe(201);
        expect(res.body).toEqual({
            accessToken: 'new valid token',
        });
    });
});
