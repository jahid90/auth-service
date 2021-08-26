import request from 'supertest';
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
        logger.debug = jest.fn();
        logger.info = jest.fn();
        logger.warn = jest.fn();
        logger.error = jest.fn();

        bcrypt.hash = jest.fn().mockResolvedValue('encrypted passsword');
    });

    it('should not allow registration with missing input', async () => {
        const res = await request(app)
            .post(REGISTER_ROUTE)
            .send({});

        expect(res.status).toBe(400);
        expect(res.body).toEqual({
            error: {
                message: 'Bad Input',
                data: [
                    'username is missing or null',
                    'email is missing or null',
                    'password is missing or null',
                ],
                status: 400,
            },
        });
    });

    it('should not allow registration with incorrect input types', async () => {
        const res = await request(app)
            .post(REGISTER_ROUTE)
            .send({
                username: 1,
                email: 1.5,
                password: true,
                roles: [9, 8, 7],
            });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({
            error: {
                message: 'Bad Input',
                data: [
                    'username is not a string',
                    'email is not a string',
                    'password is not a string',
                ],
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
                message: 'Bad Input',
                data: [
                    'username is empty',
                    'email is empty',
                    'password is empty',
                ],
                status: 400,
            },
        });
    });

    it('should not allow registration with empty email', async () => {
        User.findOne = jest.fn().mockResolvedValue(null);
        const res = await request(app).post(REGISTER_ROUTE).send({
            username: 'foo',
            email: '',
            password: 'pass',
            confirmPassword: 'pass',
        });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({
            error: {
                message: 'Bad Input',
                data: [
                    'email is empty',
                ],
                status: 400,
            },
        });
    });

    it('should not allow registration with bad email', async () => {
        User.findOne = jest.fn().mockResolvedValue(null);

        const res = await request(app).post(REGISTER_ROUTE).send({
            username: 'foo',
            email: 'not-an-email-address',
            password: 'pass',
            confirmPassword: 'pass',
        });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({
            error: {
                message: 'Bad Input',
                data: [
                    'email is not valid',
                ],
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
                message: 'Bad Input',
                data: [
                    'username is already taken',
                ],
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
        expect(res.body).toEqual({});
    });
});
