import Crypto from 'crypto';

import { getClientIdsAndSecretsFromString } from './commonLogic.js';
import { createLogger } from './loggerManager.js';

const logger = createLogger('credentialManagement');

export const base64ErrorStr = 'Failed to base64 decode credentials';

// Gets the clientId and secret from the value of the Authorization header of an incoming request.
export const getClientIdAndSecretFromHeaderAuthorizationCredentials = (
    credentials
) => {
    if (!credentials) {
        throw new Error('Credentials undefined');
    }

    let decodedCredentials;
    try {
        decodedCredentials = atob(credentials);
    } catch {
        throw new Error(base64ErrorStr);
    }

    const [clientId, secret] = decodedCredentials.split(':');
    if (!secret) {
        throw new Error(
            'Credentials must be base64-encoded, consisting of the client ID and the secret separated by a colon'
        );
    }

    return [clientId, secret];
};

// The value passed in will probably be that of the DEVSSOIDP_CLIENT_IDS_WITH_SECRETS environment variable, and this will read from that the corresponding secret of the given client ID.
export const getSecretForClientId = (
    clientId,
    clientIdsStr,
    clientIdsWithSecretsStr
) => {
    if (!clientIdsWithSecretsStr || clientIdsWithSecretsStr.length === 0) {
        throw new Error('No client IDs paired with secrets.');
    }

    const clientIdsAndSecretObjs = getClientIdsAndSecretsFromString(
        clientIdsStr,
        clientIdsWithSecretsStr
    );
    const matchingObj = clientIdsAndSecretObjs.filter(
        (obj) => obj.clientId === clientId
    );
    if (matchingObj.length < 1) {
        throw new Error(
            `No client ID matching ${clientId} found in environment variables.`
        );
    }
    return matchingObj[0].secret;
};

// Given a client ID, provided secret, and expected secret (and other options), checks that the provided secret is what is expected.
export const checkCredentials = (
    clientId,
    providedSecret,
    expectedSecret,
    mustHashSecret,
    salt,
    correlationId
) => {
    if (mustHashSecret) {
        const hasher = Crypto.createHash('sha256');
        const actualHash = hasher
            .update(providedSecret + salt)
            .digest()
            .toString('base64');
        const returnVal = expectedSecret === actualHash;
        if (!returnVal) {
            logger.warn(
                `Secret provided after salting and hashing did not match that of client ID ${clientId}`,
                { correlationId: correlationId }
            );
        }
        return returnVal;
    } else {
        const returnVal = expectedSecret === providedSecret;
        if (!returnVal) {
            logger.warn(
                `Secret provided did not match that of client ID ${clientId}`,
                { correlationId: correlationId }
            );
        }
        return returnVal;
    }
};
