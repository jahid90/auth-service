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
        logger.debug = jest.fn();
        logger.info = jest.fn();
        logger.warn = jest.fn();
        logger.error = jest.fn();
    });

    it('should not allow request without refresh token', async () => {
        const res = await request(app).post(TOKEN_RENEWAL_ROUTE);

        expect(res.status).toBe(403);
        expect(res.body).toEqual({
            error: {
                status: 403,
                message: 'Not Authorized',
                data: [
                    'Bad authorization header',
                ],
            },
        });
    });

    it('should not allow request with invalid token', async () => {
        const res = await request(app).post(TOKEN_RENEWAL_ROUTE).set('Cookie', 'token=invalid').send();

        expect(res.status).toBe(403);
        expect(res.body).toEqual({
            error: {
                message: 'Not Authorized',
                status: 403,
                data: [
                    'Bad authorization header',
                ],
            },
        });
    });

    it('should not allow request when encoded user does not exist', async () => {
        jwt.verify = jest.fn().mockReturnValue({ username: 'foo' });
        User.findOne = jest.fn().mockResolvedValue(null);

        const res = await request(app).post(TOKEN_RENEWAL_ROUTE).set('Cookie', 'token=valid').send();

        expect(res.status).toBe(403);
        expect(res.body).toEqual({
            error: {
                status: 403,
                message: 'Not Authorized',
                data: [
                    'Could not find user'
                ]
            },
        });
    });

    it('should not allow request when encoded token version is invalid', async () => {
        jwt.verify = jest.fn().mockReturnValue({ username: 'foo', tokenVersion: 2 });
        User.findOne = jest.fn().mockResolvedValue(SAMPLE_USER);

        const res = await request(app).post(TOKEN_RENEWAL_ROUTE).set('Cookie', 'token=valid').send();

        expect(res.status).toBe(403);
        expect(res.body).toEqual({
            error: {
                status: 403,
                message: 'Not Authorized',
                data: [
                    'Are you logged in?'
                ]
            },
        });
    });

    it('should allow request with valid token', async () => {
        jwt.verify = jest.fn().mockReturnValue({ username: 'foo', tokenVersion: 4 });
        jwt.sign = jest.fn().mockReturnValue('new valid token');
        User.findOne = jest.fn().mockResolvedValue(SAMPLE_USER);

        const res = await request(app).post(TOKEN_RENEWAL_ROUTE).set('Cookie', 'token=valid').send();

        expect(res.status).toBe(201);
        expect(res.body).toEqual({
            accessToken: 'new valid token',
        });
    });
});
