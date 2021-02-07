import jwt from 'jsonwebtoken';

import tokenService from '../../src/services/token';

describe('Token service tests', () => {

    beforeAll(() => {
        jwt.sign = jest.fn().mockReturnValue('encoded token');
        jwt.verify = jest.fn().mockReturnValue({exp: 1612788528, iat: 1612702128, id: 1});
    });

    it('should generate token', () => {
        const result = tokenService.generate({ id: 1 });

        expect(result).toEqual('encoded token');
    });

    it('should verify a valid token', () => {
        const result = tokenService.validate('encoded token');

        expect(result).toEqual({exp: 1612788528, iat: 1612702128, id: 1});
    });
});
