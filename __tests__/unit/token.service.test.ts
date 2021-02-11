import jwt from 'jsonwebtoken';

import {
    generateAccessToken,
    generateRefreshToken,
    validateAccessToken,
    validateRefreshToken,
} from '../../src/services/token';

describe('Token service tests', () => {
    beforeAll(() => {
        jwt.sign = jest.fn().mockReturnValue('encoded token');
        jwt.verify = jest.fn().mockReturnValue({
            exp: 1612788528,
            iat: 1612702128,
            username: 'foo',
            email: 'foo@email.com',
        });
    });

    it('should generate access token', () => {
        const result = generateAccessToken({
            username: 'foo',
            email: 'foo@email.com',
        });

        expect(result).toEqual('encoded token');
    });

    it('should generate refresh token', () => {
        const result = generateRefreshToken({
            username: 'foo',
            email: 'foo@email.com',
        });

        expect(result).toEqual('encoded token');
    });

    it('should verify a valid access token', () => {
        const result = validateAccessToken('encoded token');

        expect(result).toEqual({
            exp: 1612788528,
            iat: 1612702128,
            username: 'foo',
            email: 'foo@email.com',
        });
    });

    it('should verify a valid refresh token', () => {
        const result = validateRefreshToken('encoded token');

        expect(result).toEqual({
            exp: 1612788528,
            iat: 1612702128,
            username: 'foo',
            email: 'foo@email.com',
        });
    });
});
