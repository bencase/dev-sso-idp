/**
 * @jest-environment jsdom
 */

describe('public/setupEnvVars.js', () => {
    beforeAll(async () => {
        window.devSsoIdp = {};
        await import('./setupEnvVars.js');
    });

    afterEach(() => {
        window.localStorage.clear();
    });

    test('should initialize environment variables (simple case)', () => {
        window.devSsoIdp.envVarServerValidationResult = {
            errors: [],
            warnings: [],
        };
        window.devSsoIdp.CLIENT_IDS = 'relying_party';
        window.devSsoIdp.PERCENT_ENCODED_REDIRECT_URIS =
            'http%3A%2F%2Flocalhost%3A5173';

        window.devSsoIdp.initializeEnvVars();

        expect(window.devSsoIdp.envVarValidity).toEqual({});
        expect(window.devSsoIdp.CLIENT_IDS_ARRAY).toEqual(['relying_party']);
        expect(window.devSsoIdp.REDIRECT_URIS_ARRAY).toEqual([
            'http://localhost:5173',
        ]);
    });

    test('should initialize environment variables (multiple errors and warnings)', () => {
        window.devSsoIdp.envVarServerValidationResult = {
            errors: [
                { message: 'Error 1', var: 'VAR1' },
                { message: 'Error 2', var: 'VAR2' },
            ],
            warnings: [
                { message: 'Warning 1', var: 'VAR3' },
                { message: 'Warning 2', var: 'VAR4' },
            ],
        };
        window.devSsoIdp.CLIENT_IDS = 'relying_party';
        window.devSsoIdp.PERCENT_ENCODED_REDIRECT_URIS =
            'http%3A%2F%2Flocalhost%3A5173';

        window.devSsoIdp.initializeEnvVars();

        expect(window.devSsoIdp.envVarValidity).toEqual({
            0: { isValid: false, message: 'Error 1', var: 'VAR1' },
            1: { isValid: false, message: 'Error 2', var: 'VAR2' },
        });
        expect(window.devSsoIdp.CLIENT_IDS_ARRAY).toEqual(['relying_party']);
        expect(window.devSsoIdp.REDIRECT_URIS_ARRAY).toEqual([
            'http://localhost:5173',
        ]);
    });

    test('should initialize environment variables (multiple client IDs)', () => {
        window.devSsoIdp.envVarServerValidationResult = {
            errors: [],
            warnings: [],
        };
        window.devSsoIdp.CLIENT_IDS = 'relying_party,my_cool_app';
        window.devSsoIdp.PERCENT_ENCODED_REDIRECT_URIS =
            'http%3A%2F%2Flocalhost%3A5173';

        window.devSsoIdp.initializeEnvVars();

        expect(window.devSsoIdp.envVarValidity).toEqual({});
        expect(window.devSsoIdp.CLIENT_IDS_ARRAY).toEqual([
            'relying_party',
            'my_cool_app',
        ]);
        expect(window.devSsoIdp.REDIRECT_URIS_ARRAY).toEqual([
            'http://localhost:5173',
        ]);
    });

    test('should initialize environment variables (multiple redirect URIs)', () => {
        window.devSsoIdp.envVarServerValidationResult = {
            errors: [],
            warnings: [],
        };
        window.devSsoIdp.CLIENT_IDS = 'relying_party';
        window.devSsoIdp.PERCENT_ENCODED_REDIRECT_URIS =
            'http%3A%2F%2Flocalhost%3A5173,http%3A%2F%2Flocalhost%3A8080';

        window.devSsoIdp.initializeEnvVars();

        expect(window.devSsoIdp.envVarValidity).toEqual({});
        expect(window.devSsoIdp.CLIENT_IDS_ARRAY).toEqual(['relying_party']);
        expect(window.devSsoIdp.REDIRECT_URIS_ARRAY).toEqual([
            'http://localhost:5173',
            'http://localhost:8080',
        ]);
    });
});
