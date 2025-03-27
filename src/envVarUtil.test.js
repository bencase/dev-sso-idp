import {
    USE_HTTP_ENV_VAR,
    HTTP_PORT_ENV_VAR,
    USE_HTTPS_ENV_VAR,
    HTTPS_PORT_ENV_VAR,
    ISSUER_ENV_VAR,
    PERCENT_ENCODED_REDIRECT_URIS_ENV_VAR,
    CLIENT_IDS_WITH_SECRETS_ENV_VAR,
    CLIENT_IDS_ENV_VAR,
    HASH_SECRET_ENV_VAR,
    SALTS_FOR_HASHING_SECRET_ENV_VAR,
    ID_TOKEN_EXPIRATION_SECONDS_ENV_VAR,
    IGNORE_RESPONSE_TYPE_VALIDATION_ENV_VAR,
    IGNORE_CLIENT_ID_VALIDATION_ENV_VAR,
    IGNORE_SCOPE_VALIDATION_ENV_VAR,
    IGNORE_REDIRECT_URI_VALIDATION_ENV_VAR,
    INCLUDE_EXPIRES_IN_IN_TOKEN_RESPONSE_ENV_VAR,
    REDIRECT_URI_OPTIONAL_FOR_TOKEN_ENDPOINT_ENV_VAR,
    CLIENT_ID_OPTIONAL_FOR_TOKEN_ENDPOINT_ENV_VAR,
    LOG_LEVEL_ENV_VAR,
    AUTHORIZE_PAGE_PATH_ENV_VAR,
    SETTINGS_PAGE_PATH_ENV_VAR,
    ENVIRONMENT_PAGE_PATH_ENV_VAR,
    CODE_ENDPOINT_PATH_ENV_VAR,
    TOKEN_ENDPOINT_PATH_ENV_VAR,
    USER_INFO_ENDPOINT_PATH_ENV_VAR,
    HEALTH_CHECK_ENDPOINT_PATH_ENV_VAR,
    HEALTH_CHECK_ENV_ENDPOINT_PATH_ENV_VAR,
    ENABLE_REFRESH_TOKENS_ENV_VAR,
    EXCLUDE_USER_INFO_FROM_ID_TOKEN_ENV_VAR,
    ID_TOKEN_NAME_FIELD_ENV_VAR,
    ID_TOKEN_USERNAME_FIELD_ENV_VAR,
    ID_TOKEN_FIRST_NAME_FIELD_ENV_VAR,
    ID_TOKEN_MIDDLE_NAME_FIELD_ENV_VAR,
    ID_TOKEN_LAST_NAME_FIELD_ENV_VAR,
    ID_TOKEN_EMAIL_FIELD_ENV_VAR,
} from './constants.js';
import { getEnvVarHolder } from './envVarUtil';

describe('src/envVarUtil.js', () => {
    const originalEnv = process.env;

    beforeEach(() => {
        process.env = { ...originalEnv };
    });

    afterEach(() => {
        process.env = originalEnv;
    });
    test('should return an EnvVarHolder object having environment variables', () => {
        process.env[USE_HTTP_ENV_VAR] = 'true';
        process.env[HTTP_PORT_ENV_VAR] = '3000';
        process.env[USE_HTTPS_ENV_VAR] = 'false';
        process.env[HTTPS_PORT_ENV_VAR] = '3443';
        process.env[ISSUER_ENV_VAR] = 'https://example.com';
        process.env[PERCENT_ENCODED_REDIRECT_URIS_ENV_VAR] = 'true';
        process.env[CLIENT_IDS_WITH_SECRETS_ENV_VAR] =
            'client1:secret1,client2:secret2';
        process.env[CLIENT_IDS_ENV_VAR] = 'client1,client2';
        process.env[HASH_SECRET_ENV_VAR] = 'hashSecret';
        process.env[SALTS_FOR_HASHING_SECRET_ENV_VAR] = 'salt1,salt2';
        process.env[ID_TOKEN_EXPIRATION_SECONDS_ENV_VAR] = '3600';
        process.env[IGNORE_RESPONSE_TYPE_VALIDATION_ENV_VAR] = 'false';
        process.env[IGNORE_CLIENT_ID_VALIDATION_ENV_VAR] = 'false';
        process.env[IGNORE_SCOPE_VALIDATION_ENV_VAR] = 'false';
        process.env[IGNORE_REDIRECT_URI_VALIDATION_ENV_VAR] = 'true';
        process.env[INCLUDE_EXPIRES_IN_IN_TOKEN_RESPONSE_ENV_VAR] = 'true';
        process.env[REDIRECT_URI_OPTIONAL_FOR_TOKEN_ENDPOINT_ENV_VAR] = 'true';
        process.env[CLIENT_ID_OPTIONAL_FOR_TOKEN_ENDPOINT_ENV_VAR] = 'true';
        process.env[ENABLE_REFRESH_TOKENS_ENV_VAR] = 'true';
        process.env[EXCLUDE_USER_INFO_FROM_ID_TOKEN_ENV_VAR] = 'false';
        process.env[ID_TOKEN_NAME_FIELD_ENV_VAR] = 'name';
        process.env[ID_TOKEN_USERNAME_FIELD_ENV_VAR] = 'preferred_username';
        process.env[ID_TOKEN_FIRST_NAME_FIELD_ENV_VAR] = 'given_name';
        process.env[ID_TOKEN_MIDDLE_NAME_FIELD_ENV_VAR] = 'middle_name';
        process.env[ID_TOKEN_LAST_NAME_FIELD_ENV_VAR] = 'family_name';
        process.env[ID_TOKEN_EMAIL_FIELD_ENV_VAR] = 'email';
        process.env[LOG_LEVEL_ENV_VAR] = 'debug';
        process.env[AUTHORIZE_PAGE_PATH_ENV_VAR] = '/api/v1/authorize';
        process.env[SETTINGS_PAGE_PATH_ENV_VAR] = '/api/v1/settings';
        process.env[ENVIRONMENT_PAGE_PATH_ENV_VAR] = '/api/v1/environment';
        process.env[CODE_ENDPOINT_PATH_ENV_VAR] = '/api/v1/code';
        process.env[TOKEN_ENDPOINT_PATH_ENV_VAR] = '/api/v1/token';
        process.env[USER_INFO_ENDPOINT_PATH_ENV_VAR] = '/api/v1/userinfo';
        process.env[HEALTH_CHECK_ENDPOINT_PATH_ENV_VAR] = '/api/v1/health';
        process.env[HEALTH_CHECK_ENV_ENDPOINT_PATH_ENV_VAR] =
            '/api/v1/health/env';

        const evHolder = getEnvVarHolder();

        expect(evHolder.useHttp).toBe('true');
        expect(evHolder.httpPort).toBe('3000');
        expect(evHolder.useHttps).toBe('false');
        expect(evHolder.httpsPort).toBe('3443');
        expect(evHolder.issuer).toBe('https://example.com');
        expect(evHolder.percentEncodedRedirectUris).toBe('true');
        expect(evHolder.clientIdsWithSecretsStr).toBe(
            'client1:secret1,client2:secret2'
        );
        expect(evHolder.clientIdsStr).toBe('client1,client2');
        expect(evHolder.hashSecret).toBe('hashSecret');
        expect(evHolder.saltsForHashingSecret).toBe('salt1,salt2');
        expect(evHolder.idTokenExpirationSeconds).toBe('3600');
        expect(evHolder.ignoreResponseTypeValidation).toBe('false');
        expect(evHolder.ignoreClientIdValidation).toBe('false');
        expect(evHolder.ignoreScopeValidation).toBe('false');
        expect(evHolder.ignoreRedirectUriValidation).toBe('true');
        expect(evHolder.includeExpiresInInTokenResponse).toBe('true');
        expect(evHolder.redirectUriOptionalForTokenEndpoint).toBe('true');
        expect(evHolder.clientIdOptionalForTokenEndpoint).toBe('true');
        expect(evHolder.enableRefreshTokens).toBe('true');
        expect(evHolder.excludeUserInfoFromIdToken).toBe('false');
        expect(evHolder.idTokenNameField).toBe('name');
        expect(evHolder.idTokenUsernameField).toBe('preferred_username');
        expect(evHolder.idTokenFirstNameField).toBe('given_name');
        expect(evHolder.idTokenMiddleNameField).toBe('middle_name');
        expect(evHolder.idTokenLastNameField).toBe('family_name');
        expect(evHolder.idTokenEmailField).toBe('email');
        expect(evHolder.logLevel).toBe('debug');
        expect(evHolder.authorizePagePath).toBe('/api/v1/authorize');
        expect(evHolder.settingsPagePath).toBe('/api/v1/settings');
        expect(evHolder.environmentPagePath).toBe('/api/v1/environment');
        expect(evHolder.codeEndpointPath).toBe('/api/v1/code');
        expect(evHolder.tokenEndpointPath).toBe('/api/v1/token');
        expect(evHolder.userInfoEndpointPath).toBe('/api/v1/userinfo');
        expect(evHolder.healthCheckEndpointPath).toBe('/api/v1/health');
        expect(evHolder.healthCheckEnvEndpointPath).toBe('/api/v1/health/env');
    });
});
