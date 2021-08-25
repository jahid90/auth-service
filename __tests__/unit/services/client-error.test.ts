import { StatusCodes } from 'http-status-codes';
import ClientError from '../../../src/errors/client-error';

describe('ClientError Tests', () => {
    let error: ClientError;
    beforeEach(() => {
        error = new ClientError('test error');
    });

    it('should allow instantiation', () => {
        expect(error).toBeTruthy();
        expect(error.message).toEqual('test error');
    });

    it('should allow instantiation with a status code', () => {
        const error = new ClientError('test error', StatusCodes.CONFLICT);

        expect(error.message).toEqual('test error');
        expect(error.status).toBe(StatusCodes.CONFLICT);
    });

    it('should allow an error code to be set', () => {
        error.code = 1001;

        expect(error.code).toBe(1001);
    });

    it('should allow pushing a record to data', () => {
        error.push('some value');
        error.push('another');
        error.push('yet another');

        expect(error.data).toBeDefined();
        expect(error.data && error.data.length).toBe(3);
        expect(error.data && error.data).toEqual(['some value', 'another', 'yet another']);
    });

});
