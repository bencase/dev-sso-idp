import { SignJWT } from 'jose';

import { getCodeForScope } from './codeManagement.js';

const subjectIdentifier = 'tuser';
const alg = 'HS256';
const secret = new TextEncoder().encode(
    'Whoa, this is a really cool piece of text!'
);

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

export const getIdToken = (
    issuer,
    clientId,
    idTokenExpirationSeconds,
    nonce
) => {
    const nowSeconds = Math.floor(new Date().getTime() / 1000);
    const customPayload = {};
    if (nonce) {
        // It seems there needs to be at least one private claim having
        // something similar to this URN notation, or else jose will fail
        // to add the nonce claim.
        customPayload['urn:dummyssoidp:claim'] = true;
        customPayload['nonce'] = nonce;
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
