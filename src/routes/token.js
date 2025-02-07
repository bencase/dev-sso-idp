import {
    checkCode,
    getNonceFromCode,
    getScopesFromCode,
} from '../codeManagement.js';
import {
    accessDeniedWithLog,
    getClientIdsAndSecretsFromString,
    getListFromCommaDelimitedString,
    getScopeListFromSpaceDelimitedString,
} from '../commonLogic.js';
import {
    correlationIdHeader,
    logLevelError,
    logLevelWarn,
} from '../constants.js';
import {
    checkCredentials,
    getClientIdAndSecretFromHeaderAuthorizationCredentials,
    getSecretForClientId,
} from '../credentialManagement.js';
import { createLogger } from '../loggerManager.js';
import {
    getAccessToken,
    getIdToken,
    getRefreshToken,
} from '../tokenManagement.js';

const idTokenType = 'Bearer';

const logger = createLogger('token');

const grantTypeCode = 'authorization_code';
const grantTypeRefreshToken = 'refresh_token';

const useRefreshTokenInsteadOfCode = (refreshToken, enableRefreshTokens) => {
    return refreshToken && enableRefreshTokens;
};

const validateTokenRouteRequestBodyProperties = (
    grantType,
    code,
    refreshToken,
    redirectUri,
    clientId,
    mustCheckCredentials,
    mustCheckRedirectUri,
    mustCheckClientId,
    enableRefreshTokens
) => {
    let problems = [];

    // Check grant_type
    if (enableRefreshTokens) {
        if (!grantType) {
            problems.push(
                `Request body must include property "grant_type", and "grant_type" must be "${grantTypeCode}" or "${grantTypeRefreshToken}".`
            );
        } else if (
            grantType !== grantTypeCode &&
            grantType !== grantTypeRefreshToken
        ) {
            problems.push(
                `"grant_type" must be "${grantTypeCode}" or "${grantTypeRefreshToken}".`
            );
        }
    } else {
        if (!grantType) {
            problems.push(
                `Request body must include property "grant_type", and "grant_type" must be "${grantTypeCode}".`
            );
        } else if (grantType !== grantTypeCode) {
            problems.push(`"grant_type" must be "${grantTypeCode}".`);
        }
    }

    // Check for existence of either code or refresh_token in request body
    if (enableRefreshTokens) {
        if (!(code || refreshToken)) {
            problems.push(
                `Request body must include property "code" or "refresh_token".`
            );
        }
    } else {
        if (!code) {
            problems.push(`Request body must include property "code".`);
        }
    }

    // Check for existence of redirect URI if applicable (i.e. if environment variable for disabling this check is not set, and refresh token isn't being used)
    if (
        mustCheckRedirectUri &&
        !redirectUri &&
        !useRefreshTokenInsteadOfCode(refreshToken, enableRefreshTokens)
    ) {
        problems.push(
            `Request body must include property "redirect_uri", and it must exactly match the redirect_uri used when getting the code.`
        );
    }

    // According to the OAuth specification section 4.1.3, if credentials are used, the client_id doesn't need to be in the request body
    // https://www.rfc-editor.org/rfc/rfc6749.html#section-4.1.3
    if (!mustCheckCredentials && mustCheckClientId && !clientId) {
        problems.push(
            `Request body must include property "client_id", and it must exactly match the client_id used when getting the code.`
        );
    }
    return problems;
};

const getSaltForClientId = (
    clientId,
    saltsStr,
    clientIdsStr,
    clientIdsWithSecretsStr
) => {
    const clientIdsAndSecrets = getClientIdsAndSecretsFromString(
        clientIdsStr,
        clientIdsWithSecretsStr
    );
    const salts = getListFromCommaDelimitedString(saltsStr);

    // The above lists should be the same length, but since it's not the job of this part of the code to check that, it finds the least length of the lists just to be safe.
    const range =
        clientIdsAndSecrets.length > salts.length
            ? salts.length
            : clientIdsAndSecrets.length;

    for (let i = 0; i < range; i++) {
        const clientIdAndSecret = clientIdsAndSecrets[i];
        if (clientIdAndSecret.clientId === clientId) {
            return salts[i];
        }
    }
};

const performCredentialsCheck = (
    credentials,
    clientIdsStr,
    clientIdsWithSecretsStr,
    mustHashSecret,
    salts,
    correlationId,
    res
) => {
    if (!credentials) {
        accessDeniedWithLog(
            logger,
            logLevelWarn,
            `Credentials not found. Credentials must be in the 'Authorization' header, in the format 'Basic <base64-encoded-credentials>', where 'base64-encoded-credentials' are the client ID and secret separated by a colon and then encoded together in base64.`,
            { correlationId: correlationId },
            res
        );
        return [false, clientId];
    }

    const [basic, b64creds] = credentials.split(' ');
    if (basic !== 'Basic') {
        accessDeniedWithLog(
            logger,
            logLevelWarn,
            `Value in 'Authorization' header must start with 'Basic '`,
            { correlationId: correlationId },
            res
        );
        return [false, clientId];
    }

    if (!b64creds) {
        accessDeniedWithLog(
            logger,
            logLevelWarn,
            `Value in 'Authorization' header must have 'Basic ' followed by credentials. Credentials must consist of the client ID and secret separated by a colon and then encoded together in base64.`,
            { correlationId: correlationId },
            res
        );
        return [false, clientId];
    }

    let clientId, providedSecret;
    try {
        [clientId, providedSecret] =
            getClientIdAndSecretFromHeaderAuthorizationCredentials(
                b64creds,
                correlationId
            );
    } catch (err) {
        accessDeniedWithLog(
            logger,
            logLevelWarn,
            err,
            { correlationId: correlationId },
            res
        );
        return [false, clientId];
    }

    let expectedSecret;
    try {
        expectedSecret = getSecretForClientId(
            clientId,
            clientIdsStr,
            clientIdsWithSecretsStr
        );
    } catch (err) {
        accessDeniedWithLog(
            logger,
            logLevelError,
            `Error on attempting to get secret for client ID ${clientId}: ${err}`,
            { correlationId: correlationId },
            res
        );
        return [false, clientId];
    }

    const salt = getSaltForClientId(
        clientId,
        salts,
        clientIdsStr,
        clientIdsWithSecretsStr
    );

    const credsPass = checkCredentials(
        clientId,
        providedSecret,
        expectedSecret,
        mustHashSecret,
        salt,
        correlationId
    );
    if (!credsPass) {
        accessDeniedWithLog(
            logger,
            logLevelWarn,
            `Provided secret and expected secret do not match for authentication attempt of client ID ${clientId}`,
            { correlationId: correlationId },
            res
        );
        return [false, clientId];
    } else {
        return [true, clientId];
    }
};

export const makeTokenRoute = (routerParams) => (req, res) => {
    const {
        clientIdsStr,
        clientIdsWithSecretsStr,
        issuer,
        idTokenExpirationSeconds,
        salts,
        mustUseCredentials,
        mustHashSecret,
        mustCheckRedirectUri,
        mustCheckClientId,
        includeExpiresInInTokenResponse,
        enableRefreshTokens,
    } = routerParams;

    const correlationId = req.header(correlationIdHeader);
    let credentials = '';
    if (mustUseCredentials) {
        credentials = req.header('Authorization');
    }
    const grantType = req.body.grant_type;
    const code = req.body.code;
    const refreshToken = req.body.refresh_token;
    const redirectUri = req.body.redirect_uri;
    const scopesStr = req.body.scope;
    let clientId = req.body.client_id;

    const shouldUseRefreshToken = useRefreshTokenInsteadOfCode(
        refreshToken,
        enableRefreshTokens
    );

    const validationProblems = validateTokenRouteRequestBodyProperties(
        grantType,
        code,
        refreshToken,
        redirectUri,
        clientId,
        mustUseCredentials,
        mustCheckRedirectUri,
        mustCheckClientId,
        enableRefreshTokens
    );
    if (validationProblems.length > 0) {
        const message = `Request is invalid: ${validationProblems}`;
        logger.warn(message, { correlationId: correlationId });
        res.status(400).json({
            message: message,
        });
        return;
    }

    // Check credentials
    if (mustUseCredentials) {
        let credentialsCheckPassed;
        [credentialsCheckPassed, clientId] = performCredentialsCheck(
            credentials,
            clientIdsStr,
            clientIdsWithSecretsStr,
            mustHashSecret,
            salts,
            correlationId,
            res
        );
        if (!credentialsCheckPassed) {
            return;
        }
    }

    // Check code or refresh token (Note: the code check implicitly checks whether the redirect URI and client ID were the same as used when getting the code)
    const isCodeOrRefreshTokenValid = (() => {
        if (shouldUseRefreshToken) {
            return checkCode(
                refreshToken,
                undefined,
                clientId,
                false,
                mustCheckClientId
            );
        } else {
            return checkCode(
                code,
                redirectUri,
                clientId,
                mustCheckRedirectUri,
                mustCheckClientId
            );
        }
    })();
    if (!isCodeOrRefreshTokenValid) {
        if (shouldUseRefreshToken) {
            accessDeniedWithLog(
                logger,
                logLevelWarn,
                `Refresh token not valid for authentication attempt with client ID ${clientId}`,
                { correlationId: correlationId },
                res
            );
            return;
        } else {
            accessDeniedWithLog(
                logger,
                logLevelWarn,
                `Code not valid for authentication attempt with client ID ${clientId}`,
                { correlationId: correlationId },
                res
            );
            return;
        }
    }

    // Get scopes
    const scopes = (() => {
        if (shouldUseRefreshToken) {
            let scopesList = getScopesFromCode(refreshToken);
            // If the request body includes scopes, then the scopes for tokens returned by this endpoint
            // should include only scopes that are in both the refresh token and the request body.
            if (scopesStr) {
                let reqBodyScopesList =
                    getScopeListFromSpaceDelimitedString(scopesStr);
                if (reqBodyScopesList.length > 0) {
                    scopesList = scopesList.filter((scope) =>
                        reqBodyScopesList.includes(scope)
                    );
                }
            }
            return scopesList;
        } else {
            return getScopesFromCode(code);
        }
    })();

    // Create response body
    const responseBody = {
        access_token: getAccessToken(scopes),
        token_type: idTokenType,
    };
    if (includeExpiresInInTokenResponse) {
        responseBody['expires_in'] = idTokenExpirationSeconds;
    }
    if (enableRefreshTokens) {
        responseBody['refresh_token'] = getRefreshToken(clientId, scopes);
    }

    // Get nonce (which is optional, so this might be an empty string)
    const nonce = (() => {
        if (shouldUseRefreshToken) {
            return '';
        } else {
            return getNonceFromCode(code);
        }
    })();

    // Create token
    const tokenPromise = getIdToken(
        issuer,
        clientId,
        idTokenExpirationSeconds,
        nonce
    );
    tokenPromise.then(
        (token) => {
            responseBody['id_token'] = token;
            res.json(responseBody);
        },
        (rejectedReason) => {
            logger.error(`ID token promise rejected: ${rejectedReason}`, {
                correlationId: correlationId,
            });
            res.status(500).json({
                message: `Token generation has failed due to an internal error. The logs may contain more info.`,
            });
        }
    );
};
