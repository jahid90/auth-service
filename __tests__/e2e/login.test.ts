import bcrypt from 'bcrypt';
import request from 'supertest';
import jwt from 'jsonwebtoken';

import app from '../../src/server';
import logger from '../../src/shared/logger';
import User from '../../src/models/User';

describe('Test /login', () => {
    const LOGIN_ROUTE = '/login';
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

        jwt.sign = jest.fn().mockReturnValue('jwt token');
        bcrypt.compare = jest.fn().mockImplementation((password: string, hash: string) => {
            return password === hash;
        });
    });

    it('should not allow login with missing credentials', async () => {
        User.findOne = jest.fn().mockResolvedValue(SAMPLE_USER);

        const res = await request(app).post(LOGIN_ROUTE).send({});

        expect(res.status).toBe(400);
        expect(res.body).toEqual({
            error: {
                status: 400,
                message: 'Bad Input',
                data: [
                    'username is missing or null',
                    'password is missing or null',
                ]
            },
        });
    });

    it('should not allow login with missing password', async () => {
        User.findOne = jest.fn().mockResolvedValue(SAMPLE_USER);

        const res = await request(app).post(LOGIN_ROUTE).send({ username: 'user' });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({
            error: {
                status: 400,
                message: 'Bad Input',
                data: [
                    'password is missing or null',
                ]
            },
        });
    });

    it('should not allow login with empty credentials', async () => {
        const res = await request(app).post(LOGIN_ROUTE).send({
            username: '',
            email: '',
            password: '',
        });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({
            error: {
                status: 400,
                message: 'Bad Input',
                data: [
                    'username is empty',
                    'password is empty',
                ]
            },
        });
    });

    it('should not allow login with invalid username', async () => {
        User.findOne = jest.fn().mockResolvedValue(null);

        const res = await request(app).post(LOGIN_ROUTE).send({
            username: 'not a valid user',
            password: 'password',
        });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({
            error: {
                message: 'Incorrect Credentials',
                status: 400,
            },
        });
    });

    it('should not allow login with invalid password', async () => {
        User.findOne = jest.fn().mockResolvedValue(SAMPLE_USER);

        const res = await request(app).post(LOGIN_ROUTE).send({
            username: 'user',
            password: 'not a valid password',
        });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({
            error: {
                message: 'Incorrect Credentials',
                status: 400,
            },
        });
    });

    it('should allow login with correct username and password', async () => {
        User.findOne = jest.fn().mockResolvedValue(SAMPLE_USER);

        const res = await request(app).post(LOGIN_ROUTE).send({
            username: 'user',
            password: 'password',
        });

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ accessToken: 'jwt token' });
    });
});
