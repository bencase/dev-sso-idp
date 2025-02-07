import { jest } from '@jest/globals';

import { correlationIdHeader } from '../constants';
import { makeUserInfoRoute } from './userInfo.js';

describe('src/routes/userInfo.js', () => {
    test('should make a route that returns user info (only openid and profile scope)', () => {
        const headerFunc = (headerName) => {
            if (headerName === 'Authorization') {
                return 'Bearer abcdefghijkl01234567890103faLu3bEhtVzVPWL6xd7xfiJZdRmo6A2IazOI4N4wDBE=';
            } else if (headerName === correlationIdHeader) {
                return 'mycorrelationid1234';
            } else {
                return '';
            }
        };

        const req = {
            header: headerFunc,
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        makeUserInfoRoute()(req, res);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({
            name: 'Test User',
            family_name: 'User',
            given_name: 'Test',
            middle_name: 'Em',
            nickname: 'Testy',
            preferred_username: 'tuser',
            profile: 'https://example.com/user/tuser/profile.html',
            photo: 'https://example.com/user/tuser/image.jpg',
            website: 'https://example-tuser.com',
            gender: 'female',
            birthdate: '1970-01-01',
            zoneinfo: 'America/Chicago',
            locale: 'en-US',
            updated_at: 1728929831,
        });
    });

    test('should make a route that returns user info (all scopes)', () => {
        const headerFunc = (headerName) => {
            if (headerName === 'Authorization') {
                return 'Bearer abcdefghijkl0123456789013fhOiNQB3+SG6ZbwDMvVRph0KCTf+E8zAvHZ7j2IyzStQ=';
            } else if (headerName === correlationIdHeader) {
                return 'mycorrelationid1234';
            } else {
                return '';
            }
        };

        const req = {
            header: headerFunc,
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        makeUserInfoRoute()(req, res);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({
            name: 'Test User',
            family_name: 'User',
            given_name: 'Test',
            middle_name: 'Em',
            nickname: 'Testy',
            preferred_username: 'tuser',
            profile: 'https://example.com/user/tuser/profile.html',
            photo: 'https://example.com/user/tuser/image.jpg',
            website: 'https://example-tuser.com',
            gender: 'female',
            birthdate: '1970-01-01',
            zoneinfo: 'America/Chicago',
            locale: 'en-US',
            updated_at: 1728929831,
            email: 'tuser@example.com',
            email_verified: true,
            address: {
                formatted: '248 Live Oak Lane\nAustin, TX 78787\nUnited States',
                street_address: '248 Live Oak Lane',
                locality: 'Austin',
                region: 'TX',
                postal_code: '78787',
                country: 'United States',
            },
            phone_number: '+1 (555) 555-5555',
            phone_number_verified: true,
        });
    });

    test('should make a route that returns user info (only openid scope)', () => {
        const headerFunc = (headerName) => {
            if (headerName === 'Authorization') {
                return 'Bearer abcdefghijkl01234567890101h0LVcKGghjp+TUdIdW8K3bERKhWPrxnY7JORY9KbL5I=';
            } else if (headerName === correlationIdHeader) {
                return 'mycorrelationid1234';
            } else {
                return '';
            }
        };

        const req = {
            header: headerFunc,
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        makeUserInfoRoute()(req, res);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({});
    });

    test('should make a route that returns user info (no authorization header)', () => {
        const headerFunc = (headerName) => {
            if (headerName === 'Authorization') {
                return undefined;
            } else if (headerName === correlationIdHeader) {
                return 'mycorrelationid1234';
            } else {
                return '';
            }
        };

        const req = {
            header: headerFunc,
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        makeUserInfoRoute()(req, res);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json.mock.calls[0][0]).toHaveProperty('message');
    });

    test('should make a route that returns user info (invalid access token)', () => {
        const headerFunc = (headerName) => {
            if (headerName === 'Authorization') {
                return 'Bearer bbcdefghijkl01234567890101h0LVcKGghjp+TUdIdW8K3bERKhWPrxnY7JORY9KbL5I=';
            } else if (headerName === correlationIdHeader) {
                return 'mycorrelationid1234';
            } else {
                return '';
            }
        };

        const req = {
            header: headerFunc,
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        makeUserInfoRoute()(req, res);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json.mock.calls[0][0]).toHaveProperty('message');
    });

    // It's important to ensure it checks for 'Bearer' here so that this API can
    // give advance warning to users who don't use 'Bearer' when making their own
    // API and testing it against this one.
    test('should make a route that returns user info (doesn\'t have "Bearer")', () => {
        const headerFunc = (headerName) => {
            if (headerName === 'Authorization') {
                return 'Basic abcdefghijkl01234567890101h0LVcKGghjp+TUdIdW8K3bERKhWPrxnY7JORY9KbL5I=';
            } else if (headerName === correlationIdHeader) {
                return 'mycorrelationid1234';
            } else {
                return '';
            }
        };

        const req = {
            header: headerFunc,
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        makeUserInfoRoute()(req, res);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json.mock.calls[0][0]).toHaveProperty('message');
    });
});
