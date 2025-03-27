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
import { EnvVarHolder } from './validateEnvVars.js';

export const getEnvVarHolder = () => {
    const evHolder = new EnvVarHolder();
    evHolder.useHttp = process.env[USE_HTTP_ENV_VAR];
    evHolder.httpPort = process.env[HTTP_PORT_ENV_VAR];
    evHolder.useHttps = process.env[USE_HTTPS_ENV_VAR];
    evHolder.httpsPort = process.env[HTTPS_PORT_ENV_VAR];
    evHolder.issuer = process.env[ISSUER_ENV_VAR];
    evHolder.percentEncodedRedirectUris =
        process.env[PERCENT_ENCODED_REDIRECT_URIS_ENV_VAR];
    evHolder.clientIdsWithSecretsStr =
        process.env[CLIENT_IDS_WITH_SECRETS_ENV_VAR];
    evHolder.clientIdsStr = process.env[CLIENT_IDS_ENV_VAR];
    evHolder.hashSecret = process.env[HASH_SECRET_ENV_VAR];
    evHolder.saltsForHashingSecret =
        process.env[SALTS_FOR_HASHING_SECRET_ENV_VAR];
    evHolder.idTokenExpirationSeconds =
        process.env[ID_TOKEN_EXPIRATION_SECONDS_ENV_VAR];
    evHolder.ignoreResponseTypeValidation =
        process.env[IGNORE_RESPONSE_TYPE_VALIDATION_ENV_VAR];
    evHolder.ignoreClientIdValidation =
        process.env[IGNORE_CLIENT_ID_VALIDATION_ENV_VAR];
    evHolder.ignoreScopeValidation =
        process.env[IGNORE_SCOPE_VALIDATION_ENV_VAR];
    evHolder.ignoreRedirectUriValidation =
        process.env[IGNORE_REDIRECT_URI_VALIDATION_ENV_VAR];
    evHolder.includeExpiresInInTokenResponse =
        process.env[INCLUDE_EXPIRES_IN_IN_TOKEN_RESPONSE_ENV_VAR];
    evHolder.redirectUriOptionalForTokenEndpoint =
        process.env[REDIRECT_URI_OPTIONAL_FOR_TOKEN_ENDPOINT_ENV_VAR];
    evHolder.clientIdOptionalForTokenEndpoint =
        process.env[CLIENT_ID_OPTIONAL_FOR_TOKEN_ENDPOINT_ENV_VAR];
    evHolder.enableRefreshTokens = process.env[ENABLE_REFRESH_TOKENS_ENV_VAR];
    evHolder.excludeUserInfoFromIdToken =
        process.env[EXCLUDE_USER_INFO_FROM_ID_TOKEN_ENV_VAR];
    evHolder.idTokenNameField = process.env[ID_TOKEN_NAME_FIELD_ENV_VAR];
    evHolder.idTokenUsernameField =
        process.env[ID_TOKEN_USERNAME_FIELD_ENV_VAR];
    evHolder.idTokenFirstNameField =
        process.env[ID_TOKEN_FIRST_NAME_FIELD_ENV_VAR];
    evHolder.idTokenMiddleNameField =
        process.env[ID_TOKEN_MIDDLE_NAME_FIELD_ENV_VAR];
    evHolder.idTokenLastNameField =
        process.env[ID_TOKEN_LAST_NAME_FIELD_ENV_VAR];
    evHolder.idTokenEmailField = process.env[ID_TOKEN_EMAIL_FIELD_ENV_VAR];
    evHolder.logLevel = process.env[LOG_LEVEL_ENV_VAR];
    evHolder.authorizePagePath = process.env[AUTHORIZE_PAGE_PATH_ENV_VAR];
    evHolder.settingsPagePath = process.env[SETTINGS_PAGE_PATH_ENV_VAR];
    evHolder.environmentPagePath = process.env[ENVIRONMENT_PAGE_PATH_ENV_VAR];
    evHolder.codeEndpointPath = process.env[CODE_ENDPOINT_PATH_ENV_VAR];
    evHolder.tokenEndpointPath = process.env[TOKEN_ENDPOINT_PATH_ENV_VAR];
    evHolder.userInfoEndpointPath =
        process.env[USER_INFO_ENDPOINT_PATH_ENV_VAR];
    evHolder.healthCheckEndpointPath =
        process.env[HEALTH_CHECK_ENDPOINT_PATH_ENV_VAR];
    evHolder.healthCheckEnvEndpointPath =
        process.env[HEALTH_CHECK_ENV_ENDPOINT_PATH_ENV_VAR];
    return evHolder;
};
