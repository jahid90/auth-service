import request from 'supertest';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import app from '../../src/server';
import User from '../../src/models/User';
import logger from '../../src/shared/logger';

describe('Test /register', () => {
    const REGISTER_ROUTE = '/register';
    const SAMPLE_USER = {
        __id: 'dummy id',
        username: 'user',
        password: 'password',
        email: 'user@email.com',
        token: 'dummy token',
        createdAt: new Date().toISOString(),
        save: jest.fn(),
    };

    beforeAll(() => {
        // disable logs
        logger.info = jest.fn();
        logger.warn = jest.fn();
        logger.err = jest.fn();

        jwt.sign = jest.fn().mockReturnValue('jwt token');
        bcrypt.hash = jest.fn().mockResolvedValue('encrypted passsword');
    });

    it('should not allow registration with missing credentials', async () => {
        const res = await request(app).post(REGISTER_ROUTE).send({
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
        });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({
            error: {
                message: 'Bad input',
                data: {
                    username: 'Username cannot be missing or empty',
                    email: 'Email cannot be missing or empty',
                    password:
                        'Passwords cannot be missing or empty and must match',
                },
                status: 400,
            },
        });
    });

    it('should not allow registration with missing email', async () => {
        const res = await request(app).post(REGISTER_ROUTE).send({
            username: 'user',
            email: '',
            password: 'pass',
            confirmPassword: 'pass',
        });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({
            error: {
                message: 'Bad input',
                data: {
                    email: 'Email cannot be missing or empty',
                },
                status: 400,
            },
        });
    });

    it('should not allow registration with mismatched passwords', async () => {
        User.findOne = jest.fn().mockResolvedValue(null);

        const res = await request(app).post(REGISTER_ROUTE).send({
            username: 'user',
            email: 'user@email.com',
            password: 'pass',
            confirmPassword: 'mismatch',
        });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({
            error: {
                message: 'Bad input',
                data: {
                    password:
                        'Passwords cannot be missing or empty and must match',
                },
                status: 400,
            },
        });
    });

    it('should not allow registration with existing user', async () => {
        User.findOne = jest.fn().mockResolvedValue(SAMPLE_USER);

        const res = await request(app).post(REGISTER_ROUTE).send({
            username: 'user',
            email: 'user@email.com',
            password: 'pass',
            confirmPassword: 'pass',
        });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({
            error: {
                message: 'Bad input',
                data: {
                    username: 'Username is already taken',
                },
                status: 400,
            },
        });
    });

    it('should allow registration with proper input', async () => {
        User.findOne = jest.fn().mockResolvedValue(null);
        User.create = jest.fn().mockResolvedValue(SAMPLE_USER);

        const res = await request(app).post(REGISTER_ROUTE).send({
            username: 'user',
            email: 'user@email.com',
            password: 'pass',
            confirmPassword: 'pass',
        });

        expect(res.status).toBe(201);
        expect(res.body).toEqual({ token: 'jwt token' });
        expect(res.body.token).toEqual('jwt token');
    });
});
