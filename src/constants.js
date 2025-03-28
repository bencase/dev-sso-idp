export const logLevelError = 'error';
export const logLevelWarn = 'warn';

export const correlationIdHeader = 'correlationId';

export const DEFAULT_PORT = 3000;
export const DEFAULT_HTTPS_PORT = 3443;

export const USE_HTTP_ENV_VAR = 'DEVSSOIDP_USE_HTTP';
export const HTTP_PORT_ENV_VAR = 'DEVSSOIDP_HTTP_PORT';
export const USE_HTTPS_ENV_VAR = 'DEVSSOIDP_USE_HTTPS';
export const HTTPS_PORT_ENV_VAR = 'DEVSSOIDP_HTTPS_PORT';
export const ISSUER_ENV_VAR = 'DEVSSOIDP_ISSUER';
export const PERCENT_ENCODED_REDIRECT_URIS_ENV_VAR =
    'DEVSSOIDP_PERCENT_ENCODED_REDIRECT_URIS';
export const CLIENT_IDS_WITH_SECRETS_ENV_VAR =
    'DEVSSOIDP_CLIENT_IDS_WITH_SECRETS';
export const CLIENT_IDS_ENV_VAR = 'DEVSSOIDP_CLIENT_IDS';
export const HASH_SECRET_ENV_VAR = 'DEVSSOIDP_HASH_SECRET';
export const SALTS_FOR_HASHING_SECRET_ENV_VAR =
    'DEVSSOIDP_SALTS_FOR_HASHING_SECRET';
export const ID_TOKEN_EXPIRATION_SECONDS_ENV_VAR =
    'DEVSSOIDP_ID_TOKEN_EXPIRATION_SECONDS';
export const IGNORE_RESPONSE_TYPE_VALIDATION_ENV_VAR =
    'DEVSSOIDP_IGNORE_RESPONSE_TYPE_VALIDATION';
export const IGNORE_CLIENT_ID_VALIDATION_ENV_VAR =
    'DEVSSOIDP_IGNORE_CLIENT_ID_VALIDATION';
export const IGNORE_SCOPE_VALIDATION_ENV_VAR =
    'DEVSSOIDP_IGNORE_SCOPE_VALIDATION';
export const IGNORE_REDIRECT_URI_VALIDATION_ENV_VAR =
    'DEVSSOIDP_IGNORE_REDIRECT_URI_VALIDATION';
export const INCLUDE_EXPIRES_IN_IN_TOKEN_RESPONSE_ENV_VAR =
    'DEVSSOIDP_INCLUDE_EXPIRES_IN_IN_TOKEN_RESPONSE';
export const REDIRECT_URI_OPTIONAL_FOR_TOKEN_ENDPOINT_ENV_VAR =
    'DEVSSOIDP_REDIRECT_URI_OPTIONAL_FOR_TOKEN_ENDPOINT';
export const CLIENT_ID_OPTIONAL_FOR_TOKEN_ENDPOINT_ENV_VAR =
    'DEVSSOIDP_CLIENT_ID_OPTIONAL_FOR_TOKEN_ENDPOINT';
export const ENABLE_REFRESH_TOKENS_ENV_VAR = 'DEVSSOIDP_ENABLE_REFRESH_TOKENS';
export const EXCLUDE_USER_INFO_FROM_ID_TOKEN_ENV_VAR =
    'DEVSSOIDP_EXCLUDE_USER_INFO_FROM_ID_TOKEN';
export const ID_TOKEN_NAME_FIELD_ENV_VAR = 'DEVSSOIDP_ID_TOKEN_NAME_FIELD';
export const ID_TOKEN_USERNAME_FIELD_ENV_VAR =
    'DEVSSOIDP_ID_TOKEN_USERNAME_FIELD';
export const ID_TOKEN_FIRST_NAME_FIELD_ENV_VAR =
    'DEVSSOIDP_ID_TOKEN_FIRST_NAME_FIELD';
export const ID_TOKEN_MIDDLE_NAME_FIELD_ENV_VAR =
    'DEVSSOIDP_ID_TOKEN_MIDDLE_NAME_FIELD';
export const ID_TOKEN_LAST_NAME_FIELD_ENV_VAR =
    'DEVSSOIDP_ID_TOKEN_LAST_NAME_FIELD';
export const ID_TOKEN_EMAIL_FIELD_ENV_VAR = 'DEVSSOIDP_ID_TOKEN_EMAIL_FIELD';
export const LOG_LEVEL_ENV_VAR = 'DEVSSOIDP_LOG_LEVEL';
export const AUTHORIZE_PAGE_PATH_ENV_VAR = 'DEVSSOIDP_AUTHORIZE_PAGE_PATH';
export const SETTINGS_PAGE_PATH_ENV_VAR = 'DEVSSOIDP_SETTINGS_PAGE_PATH';
export const ENVIRONMENT_PAGE_PATH_ENV_VAR = 'DEVSSOIDP_ENVIRONMENT_PAGE_PATH';
export const CODE_ENDPOINT_PATH_ENV_VAR = 'DEVSSOIDP_CODE_ENDPOINT_PATH';
export const TOKEN_ENDPOINT_PATH_ENV_VAR = 'DEVSSOIDP_TOKEN_ENDPOINT_PATH';
export const USER_INFO_ENDPOINT_PATH_ENV_VAR =
    'DEVSSOIDP_USER_INFO_ENDPOINT_PATH';
export const HEALTH_CHECK_ENDPOINT_PATH_ENV_VAR =
    'DEVSSOIDP_HEALTH_CHECK_ENDPOINT_PATH';
export const HEALTH_CHECK_ENV_ENDPOINT_PATH_ENV_VAR =
    'DEVSSOIDP_HEALTH_CHECK_ENV_ENDPOINT_PATH';

export const profileInfo = {
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
};
export const emailInfo = {
    email: 'tuser@example.com',
    email_verified: true,
};
export const addressInfo = {
    address: {
        formatted: '248 Live Oak Lane\nAustin, TX 78787\nUnited States',
        street_address: '248 Live Oak Lane',
        locality: 'Austin',
        region: 'TX',
        postal_code: '78787',
        country: 'United States',
    },
};
export const phoneInfo = {
    phone_number: '+1 (555) 555-5555',
    phone_number_verified: true,
};
