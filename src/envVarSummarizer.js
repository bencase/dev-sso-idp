import { getListFromCommaDelimitedString } from './commonLogic.js';
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

export const envVarOrder = [
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
    ENABLE_REFRESH_TOKENS_ENV_VAR,
    LOG_LEVEL_ENV_VAR,
    AUTHORIZE_PAGE_PATH_ENV_VAR,
    SETTINGS_PAGE_PATH_ENV_VAR,
    ENVIRONMENT_PAGE_PATH_ENV_VAR,
    CODE_ENDPOINT_PATH_ENV_VAR,
    TOKEN_ENDPOINT_PATH_ENV_VAR,
    USER_INFO_ENDPOINT_PATH_ENV_VAR,
    HEALTH_CHECK_ENDPOINT_PATH_ENV_VAR,
    HEALTH_CHECK_ENV_ENDPOINT_PATH_ENV_VAR,
];
const envVarToHolderField = {
    [USE_HTTP_ENV_VAR]: 'useHttp',
    [HTTP_PORT_ENV_VAR]: 'httpPort',
    [USE_HTTPS_ENV_VAR]: 'useHttps',
    [HTTPS_PORT_ENV_VAR]: 'httpsPort',
    [ISSUER_ENV_VAR]: 'issuer',
    [PERCENT_ENCODED_REDIRECT_URIS_ENV_VAR]: 'percentEncodedRedirectUris',
    [CLIENT_IDS_WITH_SECRETS_ENV_VAR]: 'clientIdsWithSecretsStr',
    [CLIENT_IDS_ENV_VAR]: 'clientIdsStr',
    [HASH_SECRET_ENV_VAR]: 'hashSecret',
    [SALTS_FOR_HASHING_SECRET_ENV_VAR]: 'saltsForHashingSecret',
    [ID_TOKEN_EXPIRATION_SECONDS_ENV_VAR]: 'idTokenExpirationSeconds',
    [IGNORE_RESPONSE_TYPE_VALIDATION_ENV_VAR]: 'ignoreResponseTypeValidation',
    [IGNORE_CLIENT_ID_VALIDATION_ENV_VAR]: 'ignoreClientIdValidation',
    [IGNORE_SCOPE_VALIDATION_ENV_VAR]: 'ignoreScopeValidation',
    [IGNORE_REDIRECT_URI_VALIDATION_ENV_VAR]: 'ignoreRedirectUriValidation',
    [INCLUDE_EXPIRES_IN_IN_TOKEN_RESPONSE_ENV_VAR]:
        'includeExpiresInInTokenResponse',
    [REDIRECT_URI_OPTIONAL_FOR_TOKEN_ENDPOINT_ENV_VAR]:
        'redirectUriOptionalForTokenEndpoint',
    [CLIENT_ID_OPTIONAL_FOR_TOKEN_ENDPOINT_ENV_VAR]:
        'clientIdOptionalForTokenEndpoint',
    [ENABLE_REFRESH_TOKENS_ENV_VAR]: 'enableRefreshTokens',
    [LOG_LEVEL_ENV_VAR]: 'logLevel',
    [AUTHORIZE_PAGE_PATH_ENV_VAR]: 'authorizePagePath',
    [SETTINGS_PAGE_PATH_ENV_VAR]: 'settingsPagePath',
    [ENVIRONMENT_PAGE_PATH_ENV_VAR]: 'environmentPagePath',
    [CODE_ENDPOINT_PATH_ENV_VAR]: 'codeEndpointPath',
    [TOKEN_ENDPOINT_PATH_ENV_VAR]: 'tokenEndpointPath',
    [USER_INFO_ENDPOINT_PATH_ENV_VAR]: 'userInfoEndpointPath',
    [HEALTH_CHECK_ENDPOINT_PATH_ENV_VAR]: 'healthCheckEndpointPath',
    [HEALTH_CHECK_ENV_ENDPOINT_PATH_ENV_VAR]: 'healthCheckEnvEndpointPath',
};
const sensitiveEnvVars = [
    CLIENT_IDS_WITH_SECRETS_ENV_VAR,
    SALTS_FOR_HASHING_SECRET_ENV_VAR,
];

const getObscuredString = (str) => {
    return '*'.repeat(str.length);
};

const obscureSecrets = (clientIdWithSecretsStr) => {
    const clientIdSecretPairs = getListFromCommaDelimitedString(
        clientIdWithSecretsStr
    );
    const obscuredClientIdSecretPairs = [];
    for (const clientIdSecretPair of clientIdSecretPairs) {
        if (clientIdSecretPair.includes(':')) {
            const [clientId, secret] = clientIdSecretPair.split(':', 2);
            obscuredClientIdSecretPairs.push(
                `${clientId}:${getObscuredString(secret)}`
            );
        } else {
            obscuredClientIdSecretPairs.push(
                getObscuredString(clientIdSecretPair)
            );
        }
    }
    return obscuredClientIdSecretPairs.join(',');
};

const obscureSalts = (saltsStr) => {
    const salts = getListFromCommaDelimitedString(saltsStr);
    const obscuredSalts = [];
    for (const salt of salts) {
        obscuredSalts.push(getObscuredString(salt));
    }
    return obscuredSalts.join(',');
};

const getValueForEnvVar = (envVar, envVarHolder) => {
    const rawValue = envVarHolder[envVarToHolderField[envVar]];
    if (sensitiveEnvVars.includes(envVar)) {
        if (envVar === CLIENT_IDS_WITH_SECRETS_ENV_VAR) {
            return obscureSecrets(rawValue);
        } else if (envVar === SALTS_FOR_HASHING_SECRET_ENV_VAR) {
            return obscureSalts(rawValue);
        } else {
            return getObscuredString(rawValue);
        }
    } else {
        return rawValue;
    }
};

const initializeSummaryForEnvVar = (envVarSummaries, envVarHolder, envVar) => {
    let summaryForVar = envVarSummaries[envVar];
    if (!summaryForVar) {
        summaryForVar = {};
        envVarSummaries[envVar] = summaryForVar;
    }
    summaryForVar.value = getValueForEnvVar(envVar, envVarHolder);
};

const addFieldToEnvVarSummary = (envVarSummaries, envVar, message, field) => {
    let summaryForVar = envVarSummaries[envVar];
    if (!summaryForVar) {
        summaryForVar = {};
        envVarSummaries[envVar] = summaryForVar;
    }
    let fieldContentsForVar = summaryForVar[field];
    if (!fieldContentsForVar) {
        fieldContentsForVar = [];
        summaryForVar[field] = fieldContentsForVar;
    }
    fieldContentsForVar.push({ message: message });
};

const addErrorToEnvVarSummary = (envVarSummaries, envVar, errorMessage) => {
    addFieldToEnvVarSummary(envVarSummaries, envVar, errorMessage, 'errors');
};

/*
const addWarningToEnvVarSummary = (envVarSummaries, envVar, warnMessage) => {
    addFieldToEnvVarSummary(envVarSummaries, envVar, warnMessage, 'warnings');
};
*/

const summarizeProtocolAndPort = (
    envVarSummaries,
    envVarHolder,
    envVarsValidationResult
) => {
    for (let error of envVarsValidationResult.errors) {
        if (error.var === USE_HTTP_ENV_VAR || error.var === USE_HTTPS_ENV_VAR) {
            addErrorToEnvVarSummary(
                envVarSummaries,
                USE_HTTP_ENV_VAR,
                error.message
            );
            addErrorToEnvVarSummary(
                envVarSummaries,
                USE_HTTPS_ENV_VAR,
                error.message
            );
        }
    }
};

const summarizeOther = (
    envVarSummaries,
    envVarHolder,
    envVarsValidationResult
) => {
    for (let error of envVarsValidationResult.errors) {
        if (error.var !== USE_HTTP_ENV_VAR && error.var !== USE_HTTPS_ENV_VAR) {
            addErrorToEnvVarSummary(envVarSummaries, error.var, error.message);
        }
    }
};

export const getSummaryOfEnvVars = (envVarHolder, envVarsValidationResult) => {
    const envVarSummaries = {};
    envVarOrder.forEach((envVar) =>
        initializeSummaryForEnvVar(envVarSummaries, envVarHolder, envVar)
    );

    summarizeProtocolAndPort(
        envVarSummaries,
        envVarHolder,
        envVarsValidationResult
    );
    summarizeOther(envVarSummaries, envVarHolder, envVarsValidationResult);

    const envVarsWithErrors = [];
    const envVarsWithWarnings = [];
    const envVarsWithNoErrorsOrWarnings = [];

    for (const envVar of envVarOrder) {
        if (
            envVarSummaries[envVar].errors &&
            envVarSummaries[envVar].errors.length > 0
        ) {
            envVarsWithErrors.push(envVar);
        } else if (
            envVarSummaries[envVar].warnings &&
            envVarSummaries[envVar].warnings.length > 0
        ) {
            envVarsWithWarnings.push(envVar);
        } else {
            envVarsWithNoErrorsOrWarnings.push(envVar);
        }
    }

    const finalEnvVarOrder = [
        ...envVarsWithErrors,
        ...envVarsWithWarnings,
        ...envVarsWithNoErrorsOrWarnings,
    ];
    return {
        order: finalEnvVarOrder,
        summaries: envVarSummaries,
    };
};
