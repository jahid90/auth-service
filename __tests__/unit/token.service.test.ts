import jwt from 'jsonwebtoken';

import logger from '../../src/shared/logger';

import {
    generateAccessToken,
    generateRefreshToken,
    validateAccessToken,
    validateRefreshToken,
} from '../../src/services/token';

describe('Token service tests', () => {
    beforeAll(() => {
        // disable logs
        logger.info = jest.fn();
        logger.warn = jest.fn();
        logger.err = jest.fn();

        jwt.sign = jest.fn().mockReturnValue('encoded token');
        jwt.verify = jest.fn().mockReturnValue({ username: 'foo' });
    });

    it('should generate an access token', () => {
        const result = generateAccessToken({
            username: 'foo',
            email: 'foo@email.com',
        });

        expect(result).toEqual('encoded token');
    });

    it('should generate a refresh token', () => {
        const result = generateRefreshToken({
            username: 'foo',
            email: 'foo@email.com',
        });

        expect(result).toEqual('encoded token');
    });

    it('should verify a valid access token', () => {
        const result = validateAccessToken('encoded token');

        expect(result).toEqual({ username: 'foo' });
    });

    it('should verify a valid refresh token', () => {
        const result = validateRefreshToken('encoded token');

        expect(result).toEqual({ username: 'foo' });
    });

    it('should throw when verifying an invalid access token', () => {
        jwt.verify = jest.fn().mockImplementation(() => {
            throw new Error('invalid');
        });

        expect(() => validateAccessToken('invalid token')).toThrowError();
    });

    it('should throw when verifying an invalid refresh token', () => {
        jwt.verify = jest.fn().mockImplementation(() => {
            throw new Error('invalid');
        });

        expect(() => validateRefreshToken('invalid token')).toThrowError();
    });
});
