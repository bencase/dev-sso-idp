import { SignJWT } from 'jose';

import { getCodeForScope } from './codeManagement.js';
import { emailInfo, profileInfo } from './constants.js';

const subjectIdentifier = 'tuser';
const alg = 'HS256';
const secret = new TextEncoder().encode(
    'Whoa, this is a really cool piece of text!'
);

// Class to hold ID token field names
export class IdTokenFieldNames {
    nameField;
    usernameField;
    firstNameField;
    middleNameField;
    lastNameField;
    emailField;
}

export const getAccessToken = (scopesList) => {
    return getCodeForScope(
        scopesList.join(' '),
        undefined,
        undefined,
        undefined,
        false,
        false
    );
};

export const getRefreshToken = (clientId, scopesList) => {
    return getCodeForScope(
        scopesList.join(' '),
        undefined,
        clientId,
        undefined,
        false,
        true
    );
};

const idTokenNeedsUserInfo = (scopesList, excludeUserInfoFromIdToken) => {
    return (
        !excludeUserInfoFromIdToken &&
        scopesList &&
        (scopesList.includes('profile') || scopesList.includes('email'))
    );
};

const addNonceClaim = (nonce, customPayload) => {
    if (nonce) {
        customPayload['nonce'] = nonce;
    }
};

const addUserInfoClaims = (
    scopesList,
    customPayload,
    fieldNames,
    excludeUserInfoFromIdToken
) => {
    if (!excludeUserInfoFromIdToken) {
        if (scopesList.includes('profile')) {
            customPayload[fieldNames.nameField] = profileInfo.name;
            customPayload[fieldNames.usernameField] =
                profileInfo.preferred_username;
            customPayload[fieldNames.firstNameField] = profileInfo.given_name;
            customPayload[fieldNames.middleNameField] = profileInfo.middle_name;
            customPayload[fieldNames.lastNameField] = profileInfo.family_name;
        }
        if (scopesList.includes('email')) {
            customPayload[fieldNames.emailField] = emailInfo.email;
        }
    }
};

export const getIdToken = (
    issuer,
    clientId,
    idTokenExpirationSeconds,
    scopesList,
    excludeUserInfoFromIdToken,
    idTokenFieldNames,
    nonce
) => {
    const nowSeconds = Math.floor(new Date().getTime() / 1000);
    const customPayload = {};
    if (nonce || idTokenNeedsUserInfo(scopesList, excludeUserInfoFromIdToken)) {
        // It seems there needs to be at least one private claim having
        // something similar to this URN notation, or else jose will fail
        // to add custom claims.
        customPayload['urn:dummyssoidp:claim'] = true;
        addNonceClaim(nonce, customPayload);
        addUserInfoClaims(
            scopesList,
            customPayload,
            idTokenFieldNames,
            excludeUserInfoFromIdToken
        );
    }
    return new SignJWT(customPayload)
        .setProtectedHeader({ alg: alg })
        .setIssuedAt()
        .setIssuer(issuer)
        .setAudience(clientId)
        .setSubject(subjectIdentifier)
        .setExpirationTime(nowSeconds + idTokenExpirationSeconds)
        .sign(secret);
};
