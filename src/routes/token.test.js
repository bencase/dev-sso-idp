import Crypto from 'crypto';
import { jest } from '@jest/globals';
import timekeeper from 'timekeeper';

import { correlationIdHeader } from '../constants';
import { makeTokenRoute } from './token.js';
import { IdTokenFieldNames } from '../tokenManagement.js';

const timeoutDuration = 10;

const idTokenFieldNames = new IdTokenFieldNames();
idTokenFieldNames.nameField = 'name';
idTokenFieldNames.usernameField = 'preferred_username';
idTokenFieldNames.firstNameField = 'given_name';
idTokenFieldNames.middleNameField = 'middle_name';
idTokenFieldNames.lastNameField = 'family_name';
idTokenFieldNames.emailField = 'email';

describe('src/routes/token.js', () => {
    beforeAll(() => {
        timekeeper.freeze(1735579993504);
        jest.spyOn(Crypto, 'randomBytes').mockReturnValue(
            'abcdefghijkl012345678901'
        );
    });

    test('should make a route that can return a token (code workflow)', (done) => {
        const routerParams = {
            clientIdsWithSecretsStr:
                'my_client_id:my_secret,relying_party:relying_party_secret',
            issuer: 'https://idp.example.com',
            idTokenExpirationSeconds: 14400,
            mustUseCredentials: true,
            mustCheckRedirectUri: true,
            mustCheckClientId: true,
            includeExpiresInInTokenResponse: true,
            enableRefreshTokens: true,
            excludeUserInfoFromIdToken: true,
        };
        const headerFunc = (headerName) => {
            if (headerName === 'Authorization') {
                return 'Basic bXlfY2xpZW50X2lkOm15X3NlY3JldA==';
            } else if (headerName === correlationIdHeader) {
                return 'mycorrelationid1234';
            } else {
                return '';
            }
        };
        const req = {
            header: headerFunc,
            body: {
                grant_type: 'authorization_code',
                code: 'abcdefghijkl01234567890103yOzi1BCYwX41vMBZ8u2yAD7cChFdoldVIkLW848bLks=',
                redirect_uri: 'http://localhost:5173',
                scope: 'openid profile',
                client_id: 'my_client_id',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        makeTokenRoute(routerParams, idTokenFieldNames)(req, res);

        setTimeout(() => {
            try {
                expect(res.status).not.toHaveBeenCalled();
                expect(res.json).toHaveBeenCalledWith({
                    access_token:
                        'abcdefghijkl01234567890103faLu3bEhtVzVPWL6xd7xfiJZdRmo6A2IazOI4N4wDBE=',
                    token_type: 'Bearer',
                    expires_in: 14400,
                    id_token:
                        'eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3MzU1Nzk5OTMsImlzcyI6Imh0dHBzOi8vaWRwLmV4YW1wbGUuY29tIiwiYXVkIjoibXlfY2xpZW50X2lkIiwic3ViIjoidHVzZXIiLCJleHAiOjE3MzU1OTQzOTN9.MHyimikG-nnsVT7Vdzl-twzXDLkVOkBQ-2bWzAriy3k',
                    refresh_token:
                        'abcdefghijkl01234567890103fGTxcDJvSbXl0FYpRIsBdMGdrZdqaHd8HzjAiPwsyfs=',
                });
                done();
            } catch (error) {
                done(error);
            }
        }, timeoutDuration);
    });

    test('should make a route that can return a token (refresh token workflow)', (done) => {
        const routerParams = {
            clientIdsWithSecretsStr:
                'my_client_id:my_secret,relying_party:relying_party_secret',
            issuer: 'https://idp.example.com',
            idTokenExpirationSeconds: 14400,
            mustUseCredentials: true,
            mustCheckRedirectUri: true,
            mustCheckClientId: true,
            includeExpiresInInTokenResponse: true,
            enableRefreshTokens: true,
            excludeUserInfoFromIdToken: true,
        };
        const headerFunc = (headerName) => {
            if (headerName === 'Authorization') {
                return 'Basic bXlfY2xpZW50X2lkOm15X3NlY3JldA==';
            } else if (headerName === correlationIdHeader) {
                return undefined;
            } else {
                return '';
            }
        };
        const req = {
            header: headerFunc,
            body: {
                grant_type: 'refresh_token',
                refresh_token:
                    'abcdefghijkl01234567890103fGTxcDJvSbXl0FYpRIsBdMGdrZdqaHd8HzjAiPwsyfs=',
                scope: 'openid profile',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        makeTokenRoute(routerParams, idTokenFieldNames)(req, res);

        setTimeout(() => {
            try {
                expect(res.status).not.toHaveBeenCalled();
                expect(res.json).toHaveBeenCalledWith({
                    access_token:
                        'abcdefghijkl01234567890103faLu3bEhtVzVPWL6xd7xfiJZdRmo6A2IazOI4N4wDBE=',
                    token_type: 'Bearer',
                    expires_in: 14400,
                    id_token:
                        'eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3MzU1Nzk5OTMsImlzcyI6Imh0dHBzOi8vaWRwLmV4YW1wbGUuY29tIiwiYXVkIjoibXlfY2xpZW50X2lkIiwic3ViIjoidHVzZXIiLCJleHAiOjE3MzU1OTQzOTN9.MHyimikG-nnsVT7Vdzl-twzXDLkVOkBQ-2bWzAriy3k',
                    refresh_token:
                        'abcdefghijkl01234567890103fGTxcDJvSbXl0FYpRIsBdMGdrZdqaHd8HzjAiPwsyfs=',
                });
                done();
            } catch (error) {
                done(error);
            }
        }, timeoutDuration);
    });

    test('should make a route that can return a token (code workflow, user info in ID token)', (done) => {
        const routerParams = {
            clientIdsWithSecretsStr:
                'my_client_id:my_secret,relying_party:relying_party_secret',
            issuer: 'https://idp.example.com',
            idTokenExpirationSeconds: 14400,
            mustUseCredentials: true,
            mustCheckRedirectUri: true,
            mustCheckClientId: true,
            includeExpiresInInTokenResponse: true,
            enableRefreshTokens: true,
            excludeUserInfoFromIdToken: false,
        };
        const headerFunc = (headerName) => {
            if (headerName === 'Authorization') {
                return 'Basic bXlfY2xpZW50X2lkOm15X3NlY3JldA==';
            } else if (headerName === correlationIdHeader) {
                return 'mycorrelationid1234';
            } else {
                return '';
            }
        };
        const req = {
            header: headerFunc,
            body: {
                grant_type: 'authorization_code',
                code: 'abcdefghijkl01234567890103yOzi1BCYwX41vMBZ8u2yAD7cChFdoldVIkLW848bLks=',
                redirect_uri: 'http://localhost:5173',
                scope: 'openid profile',
                client_id: 'my_client_id',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        makeTokenRoute(routerParams, idTokenFieldNames)(req, res);

        setTimeout(() => {
            try {
                expect(res.status).not.toHaveBeenCalled();
                expect(res.json).toHaveBeenCalledWith({
                    access_token:
                        'abcdefghijkl01234567890103faLu3bEhtVzVPWL6xd7xfiJZdRmo6A2IazOI4N4wDBE=',
                    token_type: 'Bearer',
                    expires_in: 14400,
                    id_token:
                        'eyJhbGciOiJIUzI1NiJ9.eyJ1cm46ZHVtbXlzc29pZHA6Y2xhaW0iOnRydWUsIm5hbWUiOiJUZXN0IFVzZXIiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJ0dXNlciIsImdpdmVuX25hbWUiOiJUZXN0IiwibWlkZGxlX25hbWUiOiJFbSIsImZhbWlseV9uYW1lIjoiVXNlciIsImlhdCI6MTczNTU3OTk5MywiaXNzIjoiaHR0cHM6Ly9pZHAuZXhhbXBsZS5jb20iLCJhdWQiOiJteV9jbGllbnRfaWQiLCJzdWIiOiJ0dXNlciIsImV4cCI6MTczNTU5NDM5M30.9HpfNuO4YGMoLrzUEUXjwy1QwcsK2vR4V1j_6EvwQyg',
                    refresh_token:
                        'abcdefghijkl01234567890103fGTxcDJvSbXl0FYpRIsBdMGdrZdqaHd8HzjAiPwsyfs=',
                });
                done();
            } catch (error) {
                done(error);
            }
        }, timeoutDuration);
    });

    test('should make a route that can return a token (refresh token workflow, user info in ID token)', (done) => {
        const routerParams = {
            clientIdsWithSecretsStr:
                'my_client_id:my_secret,relying_party:relying_party_secret',
            issuer: 'https://idp.example.com',
            idTokenExpirationSeconds: 14400,
            mustUseCredentials: true,
            mustCheckRedirectUri: true,
            mustCheckClientId: true,
            includeExpiresInInTokenResponse: true,
            enableRefreshTokens: true,
            excludeUserInfoFromIdToken: false,
        };
        const headerFunc = (headerName) => {
            if (headerName === 'Authorization') {
                return 'Basic bXlfY2xpZW50X2lkOm15X3NlY3JldA==';
            } else if (headerName === correlationIdHeader) {
                return undefined;
            } else {
                return '';
            }
        };
        const req = {
            header: headerFunc,
            body: {
                grant_type: 'refresh_token',
                refresh_token:
                    'abcdefghijkl01234567890103fGTxcDJvSbXl0FYpRIsBdMGdrZdqaHd8HzjAiPwsyfs=',
                scope: 'openid profile email',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        makeTokenRoute(routerParams, idTokenFieldNames)(req, res);

        setTimeout(() => {
            try {
                expect(res.status).not.toHaveBeenCalled();
                expect(res.json).toHaveBeenCalledWith({
                    access_token:
                        'abcdefghijkl01234567890103faLu3bEhtVzVPWL6xd7xfiJZdRmo6A2IazOI4N4wDBE=',
                    token_type: 'Bearer',
                    expires_in: 14400,
                    id_token:
                        'eyJhbGciOiJIUzI1NiJ9.eyJ1cm46ZHVtbXlzc29pZHA6Y2xhaW0iOnRydWUsIm5hbWUiOiJUZXN0IFVzZXIiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJ0dXNlciIsImdpdmVuX25hbWUiOiJUZXN0IiwibWlkZGxlX25hbWUiOiJFbSIsImZhbWlseV9uYW1lIjoiVXNlciIsImlhdCI6MTczNTU3OTk5MywiaXNzIjoiaHR0cHM6Ly9pZHAuZXhhbXBsZS5jb20iLCJhdWQiOiJteV9jbGllbnRfaWQiLCJzdWIiOiJ0dXNlciIsImV4cCI6MTczNTU5NDM5M30.9HpfNuO4YGMoLrzUEUXjwy1QwcsK2vR4V1j_6EvwQyg',
                    refresh_token:
                        'abcdefghijkl01234567890103fGTxcDJvSbXl0FYpRIsBdMGdrZdqaHd8HzjAiPwsyfs=',
                });
                done();
            } catch (error) {
                done(error);
            }
        }, timeoutDuration);
    });

    test('should make a route that can return a token (invalid credentials)', (done) => {
        const routerParams = {
            clientIdsWithSecretsStr:
                'my_client_id:my_secret,relying_party:relying_party_secret',
            issuer: 'https://idp.example.com',
            idTokenExpirationSeconds: 14400,
            mustUseCredentials: true,
            mustCheckRedirectUri: true,
            mustCheckClientId: true,
            includeExpiresInInTokenResponse: true,
            enableRefreshTokens: true,
            excludeUserInfoFromIdToken: true,
        };
        const headerFunc = (headerName) => {
            if (headerName === 'Authorization') {
                return 'Basic bXlfY2xpZW50X2lkOn15X3NlY3JldA==';
            } else if (headerName === correlationIdHeader) {
                return 'mycorrelationid1234';
            } else {
                return '';
            }
        };
        const req = {
            header: headerFunc,
            body: {
                grant_type: 'authorization_code',
                code: 'abcdefghijkl01234567890103yOzi1BCYwX41vMBZ8u2yAD7cChFdoldVIkLW848bLks=',
                redirect_uri: 'http://localhost:5173',
                scope: 'openid profile',
                client_id: 'my_client_id',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        makeTokenRoute(routerParams, idTokenFieldNames)(req, res);

        setTimeout(() => {
            try {
                expect(res.status).toHaveBeenCalledWith(403);
                expect(res.json).toHaveBeenCalledTimes(1);
                expect(res.json).toHaveBeenCalledWith({
                    message: 'Access denied',
                });
                done();
            } catch (error) {
                done(error);
            }
        }, timeoutDuration);
    });

    test('should make a route that can return a token (invalid grant type)', (done) => {
        const routerParams = {
            clientIdsWithSecretsStr:
                'my_client_id:my_secret,relying_party:relying_party_secret',
            issuer: 'https://idp.example.com',
            idTokenExpirationSeconds: 14400,
            mustUseCredentials: true,
            mustCheckRedirectUri: true,
            mustCheckClientId: true,
            includeExpiresInInTokenResponse: true,
            enableRefreshTokens: true,
            excludeUserInfoFromIdToken: true,
        };
        const headerFunc = (headerName) => {
            if (headerName === 'Authorization') {
                return 'Basic bXlfY2xpZW50X2lkOm15X3NlY3JldA==';
            } else if (headerName === correlationIdHeader) {
                return 'mycorrelationid1234';
            } else {
                return '';
            }
        };
        const req = {
            header: headerFunc,
            body: {
                grant_type: 'invalid_grant_type',
                code: 'abcdefghijkl01234567890103yOzi1BCYwX41vMBZ8u2yAD7cChFdoldVIkLW848bLks=',
                redirect_uri: 'http://localhost:5173',
                scope: 'openid profile',
                client_id: 'my_client_id',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        makeTokenRoute(routerParams, idTokenFieldNames)(req, res);

        setTimeout(() => {
            try {
                expect(res.status).toHaveBeenCalledWith(400);
                expect(res.json).toHaveBeenCalledTimes(1);
                expect(res.json.mock.calls[0][0]).toHaveProperty('message');
                done();
            } catch (error) {
                done(error);
            }
        }, timeoutDuration);
    });

    test('should make a route that can return a token (no grant_type provided)', (done) => {
        const routerParams = {
            clientIdsWithSecretsStr:
                'my_client_id:my_secret,relying_party:relying_party_secret',
            issuer: 'https://idp.example.com',
            idTokenExpirationSeconds: 14400,
            mustUseCredentials: true,
            mustCheckRedirectUri: true,
            mustCheckClientId: true,
            includeExpiresInInTokenResponse: true,
            enableRefreshTokens: true,
            excludeUserInfoFromIdToken: true,
        };
        const headerFunc = (headerName) => {
            if (headerName === 'Authorization') {
                return 'Basic bXlfY2xpZW50X2lkOm15X3NlY3JldA==';
            } else if (headerName === correlationIdHeader) {
                return 'mycorrelationid1234';
            } else {
                return '';
            }
        };
        const req = {
            header: headerFunc,
            body: {
                code: 'abcdefghijkl01234567890103yOzi1BCYwX41vMBZ8u2yAD7cChFdoldVIkLW848bLks=',
                redirect_uri: 'http://localhost:5173',
                scope: 'openid profile',
                client_id: 'my_client_id',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        makeTokenRoute(routerParams, idTokenFieldNames)(req, res);

        setTimeout(() => {
            try {
                expect(res.status).toHaveBeenCalledWith(400);
                expect(res.json).toHaveBeenCalledTimes(1);
                expect(res.json.mock.calls[0][0]).toHaveProperty('message');
                done();
            } catch (error) {
                done(error);
            }
        }, timeoutDuration);
    });

    test('should make a route that can return a token (neither code nor refresh token provided)', (done) => {
        const routerParams = {
            clientIdsWithSecretsStr:
                'my_client_id:my_secret,relying_party:relying_party_secret',
            issuer: 'https://idp.example.com',
            idTokenExpirationSeconds: 14400,
            mustUseCredentials: true,
            mustCheckRedirectUri: true,
            mustCheckClientId: true,
            includeExpiresInInTokenResponse: true,
            enableRefreshTokens: true,
            excludeUserInfoFromIdToken: true,
        };
        const headerFunc = (headerName) => {
            if (headerName === 'Authorization') {
                return 'Basic bXlfY2xpZW50X2lkOm15X3NlY3JldA==';
            } else if (headerName === correlationIdHeader) {
                return 'mycorrelationid1234';
            } else {
                return '';
            }
        };
        const req = {
            header: headerFunc,
            body: {
                grant_type: 'authorization_code',
                redirect_uri: 'http://localhost:5173',
                scope: 'openid profile',
                client_id: 'my_client_id',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        makeTokenRoute(routerParams, idTokenFieldNames)(req, res);

        setTimeout(() => {
            try {
                expect(res.status).toHaveBeenCalledWith(400);
                expect(res.json).toHaveBeenCalledTimes(1);
                expect(res.json.mock.calls[0][0]).toHaveProperty('message');
                done();
            } catch (error) {
                done(error);
            }
        }, timeoutDuration);
    });

    test('should make a route that can return a token (no redirect URI provided)', (done) => {
        const routerParams = {
            clientIdsWithSecretsStr:
                'my_client_id:my_secret,relying_party:relying_party_secret',
            issuer: 'https://idp.example.com',
            idTokenExpirationSeconds: 14400,
            mustUseCredentials: true,
            mustCheckRedirectUri: true,
            mustCheckClientId: true,
            includeExpiresInInTokenResponse: true,
            enableRefreshTokens: true,
            excludeUserInfoFromIdToken: true,
        };
        const headerFunc = (headerName) => {
            if (headerName === 'Authorization') {
                return 'Basic bXlfY2xpZW50X2lkOm15X3NlY3JldA==';
            } else if (headerName === correlationIdHeader) {
                return 'mycorrelationid1234';
            } else {
                return '';
            }
        };
        const req = {
            header: headerFunc,
            body: {
                grant_type: 'authorization_code',
                code: 'abcdefghijkl01234567890103yOzi1BCYwX41vMBZ8u2yAD7cChFdoldVIkLW848bLks=',
                scope: 'openid profile',
                client_id: 'my_client_id',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        makeTokenRoute(routerParams, idTokenFieldNames)(req, res);

        setTimeout(() => {
            try {
                expect(res.status).toHaveBeenCalledWith(400);
                expect(res.json).toHaveBeenCalledTimes(1);
                expect(res.json.mock.calls[0][0]).toHaveProperty('message');
                done();
            } catch (error) {
                done(error);
            }
        }, timeoutDuration);
    });

    test('should make a route that can return a token (no redirect URI provided, redirect URIs not checked)', (done) => {
        const routerParams = {
            clientIdsWithSecretsStr:
                'my_client_id:my_secret,relying_party:relying_party_secret',
            issuer: 'https://idp.example.com',
            idTokenExpirationSeconds: 14400,
            mustUseCredentials: true,
            mustCheckRedirectUri: false,
            mustCheckClientId: true,
            includeExpiresInInTokenResponse: true,
            enableRefreshTokens: true,
            excludeUserInfoFromIdToken: true,
        };
        const headerFunc = (headerName) => {
            if (headerName === 'Authorization') {
                return 'Basic bXlfY2xpZW50X2lkOm15X3NlY3JldA==';
            } else if (headerName === correlationIdHeader) {
                return 'mycorrelationid1234';
            } else {
                return '';
            }
        };
        const req = {
            header: headerFunc,
            body: {
                grant_type: 'authorization_code',
                code: 'abcdefghijkl01234567890103fGTxcDJvSbXl0FYpRIsBdMGdrZdqaHd8HzjAiPwsyfs=',
                scope: 'openid profile',
                client_id: 'my_client_id',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        makeTokenRoute(routerParams, idTokenFieldNames)(req, res);

        setTimeout(() => {
            try {
                expect(res.status).not.toHaveBeenCalled();
                expect(res.json).toHaveBeenCalledWith({
                    access_token:
                        'abcdefghijkl01234567890103faLu3bEhtVzVPWL6xd7xfiJZdRmo6A2IazOI4N4wDBE=',
                    token_type: 'Bearer',
                    expires_in: 14400,
                    id_token:
                        'eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3MzU1Nzk5OTMsImlzcyI6Imh0dHBzOi8vaWRwLmV4YW1wbGUuY29tIiwiYXVkIjoibXlfY2xpZW50X2lkIiwic3ViIjoidHVzZXIiLCJleHAiOjE3MzU1OTQzOTN9.MHyimikG-nnsVT7Vdzl-twzXDLkVOkBQ-2bWzAriy3k',
                    refresh_token:
                        'abcdefghijkl01234567890103fGTxcDJvSbXl0FYpRIsBdMGdrZdqaHd8HzjAiPwsyfs=',
                });
                done();
            } catch (error) {
                done(error);
            }
        }, timeoutDuration);
    });

    test('should make a route that can return a token (no need to check client ID when validating code)', (done) => {
        const routerParams = {
            clientIdsWithSecretsStr:
                'my_client_id:my_secret,relying_party:relying_party_secret',
            issuer: 'https://idp.example.com',
            idTokenExpirationSeconds: 14400,
            mustUseCredentials: true,
            mustCheckRedirectUri: true,
            mustCheckClientId: false,
            includeExpiresInInTokenResponse: true,
            enableRefreshTokens: true,
            excludeUserInfoFromIdToken: true,
        };
        const headerFunc = (headerName) => {
            if (headerName === 'Authorization') {
                return 'Basic bXlfY2xpZW50X2lkOm15X3NlY3JldA==';
            } else if (headerName === correlationIdHeader) {
                return 'mycorrelationid1234';
            } else {
                return '';
            }
        };
        const req = {
            header: headerFunc,
            body: {
                grant_type: 'authorization_code',
                code: 'abcdefghijkl01234567890103icdBFQd0IecYUwSBnBJAoJY0mDW9GIe/232cmTkfgak=',
                redirect_uri: 'http://localhost:5173',
                scope: 'openid profile',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        makeTokenRoute(routerParams, idTokenFieldNames)(req, res);

        setTimeout(() => {
            try {
                expect(res.status).not.toHaveBeenCalled();
                expect(res.json).toHaveBeenCalledWith({
                    access_token:
                        'abcdefghijkl01234567890103faLu3bEhtVzVPWL6xd7xfiJZdRmo6A2IazOI4N4wDBE=',
                    token_type: 'Bearer',
                    expires_in: 14400,
                    id_token:
                        'eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3MzU1Nzk5OTMsImlzcyI6Imh0dHBzOi8vaWRwLmV4YW1wbGUuY29tIiwiYXVkIjoibXlfY2xpZW50X2lkIiwic3ViIjoidHVzZXIiLCJleHAiOjE3MzU1OTQzOTN9.MHyimikG-nnsVT7Vdzl-twzXDLkVOkBQ-2bWzAriy3k',
                    refresh_token:
                        'abcdefghijkl01234567890103fGTxcDJvSbXl0FYpRIsBdMGdrZdqaHd8HzjAiPwsyfs=',
                });
                done();
            } catch (error) {
                done(error);
            }
        }, timeoutDuration);
    });

    test('should make a route that can return a token (client ID not in request body, should get client ID from credentials)', (done) => {
        const routerParams = {
            clientIdsWithSecretsStr:
                'my_client_id:my_secret,relying_party:relying_party_secret',
            issuer: 'https://idp.example.com',
            idTokenExpirationSeconds: 14400,
            mustUseCredentials: true,
            mustCheckRedirectUri: true,
            mustCheckClientId: true,
            includeExpiresInInTokenResponse: true,
            enableRefreshTokens: true,
            excludeUserInfoFromIdToken: true,
        };
        const headerFunc = (headerName) => {
            if (headerName === 'Authorization') {
                return 'Basic bXlfY2xpZW50X2lkOm15X3NlY3JldA==';
            } else if (headerName === correlationIdHeader) {
                return 'mycorrelationid1234';
            } else {
                return '';
            }
        };
        const req = {
            header: headerFunc,
            body: {
                grant_type: 'authorization_code',
                code: 'abcdefghijkl01234567890103yOzi1BCYwX41vMBZ8u2yAD7cChFdoldVIkLW848bLks=',
                redirect_uri: 'http://localhost:5173',
                scope: 'openid profile',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        makeTokenRoute(routerParams, idTokenFieldNames)(req, res);

        setTimeout(() => {
            try {
                expect(res.status).not.toHaveBeenCalled();
                expect(res.json).toHaveBeenCalledWith({
                    access_token:
                        'abcdefghijkl01234567890103faLu3bEhtVzVPWL6xd7xfiJZdRmo6A2IazOI4N4wDBE=',
                    token_type: 'Bearer',
                    expires_in: 14400,
                    id_token:
                        'eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3MzU1Nzk5OTMsImlzcyI6Imh0dHBzOi8vaWRwLmV4YW1wbGUuY29tIiwiYXVkIjoibXlfY2xpZW50X2lkIiwic3ViIjoidHVzZXIiLCJleHAiOjE3MzU1OTQzOTN9.MHyimikG-nnsVT7Vdzl-twzXDLkVOkBQ-2bWzAriy3k',
                    refresh_token:
                        'abcdefghijkl01234567890103fGTxcDJvSbXl0FYpRIsBdMGdrZdqaHd8HzjAiPwsyfs=',
                });
                done();
            } catch (error) {
                done(error);
            }
        }, timeoutDuration);
    });

    test('should make a route that can return a token (credential checking disabled, no credentials provided, client ID not in request body, but client ID checking required)', (done) => {
        const routerParams = {
            clientIdsStr: 'my_client_id,relying_party',
            issuer: 'https://idp.example.com',
            idTokenExpirationSeconds: 14400,
            mustUseCredentials: false,
            mustCheckRedirectUri: true,
            mustCheckClientId: true,
            includeExpiresInInTokenResponse: true,
            enableRefreshTokens: true,
            excludeUserInfoFromIdToken: true,
        };
        const headerFunc = (headerName) => {
            if (headerName === 'Authorization') {
                return '';
            } else if (headerName === correlationIdHeader) {
                return 'mycorrelationid1234';
            } else {
                return '';
            }
        };
        const req = {
            header: headerFunc,
            body: {
                grant_type: 'authorization_code',
                code: 'abcdefghijkl01234567890103yOzi1BCYwX41vMBZ8u2yAD7cChFdoldVIkLW848bLks=',
                redirect_uri: 'http://localhost:5173',
                scope: 'openid profile',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        makeTokenRoute(routerParams, idTokenFieldNames)(req, res);

        setTimeout(() => {
            try {
                expect(res.status).toHaveBeenCalledWith(400);
                expect(res.json).toHaveBeenCalledTimes(1);
                expect(res.json.mock.calls[0][0]).toHaveProperty('message');
                done();
            } catch (error) {
                done(error);
            }
        }, timeoutDuration);
    });

    test('should make a route that can return a token (code workflow with nonce)', (done) => {
        const routerParams = {
            clientIdsWithSecretsStr:
                'my_client_id:my_secret,relying_party:relying_party_secret',
            issuer: 'https://idp.example.com',
            idTokenExpirationSeconds: 14400,
            mustUseCredentials: true,
            mustCheckRedirectUri: true,
            mustCheckClientId: true,
            includeExpiresInInTokenResponse: true,
            enableRefreshTokens: true,
            excludeUserInfoFromIdToken: true,
        };
        const headerFunc = (headerName) => {
            if (headerName === 'Authorization') {
                return 'Basic bXlfY2xpZW50X2lkOm15X3NlY3JldA==';
            } else if (headerName === correlationIdHeader) {
                return 'mycorrelationid1234';
            } else {
                return '';
            }
        };

        const req = {
            header: headerFunc,
            body: {
                grant_type: 'authorization_code',
                code: 'abcdefghijkl01234567890103nonce12343FDOu6jUgbA2WkXPErzUC4041APwKTIQCng7F6vF/Ws=',
                redirect_uri: 'http://localhost:5173',
                scope: 'openid profile',
                client_id: 'my_client_id',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        makeTokenRoute(routerParams, idTokenFieldNames)(req, res);

        setTimeout(() => {
            try {
                expect(res.status).not.toHaveBeenCalled();
                expect(res.json).toHaveBeenCalledWith({
                    access_token:
                        'abcdefghijkl01234567890103faLu3bEhtVzVPWL6xd7xfiJZdRmo6A2IazOI4N4wDBE=',
                    token_type: 'Bearer',
                    expires_in: 14400,
                    id_token:
                        'eyJhbGciOiJIUzI1NiJ9.eyJ1cm46ZHVtbXlzc29pZHA6Y2xhaW0iOnRydWUsIm5vbmNlIjoibm9uY2UxMjM0IiwiaWF0IjoxNzM1NTc5OTkzLCJpc3MiOiJodHRwczovL2lkcC5leGFtcGxlLmNvbSIsImF1ZCI6Im15X2NsaWVudF9pZCIsInN1YiI6InR1c2VyIiwiZXhwIjoxNzM1NTk0MzkzfQ.BGIDdj90Mx5CU4ueMxnDeE61uA7GQmkfN1kP7Ji4qe8',
                    refresh_token:
                        'abcdefghijkl01234567890103fGTxcDJvSbXl0FYpRIsBdMGdrZdqaHd8HzjAiPwsyfs=',
                });
                done();
            } catch (error) {
                done(error);
            }
        }, timeoutDuration);
    });
});
