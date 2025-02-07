import { envVarOrder, getSummaryOfEnvVars } from './envVarSummarizer';
import { EnvVarHolder } from './validateEnvVars';
import {
    HTTP_PORT_ENV_VAR,
    HTTPS_PORT_ENV_VAR,
    USE_HTTP_ENV_VAR,
    USE_HTTPS_ENV_VAR,
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
} from './constants.js';

const defaultEnvVarHolder = new EnvVarHolder();
defaultEnvVarHolder.useHttp = 'true';
defaultEnvVarHolder.httpPort = '3000';
defaultEnvVarHolder.useHttps = 'true';
defaultEnvVarHolder.httpsPort = '3443';
defaultEnvVarHolder.issuer = 'https://example.com';
defaultEnvVarHolder.percentEncodedRedirectUris =
    'http%3A%2F%2Flocalhost%3A5173,http%3A%2F%2Flocalhost%3A8080';
defaultEnvVarHolder.clientIdsWithSecretsStr =
    'relying_party:bnhFJWV2HPIHNiOh+cC796BXAgjbWl8VJAPca4V5K1U=,my_cool_app:QjbYa8VlKM3yBzPwKibD3kaNmTJdfbNloDagTryV1WQ=';
defaultEnvVarHolder.clientIdsStr = 'relying_party,my_cool_app';
defaultEnvVarHolder.hashSecret = 'true';
defaultEnvVarHolder.saltsForHashingSecret =
    'my-super-cool-salt,my-other-almost-as-cool-salt';
defaultEnvVarHolder.idTokenExpirationSeconds = '14400';
defaultEnvVarHolder.ignoreResponseTypeValidation = 'false';
defaultEnvVarHolder.ignoreClientIdValidation = 'false';
defaultEnvVarHolder.ignoreScopeValidation = 'false';
defaultEnvVarHolder.ignoreRedirectUriValidation = 'false';
defaultEnvVarHolder.includeExpiresInInTokenResponse = 'true';
defaultEnvVarHolder.redirectUriOptionalForTokenEndpoint = 'false';
defaultEnvVarHolder.clientIdOptionalForTokenEndpoint = 'false';
defaultEnvVarHolder.enableRefreshTokens = 'true';
defaultEnvVarHolder.logLevel = 'info';
defaultEnvVarHolder.authorizePagePath = '/authorize';
defaultEnvVarHolder.settingsPagePath = '/settings';
defaultEnvVarHolder.environmentPagePath = '/environment';
defaultEnvVarHolder.codeEndpointPath = '/api/v1/code';
defaultEnvVarHolder.tokenEndpointPath = '/api/v1/token';
defaultEnvVarHolder.userInfoEndpointPath = '/api/v1/userInfo';
defaultEnvVarHolder.healthCheckEndpointPath = '/api/v1/health';
defaultEnvVarHolder.healthCheckEnvEndpointPath = '/api/v1/health/env';

describe('src/envVarSummarizer.js', () => {
    test('should provide summary of env vars (in case in which all are valid)', () => {
        const validationResult = {
            errors: [],
            warnings: [],
        };

        const expectedSummary = {
            order: envVarOrder,
            summaries: {
                [USE_HTTP_ENV_VAR]: {
                    value: 'true',
                },
                [HTTP_PORT_ENV_VAR]: {
                    value: '3000',
                },
                [USE_HTTPS_ENV_VAR]: {
                    value: 'true',
                },
                [HTTPS_PORT_ENV_VAR]: {
                    value: '3443',
                },
                [ISSUER_ENV_VAR]: {
                    value: 'https://example.com',
                },
                [PERCENT_ENCODED_REDIRECT_URIS_ENV_VAR]: {
                    value: 'http%3A%2F%2Flocalhost%3A5173,http%3A%2F%2Flocalhost%3A8080',
                },
                [CLIENT_IDS_WITH_SECRETS_ENV_VAR]: {
                    value: 'relying_party:********************************************,my_cool_app:********************************************',
                },
                [CLIENT_IDS_ENV_VAR]: {
                    value: 'relying_party,my_cool_app',
                },
                [HASH_SECRET_ENV_VAR]: {
                    value: 'true',
                },
                [SALTS_FOR_HASHING_SECRET_ENV_VAR]: {
                    value: '******************,****************************',
                },
                [ID_TOKEN_EXPIRATION_SECONDS_ENV_VAR]: {
                    value: '14400',
                },
                [IGNORE_RESPONSE_TYPE_VALIDATION_ENV_VAR]: {
                    value: 'false',
                },
                [IGNORE_CLIENT_ID_VALIDATION_ENV_VAR]: {
                    value: 'false',
                },
                [IGNORE_SCOPE_VALIDATION_ENV_VAR]: {
                    value: 'false',
                },
                [IGNORE_REDIRECT_URI_VALIDATION_ENV_VAR]: {
                    value: 'false',
                },
                [INCLUDE_EXPIRES_IN_IN_TOKEN_RESPONSE_ENV_VAR]: {
                    value: 'true',
                },
                [REDIRECT_URI_OPTIONAL_FOR_TOKEN_ENDPOINT_ENV_VAR]: {
                    value: 'false',
                },
                [CLIENT_ID_OPTIONAL_FOR_TOKEN_ENDPOINT_ENV_VAR]: {
                    value: 'false',
                },
                [ENABLE_REFRESH_TOKENS_ENV_VAR]: {
                    value: 'true',
                },
                [LOG_LEVEL_ENV_VAR]: {
                    value: 'info',
                },
                [AUTHORIZE_PAGE_PATH_ENV_VAR]: {
                    value: '/authorize',
                },
                [SETTINGS_PAGE_PATH_ENV_VAR]: {
                    value: '/settings',
                },
                [ENVIRONMENT_PAGE_PATH_ENV_VAR]: {
                    value: '/environment',
                },
                [CODE_ENDPOINT_PATH_ENV_VAR]: {
                    value: '/api/v1/code',
                },
                [TOKEN_ENDPOINT_PATH_ENV_VAR]: {
                    value: '/api/v1/token',
                },
                [USER_INFO_ENDPOINT_PATH_ENV_VAR]: {
                    value: '/api/v1/userInfo',
                },
                [HEALTH_CHECK_ENDPOINT_PATH_ENV_VAR]: {
                    value: '/api/v1/health',
                },
                [HEALTH_CHECK_ENV_ENDPOINT_PATH_ENV_VAR]: {
                    value: '/api/v1/health/env',
                },
            },
        };

        expect(
            getSummaryOfEnvVars(defaultEnvVarHolder, validationResult)
        ).toEqual(expectedSummary);
    });

    test('should provide summary of env vars (in case in which client IDs are missing)', () => {
        const validationResult = {
            errors: [
                {
                    message: `No client IDs found. Make sure the ${CLIENT_IDS_ENV_VAR} or ${CLIENT_IDS_WITH_SECRETS_ENV_VAR} environment variable is populated.`,
                    var: CLIENT_IDS_ENV_VAR,
                },
            ],
            warnings: [],
        };

        const envVarHolder = { ...defaultEnvVarHolder };
        delete envVarHolder.clientIdsStr;
        delete envVarHolder.clientIdsWithSecretsStr;

        let expectedOrder = [...envVarOrder];
        expectedOrder.splice(expectedOrder.indexOf(CLIENT_IDS_ENV_VAR), 1);
        expectedOrder = [CLIENT_IDS_ENV_VAR, ...expectedOrder];

        const expectedSummary = {
            order: expectedOrder,
            summaries: {
                [USE_HTTP_ENV_VAR]: {
                    value: 'true',
                },
                [HTTP_PORT_ENV_VAR]: {
                    value: '3000',
                },
                [USE_HTTPS_ENV_VAR]: {
                    value: 'true',
                },
                [HTTPS_PORT_ENV_VAR]: {
                    value: '3443',
                },
                [ISSUER_ENV_VAR]: {
                    value: 'https://example.com',
                },
                [PERCENT_ENCODED_REDIRECT_URIS_ENV_VAR]: {
                    value: 'http%3A%2F%2Flocalhost%3A5173,http%3A%2F%2Flocalhost%3A8080',
                },
                [CLIENT_IDS_WITH_SECRETS_ENV_VAR]: {
                    value: '',
                },
                [CLIENT_IDS_ENV_VAR]: {
                    errors: [
                        {
                            message: `No client IDs found. Make sure the ${CLIENT_IDS_ENV_VAR} or ${CLIENT_IDS_WITH_SECRETS_ENV_VAR} environment variable is populated.`,
                        },
                    ],
                    value: undefined,
                },
                [HASH_SECRET_ENV_VAR]: {
                    value: 'true',
                },
                [SALTS_FOR_HASHING_SECRET_ENV_VAR]: {
                    value: '******************,****************************',
                },
                [ID_TOKEN_EXPIRATION_SECONDS_ENV_VAR]: {
                    value: '14400',
                },
                [IGNORE_RESPONSE_TYPE_VALIDATION_ENV_VAR]: {
                    value: 'false',
                },
                [IGNORE_CLIENT_ID_VALIDATION_ENV_VAR]: {
                    value: 'false',
                },
                [IGNORE_SCOPE_VALIDATION_ENV_VAR]: {
                    value: 'false',
                },
                [IGNORE_REDIRECT_URI_VALIDATION_ENV_VAR]: {
                    value: 'false',
                },
                [INCLUDE_EXPIRES_IN_IN_TOKEN_RESPONSE_ENV_VAR]: {
                    value: 'true',
                },
                [REDIRECT_URI_OPTIONAL_FOR_TOKEN_ENDPOINT_ENV_VAR]: {
                    value: 'false',
                },
                [CLIENT_ID_OPTIONAL_FOR_TOKEN_ENDPOINT_ENV_VAR]: {
                    value: 'false',
                },
                [ENABLE_REFRESH_TOKENS_ENV_VAR]: {
                    value: 'true',
                },
                [LOG_LEVEL_ENV_VAR]: {
                    value: 'info',
                },
                [AUTHORIZE_PAGE_PATH_ENV_VAR]: {
                    value: '/authorize',
                },
                [SETTINGS_PAGE_PATH_ENV_VAR]: {
                    value: '/settings',
                },
                [ENVIRONMENT_PAGE_PATH_ENV_VAR]: {
                    value: '/environment',
                },
                [CODE_ENDPOINT_PATH_ENV_VAR]: {
                    value: '/api/v1/code',
                },
                [TOKEN_ENDPOINT_PATH_ENV_VAR]: {
                    value: '/api/v1/token',
                },
                [USER_INFO_ENDPOINT_PATH_ENV_VAR]: {
                    value: '/api/v1/userInfo',
                },
                [HEALTH_CHECK_ENDPOINT_PATH_ENV_VAR]: {
                    value: '/api/v1/health',
                },
                [HEALTH_CHECK_ENV_ENDPOINT_PATH_ENV_VAR]: {
                    value: '/api/v1/health/env',
                },
            },
        };

        expect(getSummaryOfEnvVars(envVarHolder, validationResult)).toEqual(
            expectedSummary
        );
    });

    test('should provide summary of env vars (in case in which both USE_HTTP and USE_HTTPS are false)', () => {
        const validationResult = {
            errors: [
                {
                    message: `At least one of ${USE_HTTP_ENV_VAR} and ${USE_HTTPS_ENV_VAR} must be 'true'.`,
                    var: USE_HTTPS_ENV_VAR,
                },
            ],
            warnings: [],
        };

        const envVarHolder = { ...defaultEnvVarHolder };
        envVarHolder.useHttp = 'false';
        envVarHolder.useHttps = 'false';

        let expectedOrder = [...envVarOrder];
        expectedOrder.splice(expectedOrder.indexOf(USE_HTTP_ENV_VAR), 1);
        expectedOrder.splice(expectedOrder.indexOf(USE_HTTPS_ENV_VAR), 1);
        expectedOrder = [USE_HTTP_ENV_VAR, USE_HTTPS_ENV_VAR, ...expectedOrder];

        const expectedSummary = {
            order: expectedOrder,
            summaries: {
                [USE_HTTP_ENV_VAR]: {
                    value: 'false',
                    errors: [
                        {
                            message: `At least one of ${USE_HTTP_ENV_VAR} and ${USE_HTTPS_ENV_VAR} must be 'true'.`,
                        },
                    ],
                },
                [HTTP_PORT_ENV_VAR]: {
                    value: '3000',
                },
                [USE_HTTPS_ENV_VAR]: {
                    value: 'false',
                    errors: [
                        {
                            message: `At least one of ${USE_HTTP_ENV_VAR} and ${USE_HTTPS_ENV_VAR} must be 'true'.`,
                        },
                    ],
                },
                [HTTPS_PORT_ENV_VAR]: {
                    value: '3443',
                },
                [ISSUER_ENV_VAR]: {
                    value: 'https://example.com',
                },
                [PERCENT_ENCODED_REDIRECT_URIS_ENV_VAR]: {
                    value: 'http%3A%2F%2Flocalhost%3A5173,http%3A%2F%2Flocalhost%3A8080',
                },
                [CLIENT_IDS_WITH_SECRETS_ENV_VAR]: {
                    value: 'relying_party:********************************************,my_cool_app:********************************************',
                },
                [CLIENT_IDS_ENV_VAR]: {
                    value: 'relying_party,my_cool_app',
                },
                [HASH_SECRET_ENV_VAR]: {
                    value: 'true',
                },
                [SALTS_FOR_HASHING_SECRET_ENV_VAR]: {
                    value: '******************,****************************',
                },
                [ID_TOKEN_EXPIRATION_SECONDS_ENV_VAR]: {
                    value: '14400',
                },
                [IGNORE_RESPONSE_TYPE_VALIDATION_ENV_VAR]: {
                    value: 'false',
                },
                [IGNORE_CLIENT_ID_VALIDATION_ENV_VAR]: {
                    value: 'false',
                },
                [IGNORE_SCOPE_VALIDATION_ENV_VAR]: {
                    value: 'false',
                },
                [IGNORE_REDIRECT_URI_VALIDATION_ENV_VAR]: {
                    value: 'false',
                },
                [INCLUDE_EXPIRES_IN_IN_TOKEN_RESPONSE_ENV_VAR]: {
                    value: 'true',
                },
                [REDIRECT_URI_OPTIONAL_FOR_TOKEN_ENDPOINT_ENV_VAR]: {
                    value: 'false',
                },
                [CLIENT_ID_OPTIONAL_FOR_TOKEN_ENDPOINT_ENV_VAR]: {
                    value: 'false',
                },
                [ENABLE_REFRESH_TOKENS_ENV_VAR]: {
                    value: 'true',
                },
                [LOG_LEVEL_ENV_VAR]: {
                    value: 'info',
                },
                [AUTHORIZE_PAGE_PATH_ENV_VAR]: {
                    value: '/authorize',
                },
                [SETTINGS_PAGE_PATH_ENV_VAR]: {
                    value: '/settings',
                },
                [ENVIRONMENT_PAGE_PATH_ENV_VAR]: {
                    value: '/environment',
                },
                [CODE_ENDPOINT_PATH_ENV_VAR]: {
                    value: '/api/v1/code',
                },
                [TOKEN_ENDPOINT_PATH_ENV_VAR]: {
                    value: '/api/v1/token',
                },
                [USER_INFO_ENDPOINT_PATH_ENV_VAR]: {
                    value: '/api/v1/userInfo',
                },
                [HEALTH_CHECK_ENDPOINT_PATH_ENV_VAR]: {
                    value: '/api/v1/health',
                },
                [HEALTH_CHECK_ENV_ENDPOINT_PATH_ENV_VAR]: {
                    value: '/api/v1/health/env',
                },
            },
        };

        expect(getSummaryOfEnvVars(envVarHolder, validationResult)).toEqual(
            expectedSummary
        );
    });
});
