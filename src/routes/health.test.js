import { jest } from '@jest/globals';

import { makeHealthRoute, makeEnvHealthRoute } from './health.js';

describe('src/routes/health.js', () => {
    test('should make a basic health check route that indicates service is up by returning 200', () => {
        const req = {};
        const res = {
            sendStatus: jest.fn(),
        };

        makeHealthRoute()(req, res);

        expect(res.sendStatus).toHaveBeenCalledWith(200);
    });

    test('should make a route that performs a health check and returns 200 if there are no problems', () => {
        const envVarsValidationResult = {
            errors: [],
            warnings: [],
        };
        const req = {};
        const res = {
            sendStatus: jest.fn(),
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        makeEnvHealthRoute(envVarsValidationResult)(req, res);

        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
        expect(res.sendStatus).toHaveBeenCalledWith(200);
    });

    test('should make a route that performs a health check and returns an error if there are invalid environment variables', () => {
        const envVarsValidationResult = {
            errors: [
                {
                    message: `No client IDs found. Make sure the DEVSSOIDP_CLIENT_IDS or DEVSSOIDP_CLIENT_IDS_WITH_SECRETS environment variable is populated.`,
                    var: 'DEVSSOIDP_CLIENT_IDS',
                },
                {
                    message: `The DEVSSOIDP_PERCENT_ENCODED_REDIRECT_URIS environment variable contains invalid redirect URIs: https%3A%2F%2Fbadredirect.uri\ud83d`,
                    var: 'DEVSSOIDP_PERCENT_ENCODED_REDIRECT_URIS',
                },
            ],
            warnings: [],
        };
        const req = {};
        const res = {
            sendStatus: jest.fn(),
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        makeEnvHealthRoute(envVarsValidationResult)(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            errors: envVarsValidationResult.errors,
        });
        expect(res.sendStatus).not.toHaveBeenCalled();
    });
});
