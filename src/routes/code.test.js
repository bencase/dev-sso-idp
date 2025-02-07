import Crypto from 'crypto';
import { jest } from '@jest/globals';

import { makeCodeRoute } from './code.js';

describe('src/routes/code.js', () => {
    beforeEach(() => {
        jest.spyOn(Crypto, 'randomBytes').mockReturnValue(
            'abcdefghijkl012345678901'
        );
    });

    test('should make a code route that returns a code when called', () => {
        const routerParams = {
            mustCheckRedirectUri: true,
            mustCheckClientId: true,
        };
        const req = {
            query: {
                scopeStr: 'openid profile email',
                redirectUri: 'http://relyingapp.com',
                clientId: 'relying_party',
                nonce: 'my_nonce',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        makeCodeRoute(routerParams)(req, res);

        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith({
            code: 'abcdefghijkl01234567890107my_nonceIJzuMpaBBI/6DlK2bCOPG6CWrUeGRw1k260tHObd4ao=',
        });
    });

    test('should make a code route that returns a code when called (no nonce)', () => {
        const routerParams = {
            mustCheckRedirectUri: true,
            mustCheckClientId: true,
        };
        const req = {
            query: {
                scopeStr: 'openid profile email',
                redirectUri: 'http://relyingapp.com',
                clientId: 'relying_party',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        makeCodeRoute(routerParams)(req, res);

        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith({
            code: 'abcdefghijkl01234567890107WxjVzTAzWByClfDP1Tvv+rsGpA/DAH2Z0qmaApW2SLc=',
        });
    });

    test('should make a code route that returns a code when called (not required to check redirect URI)', () => {
        const routerParams = {
            mustCheckRedirectUri: false,
            mustCheckClientId: true,
        };
        const req = {
            query: {
                scopeStr: 'openid profile email',
                redirectUri: 'http://relyingapp.com',
                clientId: 'relying_party',
                nonce: 'my_nonce',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        makeCodeRoute(routerParams)(req, res);

        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith({
            code: 'abcdefghijkl01234567890107my_noncepIcsfXT7jI1ujIgz6z384ZJBiXZ4HzK/+6ropNG7zLk=',
        });
    });

    test('should make a code route that returns a code when called (not required to check client ID)', () => {
        const routerParams = {
            mustCheckRedirectUri: true,
            mustCheckClientId: false,
        };
        const req = {
            query: {
                scopeStr: 'openid profile email',
                redirectUri: 'http://relyingapp.com',
                clientId: 'relying_party',
                nonce: 'my_nonce',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        makeCodeRoute(routerParams)(req, res);

        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith({
            code: 'abcdefghijkl01234567890107my_noncexhsrq2QGaCJfJdrABRJnDJImsNPISOvXQPR8RAHV4vE=',
        });
    });

    test('should make a code route that returns a code when called (not required to check either redirect URI or client ID)', () => {
        const routerParams = {
            mustCheckRedirectUri: false,
            mustCheckClientId: false,
        };
        const req = {
            query: {
                scopeStr: 'openid profile email',
                redirectUri: 'http://relyingapp.com',
                clientId: 'relying_party',
                nonce: 'my_nonce',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        makeCodeRoute(routerParams)(req, res);

        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith({
            code: 'abcdefghijkl01234567890107my_nonce3ctb1oI5bd82OgbY215TQXcmTa6xyTM6RtAn27xaPnU=',
        });
    });

    test('should make a code route that returns an error if no scope', () => {
        const routerParams = {
            mustCheckRedirectUri: true,
            mustCheckClientId: true,
        };
        const req = {
            query: {
                redirectUri: 'http://relyingapp.com',
                clientId: 'relying_party',
                nonce: 'my_nonce',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        makeCodeRoute(routerParams)(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: `The 'scope' query param must be specified, and must contain a space-delimited list of scopes.`,
        });
    });
});
