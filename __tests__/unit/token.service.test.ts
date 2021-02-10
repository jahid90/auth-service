import jwt from 'jsonwebtoken';

import tokenService from '../../src/services/token';

describe('Token service tests', () => {
    beforeAll(() => {
        jwt.sign = jest.fn().mockReturnValue('encoded token');
        jwt.verify = jest
            .fn()
            .mockReturnValue({
                exp: 1612788528,
                iat: 1612702128,
                username: 'foo',
                email: 'foo@email.com',
            });
    });

    it('should generate token', () => {
        const result = tokenService.generate({
            username: 'foo',
            email: 'foo@email.com',
        });

        expect(result).toEqual('encoded token');
    });

    it('should generate token with provided secret', () => {
        const result = tokenService.generate({
            username: 'foo',
            email: 'foo@email.com',
        }, 'provided secret');

        expect(result).toEqual('encoded token');
    });

    it('should verify a valid token', () => {
        const result = tokenService.validate('encoded token');

        expect(result).toEqual({
            exp: 1612788528,
            iat: 1612702128,
            username: 'foo',
            email: 'foo@email.com',
        });
    });

    it('should verify a valid token with a provided secret', () => {
        const result = tokenService.validate('encoded token', 'provided secret');

        expect(result).toEqual({
            exp: 1612788528,
            iat: 1612702128,
            username: 'foo',
            email: 'foo@email.com',
        });
    });
});
