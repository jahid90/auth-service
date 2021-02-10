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
        roles: ['role1', 'role2'],
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

    it('should not allow registration with incorrect input types', async () => {
        const res = await request(app)
            .post(REGISTER_ROUTE)
            .send({
                username: 1,
                email: 1.5,
                password: true,
                confirmPassword: true,
                roles: [9, 8, 7],
            });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({
            error: {
                message: 'Bad input',
                data: {
                    username:
                        'Username must be a string and cannot be missing or empty',
                    password:
                        'Passwords must be string and cannot be missing or empty and must match',
                    email:
                        'Email must be a string and cannot be missing or empty',
                },
                status: 400,
            },
        });
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
                    username:
                        'Username must be a string and cannot be missing or empty',
                    email:
                        'Email must be a string and cannot be missing or empty',
                    password:
                        'Passwords must be string and cannot be missing or empty and must match',
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
                    email:
                        'Email must be a string and cannot be missing or empty',
                },
                status: 400,
            },
        });
    });

    it('should not allow registration with bad email', async () => {
        const res = await request(app).post(REGISTER_ROUTE).send({
            username: 'user',
            email: 'not-an-email-address',
            password: 'pass',
            confirmPassword: 'pass',
        });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({
            error: {
                message: 'Bad input',
                data: {
                    email:
                        'Email must be a valid email address',
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
                        'Passwords must be string and cannot be missing or empty and must match',
                },
                status: 400,
            },
        });
    });

    it('should not allow registration with existing user', async () => {
        User.findOne = jest.fn().mockResolvedValue(SAMPLE_USER);

        const res = await request(app)
            .post(REGISTER_ROUTE)
            .send({
                username: 'user',
                email: 'user@email.com',
                password: 'pass',
                confirmPassword: 'pass',
                roles: ['role1', 'role2'],
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

        const res = await request(app)
            .post(REGISTER_ROUTE)
            .send({
                username: 'user',
                email: 'user@email.com',
                password: 'pass',
                confirmPassword: 'pass',
                roles: ['role1', 'role2'],
            });

        expect(res.status).toBe(201);
        expect(res.body).toEqual({
            accessToken: 'jwt token',
            refreshToken: 'jwt token',
        });
    });
});
