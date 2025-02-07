import { jest } from '@jest/globals';
import Crypto from 'crypto';

import {
    getCodeForScope,
    getNonceFromCode,
    checkCode,
    getScopesFromCode,
} from './codeManagement';

describe('getCodeForScope', () => {
    beforeEach(() => {
        jest.spyOn(Crypto, 'randomBytes').mockReturnValue(
            'abcdefghijkl012345678901'
        );
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('should return a valid code for the given parameters', () => {
        const scopesStr = 'openid profile';
        const redirectUri = 'http://localhost:5173';
        const clientId = 'relying_party';
        const nonce = 'my_nonce';
        const includeRedirectUriInHash = true;
        const includeClientIdInHash = true;

        const code = getCodeForScope(
            scopesStr,
            redirectUri,
            clientId,
            nonce,
            includeRedirectUriInHash,
            includeClientIdInHash
        );

        expect(code).toBe(
            'abcdefghijkl01234567890103my_nonceiH31NNyAy5f8IAMkaWrf2OdSVA5deqtqjq6KJ04dl0g='
        );
    });
    test('should return a valid code for the given parameters (no nonce)', () => {
        const scopesStr = 'openid profile';
        const redirectUri = 'http://localhost:5173';
        const clientId = 'relying_party';
        const includeRedirectUriInHash = true;
        const includeClientIdInHash = true;

        const code = getCodeForScope(
            scopesStr,
            redirectUri,
            clientId,
            undefined,
            includeRedirectUriInHash,
            includeClientIdInHash
        );

        expect(code).toBe(
            'abcdefghijkl01234567890103l0sRj2iDIlM756XCbEpZpQFd9FKfWaQD8OyPhVwJ4XY='
        );
    });
    test('should return a valid code for the given parameters (no redirect URI)', () => {
        const scopesStr = 'openid profile';
        const clientId = 'relying_party';
        const nonce = 'my_nonce';
        const includeRedirectUriInHash = false;
        const includeClientIdInHash = true;

        const code = getCodeForScope(
            scopesStr,
            undefined,
            clientId,
            nonce,
            includeRedirectUriInHash,
            includeClientIdInHash
        );

        expect(code).toBe(
            'abcdefghijkl01234567890103my_nonce/UWkVTT4nqJm4ozoaVnMZDXDu/ppWCqudNoKPEm8bP0='
        );
    });
    test('should return a valid code for the given parameters (no redirect URI or client ID)', () => {
        const scopesStr = 'openid profile';
        const nonce = 'my_nonce';
        const includeRedirectUriInHash = false;
        const includeClientIdInHash = false;

        const code = getCodeForScope(
            scopesStr,
            undefined,
            undefined,
            nonce,
            includeRedirectUriInHash,
            includeClientIdInHash
        );

        expect(code).toBe(
            'abcdefghijkl01234567890103my_nonceQLPJlLTnOm5cfsuLSSLLlHl2mMFPA3O6jzmL7jNulq0='
        );
    });
});

describe('getNonceFromCode', () => {
    test('should return the nonce from the given code', () => {
        const code =
            '7NTrDl32pZtm9gCSv8K3N4yp1bbloop8wtLxeTBj5NSVgJ48jWerqR2x3CXmeVmPuJG15dybxk=';
        const nonce = getNonceFromCode(code);

        expect(nonce).toBe('bloop');
    });
    test('should return an empty string if no nonce', () => {
        const code =
            'yogUnE3o9bbk2yzZaQMqzm7n1bKr/2C0lkdQoyb2qIkHp/oQwGw5qxm3LHZIa7dRHaqIo=';
        const nonce = getNonceFromCode(code);

        expect(nonce).toBe('');
    });
});

describe('checkCode', () => {
    test('should return true if the code is valid', () => {
        const code =
            '7NTrDl32pZtm9gCSv8K3N4yp1bbloop8wtLxeTBj5NSVgJ48jWerqR2x3CXmeVmPuJG15dybxk=';
        const redirectUri = 'http://localhost:5173';
        const clientId = 'relying_party';
        const includeRedirectUriInHash = true;
        const includeClientIdInHash = true;

        const isValid = checkCode(
            code,
            redirectUri,
            clientId,
            includeRedirectUriInHash,
            includeClientIdInHash
        );

        expect(isValid).toBe(true);
    });

    test('should return false if the code is invalid', () => {
        const code =
            '7NTrDl32pZtm9gCSv8K3N4yp1bbloop8wtLxeTBj5NSVgJ48jWerqR2x3CXmeVmPuJG15dybxj=';
        const redirectUri = 'http://localhost:5173';
        const clientId = 'relying_party';
        const includeRedirectUriInHash = true;
        const includeClientIdInHash = true;

        const isValid = checkCode(
            code,
            redirectUri,
            clientId,
            includeRedirectUriInHash,
            includeClientIdInHash
        );

        expect(isValid).toBe(false);
    });
});

describe('getScopesFromCode', () => {
    test('should return an array of scopes from the given code', () => {
        const code =
            '7NTrDl32pZtm9gCSv8K3N4yp1bbloop8wtLxeTBj5NSVgJ48jWerqR2x3CXmeVmPuJG15dybxk=';
        const scopes = getScopesFromCode(code);

        const expectedScopes = ['openid', 'profile', 'address', 'phone'];

        expect(scopes).toStrictEqual(expectedScopes);
    });
    test('should return an array of scopes from the given code (openid and profile only)', () => {
        const code =
            'KQzrgipWGDPX9zI9TWvlfC/I03bloopNEmNSJoxpZhctyWWNXlNB9LlF8G0F2iT5xF5LNzm/SQ=';
        const scopes = getScopesFromCode(code);

        const expectedScopes = ['openid', 'profile'];

        expect(scopes).toStrictEqual(expectedScopes);
    });
    test('should return an array of scopes from the given code (openid only)', () => {
        const code =
            'FMfSxRHsMw2fewTzVnXzraMx01bloopkjR9lb7Le9SZ145cMxOd9t/QGCi1Dafwcxp9aWxuUJQ=';
        const scopes = getScopesFromCode(code);

        const expectedScopes = ['openid'];

        expect(scopes).toStrictEqual(expectedScopes);
    });
});
