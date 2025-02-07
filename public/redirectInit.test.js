/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals';

describe('public/redirectInit.js', () => {
    const originalLocation = window.location;

    beforeAll(async () => {
        delete window.location;
        window.location = {
            ...originalLocation,
            assign: jest.fn(),
        };
        window.devSsoIdp = {};
        await import('./redirectInit.js');
    });

    beforeEach(() => {
        window.location.href = 'http://start.com/authorize';
    });

    afterAll(() => {
        window.location = originalLocation;
    });

    test('should change window location and add success query params', () => {
        window.devSsoIdp.code = '12345';
        window.devSsoIdp.requestParams = {
            redirectUri: 'http://end.com/home',
            state: 'my_state',
        };

        window.devSsoIdp.redirectWithSuccess();

        expect(window.location.href).toBe(
            'http://end.com/home?code=12345&state=my_state'
        );
    });

    test('should change window location and add fail query params', () => {
        window.devSsoIdp.settings = {
            error: 'access_denied',
            errorDesc: 'User denied access',
        };
        window.devSsoIdp.requestParams = {
            redirectUri: 'http://end.com/home',
            state: 'my_state',
        };

        window.devSsoIdp.redirectWithFail();

        expect(window.location.href).toBe(
            'http://end.com/home?error=access_denied&error_description=User+denied+access&state=my_state'
        );
    });
});
