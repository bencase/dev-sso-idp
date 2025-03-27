import { EnvVarHolder, validateValues } from './validateEnvVars.js';
import {
    CLIENT_IDS_ENV_VAR,
    CLIENT_IDS_WITH_SECRETS_ENV_VAR,
    PERCENT_ENCODED_REDIRECT_URIS_ENV_VAR,
    HASH_SECRET_ENV_VAR,
    SALTS_FOR_HASHING_SECRET_ENV_VAR,
} from './constants.js';

const getDefaultEnvVarHolder = () => {
    const envVarHolder = new EnvVarHolder();
    envVarHolder.useHttp = 'true';
    envVarHolder.httpPort = '80';
    envVarHolder.useHttps = 'true';
    envVarHolder.httpsPort = '443';
    envVarHolder.issuer = 'https://example.com';
    envVarHolder.percentEncodedRedirectUris =
        'http%3A%2F%2Flocalhost%3A5173,http%3A%2F%2Flocalhost%3A8080';
    envVarHolder.clientIdsWithSecretsStr =
        'client1:secret1,client2:secret2,client3:secret3';
    envVarHolder.clientIdsStr = 'client1,client2,client3';
    envVarHolder.hashSecret = 'true';
    envVarHolder.saltsForHashingSecret = 'salt1,salt2,salt3';
    envVarHolder.idTokenExpirationSeconds = '3600';
    envVarHolder.ignoreResponseTypeValidation = 'false';
    envVarHolder.ignoreClientIdValidation = 'false';
    envVarHolder.ignoreScopeValidation = 'false';
    envVarHolder.ignoreRedirectUriValidation = 'false';
    envVarHolder.includeExpiresInInTokenResponse = 'true';
    envVarHolder.redirectUriOptionalForTokenEndpoint = 'false';
    envVarHolder.clientIdOptionalForTokenEndpoint = 'false';
    envVarHolder.enableRefreshTokens = 'true';
    envVarHolder.excludeUserInfoFromIdToken = 'false';
    envVarHolder.idTokenNameField = 'name';
    envVarHolder.idTokenUsernameField = 'preferred_username';
    envVarHolder.idTokenFirstNameField = 'given_name';
    envVarHolder.idTokenMiddleNameField = 'middle_name';
    envVarHolder.idTokenLastNameField = 'family_name';
    envVarHolder.idTokenEmailField = 'email';
    envVarHolder.logLevel = 'info';
    envVarHolder.authorizePagePath = '/authorize';
    envVarHolder.settingsPagePath = '/settings';
    envVarHolder.environmentPagePath = '/environment';
    envVarHolder.codeEndpointPath = '/api/v1/code';
    envVarHolder.tokenEndpointPath = '/api/v1/token';
    envVarHolder.userInfoEndpointPath = '/api/v1/userInfo';
    envVarHolder.healthCheckEndpointPath = '/api/v1/health';
    envVarHolder.healthCheckEnvEndpointPath = '/api/v1/health/env';
    return envVarHolder;
};

describe('validateValues', () => {
    test('should return no errors for valid environment variables', () => {
        const envVarHolder = getDefaultEnvVarHolder();
        const expectedResult = {
            errors: [],
            warnings: [],
        };

        const result = validateValues(envVarHolder);
        expect(result).toStrictEqual(expectedResult);
    });

    test('should give validation error if neither http nor https is set', () => {
        const envVarHolder = getDefaultEnvVarHolder();
        envVarHolder.useHttp = 'false';
        envVarHolder.useHttps = 'false';

        expect(() => validateValues(envVarHolder)).toThrow();
    });

    test('should give validation error if no client IDs found', () => {
        const envVarHolder = getDefaultEnvVarHolder();
        envVarHolder.clientIdsStr = '';
        envVarHolder.clientIdsWithSecretsStr = undefined;
        envVarHolder.hashSecret = 'false';
        const expectedResult = {
            errors: [
                {
                    message: `No client IDs found. Make sure the ${CLIENT_IDS_ENV_VAR} or ${CLIENT_IDS_WITH_SECRETS_ENV_VAR} environment variable is populated.`,
                    var: CLIENT_IDS_ENV_VAR,
                },
            ],
            warnings: [],
        };

        const result = validateValues(envVarHolder);
        expect(result).toStrictEqual(expectedResult);
    });

    test('should give validation error due to duplicate client ID found in DEVSSOIDP_CLIENT_IDS', () => {
        const envVarHolder = getDefaultEnvVarHolder();
        envVarHolder.clientIdsStr = 'client1,client2,client1';
        envVarHolder.clientIdsWithSecretsStr = undefined;
        envVarHolder.hashSecret = 'false';
        const expectedResult = {
            errors: [
                {
                    message: `Duplicate client ID (client1) in ${CLIENT_IDS_ENV_VAR}.`,
                    var: CLIENT_IDS_ENV_VAR,
                },
            ],
            warnings: [],
        };

        const result = validateValues(envVarHolder);
        expect(result).toStrictEqual(expectedResult);
    });

    test('should give validation error due to duplicate client ID found in DEVSSOIDP_CLIENT_IDS_WITH_SECRETS', () => {
        const envVarHolder = getDefaultEnvVarHolder();
        envVarHolder.clientIdsStr = undefined;
        envVarHolder.clientIdsWithSecretsStr =
            'client1:secret1,client2:secret2,client1:secret3';
        const expectedResult = {
            errors: [
                {
                    message: `Duplicate client ID (client1) in ${CLIENT_IDS_WITH_SECRETS_ENV_VAR}.`,
                    var: CLIENT_IDS_WITH_SECRETS_ENV_VAR,
                },
            ],
            warnings: [],
        };

        const result = validateValues(envVarHolder);
        expect(result).toStrictEqual(expectedResult);
    });

    test('should give validation error if no secret found for a client ID in a situation in which secrets are expected', () => {
        const envVarHolder = getDefaultEnvVarHolder();
        envVarHolder.clientIdsStr = undefined;
        envVarHolder.clientIdsWithSecretsStr =
            'client1:secret1,client2:secret2,client3:';
        const expectedResult = {
            errors: [
                {
                    message: `No secret for client ID client3 in ${CLIENT_IDS_WITH_SECRETS_ENV_VAR}.`,
                    var: CLIENT_IDS_WITH_SECRETS_ENV_VAR,
                },
            ],
            warnings: [],
        };

        const result = validateValues(envVarHolder);
        expect(result).toStrictEqual(expectedResult);
    });

    test('should give validation error if no redirect URIs are found', () => {
        const envVarHolder = getDefaultEnvVarHolder();
        envVarHolder.percentEncodedRedirectUris = '';
        const expectedResult = {
            errors: [
                {
                    message: `No redirect URLs found. Make sure the ${PERCENT_ENCODED_REDIRECT_URIS_ENV_VAR} environment variable is populated with a comma-delimited list of percent (URL) encoded URLs.`,
                    var: PERCENT_ENCODED_REDIRECT_URIS_ENV_VAR,
                },
            ],
            warnings: [],
        };

        const result = validateValues(envVarHolder);
        expect(result).toStrictEqual(expectedResult);
    });

    test('should give validation error if redirect URI is invalid', () => {
        const envVarHolder = getDefaultEnvVarHolder();
        envVarHolder.percentEncodedRedirectUris =
            'https%3A%2F%2Fgoodredirecturi.com%3A5173,https%3A%2F%2Fbadredirect.uri\ud83d';
        const expectedResult = {
            errors: [
                {
                    message: `The ${PERCENT_ENCODED_REDIRECT_URIS_ENV_VAR} environment variable contains invalid redirect URIs: https%3A%2F%2Fbadredirect.uri\ud83d`,
                    var: PERCENT_ENCODED_REDIRECT_URIS_ENV_VAR,
                },
            ],
            warnings: [],
        };

        const result = validateValues(envVarHolder);
        expect(result).toStrictEqual(expectedResult);
    });

    test('should give validation error if there are no salts but salts are needed', () => {
        const envVarHolder = getDefaultEnvVarHolder();
        envVarHolder.saltsForHashingSecret = '';
        const expectedResult = {
            errors: [
                {
                    message: `${SALTS_FOR_HASHING_SECRET_ENV_VAR} must have a value when ${HASH_SECRET_ENV_VAR} is 'true'.`,
                    var: SALTS_FOR_HASHING_SECRET_ENV_VAR,
                },
            ],
            warnings: [],
        };

        const result = validateValues(envVarHolder);
        expect(result).toStrictEqual(expectedResult);
    });

    test('should give validation error if salts should be used and there are more client IDs than salts', () => {
        const envVarHolder = getDefaultEnvVarHolder();
        envVarHolder.saltsForHashingSecret = 'salt1,salt2';
        const expectedResult = {
            errors: [
                {
                    message: `When ${HASH_SECRET_ENV_VAR} is 'true', each client ID/hash pair in ${CLIENT_IDS_WITH_SECRETS_ENV_VAR} must have a corresponding salt in ${SALTS_FOR_HASHING_SECRET_ENV_VAR}. ${CLIENT_IDS_WITH_SECRETS_ENV_VAR} has 3, but ${SALTS_FOR_HASHING_SECRET_ENV_VAR} has 2. Ensure both lists are comma-delimited.`,
                    var: SALTS_FOR_HASHING_SECRET_ENV_VAR,
                },
            ],
            warnings: [],
        };

        const result = validateValues(envVarHolder);
        expect(result).toStrictEqual(expectedResult);
    });

    test('should give validation error if salts should be used and there are fewer client IDs than salts', () => {
        const envVarHolder = getDefaultEnvVarHolder();
        envVarHolder.saltsForHashingSecret = 'salt1,salt2,salt3,salt4';
        const expectedResult = {
            errors: [
                {
                    message: `When ${HASH_SECRET_ENV_VAR} is 'true', each client ID/hash pair in ${CLIENT_IDS_WITH_SECRETS_ENV_VAR} must have a corresponding salt in ${SALTS_FOR_HASHING_SECRET_ENV_VAR}. ${CLIENT_IDS_WITH_SECRETS_ENV_VAR} has 3, but ${SALTS_FOR_HASHING_SECRET_ENV_VAR} has 4. Ensure both lists are comma-delimited.`,
                    var: SALTS_FOR_HASHING_SECRET_ENV_VAR,
                },
            ],
            warnings: [],
        };

        const result = validateValues(envVarHolder);
        expect(result).toStrictEqual(expectedResult);
    });

    test("should have no salt-related validation errors if salts shouldn'nt be used, even if salts are otherwise invalid", () => {
        const envVarHolder = getDefaultEnvVarHolder();
        envVarHolder.hashSecret = 'false';
        envVarHolder.saltsForHashingSecret = 'salt1,salt2';
        const expectedResult = {
            errors: [],
            warnings: [],
        };

        const result = validateValues(envVarHolder);
        expect(result).toStrictEqual(expectedResult);
    });
});
