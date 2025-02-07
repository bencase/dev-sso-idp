import {
    getClientIdsAndSecretsFromString,
    getListFromCommaDelimitedString,
} from './commonLogic.js';
import {
    USE_HTTP_ENV_VAR,
    USE_HTTPS_ENV_VAR,
    CLIENT_IDS_ENV_VAR,
    CLIENT_IDS_WITH_SECRETS_ENV_VAR,
    PERCENT_ENCODED_REDIRECT_URIS_ENV_VAR,
    HASH_SECRET_ENV_VAR,
    SALTS_FOR_HASHING_SECRET_ENV_VAR,
} from './constants.js';
import { createLogger } from './loggerManager.js';

const logger = createLogger('validateEnvVars');

export class EnvVarHolder {
    useHttp;
    httpPort;
    useHttps;
    httpsPort;
    issuer;
    percentEncodedRedirectUris;
    clientIdsWithSecretsStr;
    clientIdsStr;
    hashSecret;
    saltsForHashingSecret;
    idTokenExpirationSeconds;
    ignoreResponseTypeValidation;
    ignoreClientIdValidation;
    ignoreScopeValidation;
    ignoreRedirectUriValidation;
    includeExpiresInInTokenResponse;
    redirectUriOptionalForTokenEndpoint;
    clientIdOptionalForTokenEndpoint;
    enableRefreshTokens;
    logLevel;
    authorizePagePath;
    settingsPagePath;
    environmentPagePath;
    codeEndpointPath;
    tokenEndpointPath;
    userInfoEndpointPath;
    healthCheckEndpointPath;
    healthCheckEnvEndpointPath;
}

const mergeSubresultIntoResult = (subresult, result) => {
    result.errors = [...result.errors, ...subresult.errors];
    result.warnings = [...result.warnings, ...subresult.warnings];
};

const addError = (result, str, envVar) => {
    logger.error(str);
    result.errors.push({ message: str, var: envVar });
};

const isNeitherHttpNorHttpsSelected = (useHttp, useHttps) => {
    return (
        String(useHttp).toLowerCase() !== 'true' &&
        String(useHttps).toLowerCase() !== 'true'
    );
};

const neitherHttpNorHttpsError = `At least one of ${USE_HTTP_ENV_VAR} and ${USE_HTTPS_ENV_VAR} must be 'true'.`;

const validateHttpHttps = (useHttp, useHttps) => {
    const result = {
        errors: [],
        warnings: [],
    };

    if (isNeitherHttpNorHttpsSelected(useHttp, useHttps)) {
        addError(result, neitherHttpNorHttpsError, USE_HTTPS_ENV_VAR);
        return result;
    }

    return result;
};

const validateClientIdSecretPairs = (clientIdsAndSecrets, validateSecrets) => {
    const result = {
        errors: [],
        warnings: [],
    };

    if (clientIdsAndSecrets.length < 1) {
        addError(
            result,
            `No client IDs found. Make sure the ${CLIENT_IDS_ENV_VAR} or ${CLIENT_IDS_WITH_SECRETS_ENV_VAR} environment variable is populated.`,
            CLIENT_IDS_ENV_VAR
        );
        return result;
    }

    const envVarUsed = validateSecrets
        ? CLIENT_IDS_WITH_SECRETS_ENV_VAR
        : CLIENT_IDS_ENV_VAR;
    const distinctClientIds = [];
    for (const pair of clientIdsAndSecrets) {
        const clientId = pair.clientId;
        if (distinctClientIds.includes(clientId)) {
            addError(
                result,
                `Duplicate client ID (${clientId}) in ${envVarUsed}.`,
                envVarUsed
            );
        } else {
            distinctClientIds.push(clientId);
        }

        if (validateSecrets) {
            const secret = pair.secret;
            if (!secret || secret.length < 1) {
                addError(
                    result,
                    `No secret for client ID ${clientId} in ${CLIENT_IDS_WITH_SECRETS_ENV_VAR}.`,
                    CLIENT_IDS_WITH_SECRETS_ENV_VAR
                );
            }
        }
    }

    return result;
};

const validateRedirectUris = (percentEncodedRedirectUris) => {
    const result = {
        errors: [],
        warnings: [],
    };

    const redirectUris = getListFromCommaDelimitedString(
        percentEncodedRedirectUris
    );
    if (!redirectUris || redirectUris.length === 0) {
        addError(
            result,
            `No redirect URLs found. Make sure the ${PERCENT_ENCODED_REDIRECT_URIS_ENV_VAR} environment variable is populated with a comma-delimited list of percent (URL) encoded URLs.`,
            PERCENT_ENCODED_REDIRECT_URIS_ENV_VAR
        );
    } else {
        let invalidUrls = [];
        for (const redirectUri of redirectUris) {
            const decodedUri = decodeURIComponent(redirectUri);
            try {
                new URL(decodedUri);
            } catch {
                invalidUrls.push(redirectUri);
            }
        }
        if (invalidUrls.length > 0) {
            addError(
                result,
                `The ${PERCENT_ENCODED_REDIRECT_URIS_ENV_VAR} environment variable contains invalid redirect URIs: ${invalidUrls}`,
                PERCENT_ENCODED_REDIRECT_URIS_ENV_VAR
            );
        }
    }

    return result;
};

const validateHashSettings = (
    hashSecret,
    saltsForHashingSecret,
    clientIdsAndSecrets
) => {
    const result = {
        errors: [],
        warnings: [],
    };

    if (String(hashSecret).toLowerCase() !== 'true') {
        return result;
    }

    // Check for presence of salts
    if (!saltsForHashingSecret) {
        addError(
            result,
            `${SALTS_FOR_HASHING_SECRET_ENV_VAR} must have a value when ${HASH_SECRET_ENV_VAR} is 'true'.`,
            SALTS_FOR_HASHING_SECRET_ENV_VAR
        );
    } else {
        // Check to make sure there is a salt for each client ID/hash pair.
        const salts = getListFromCommaDelimitedString(saltsForHashingSecret);
        if (clientIdsAndSecrets.length !== salts.length) {
            addError(
                result,
                `When ${HASH_SECRET_ENV_VAR} is 'true', each client ID/hash pair in ${CLIENT_IDS_WITH_SECRETS_ENV_VAR} must have a corresponding salt in ${SALTS_FOR_HASHING_SECRET_ENV_VAR}. ${CLIENT_IDS_WITH_SECRETS_ENV_VAR} has ${clientIdsAndSecrets.length}, but ${SALTS_FOR_HASHING_SECRET_ENV_VAR} has ${salts.length}. Ensure both lists are comma-delimited.`,
                SALTS_FOR_HASHING_SECRET_ENV_VAR
            );
        }
    }

    return result;
};

export const validateValues = (envVarHolder) => {
    const {
        clientIdsStr,
        clientIdsWithSecretsStr,
        percentEncodedRedirectUris,
        useHttp,
        useHttps,
        hashSecret,
        saltsForHashingSecret,
    } = envVarHolder;

    const result = {
        errors: [],
        warnings: [],
    };

    let subresult = validateHttpHttps(useHttp, useHttps);
    mergeSubresultIntoResult(subresult, result);

    const clientIdsAndSecrets = getClientIdsAndSecretsFromString(
        clientIdsStr,
        clientIdsWithSecretsStr
    );
    subresult = validateClientIdSecretPairs(
        clientIdsAndSecrets,
        clientIdsWithSecretsStr && clientIdsWithSecretsStr.length > 0
    );
    mergeSubresultIntoResult(subresult, result);

    subresult = validateRedirectUris(percentEncodedRedirectUris);
    mergeSubresultIntoResult(subresult, result);

    subresult = validateHashSettings(
        hashSecret,
        saltsForHashingSecret,
        clientIdsAndSecrets
    );
    mergeSubresultIntoResult(subresult, result);

    if (isNeitherHttpNorHttpsSelected(useHttp, useHttps)) {
        throw new Error(neitherHttpNorHttpsError);
    }

    return result;
};
