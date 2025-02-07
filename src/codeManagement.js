import Crypto from 'crypto';

import { getScopeListFromSpaceDelimitedString } from './commonLogic.js';

const mixin = 'BensDummySsoIdp';

const sha256HashLengthInB64 = 44;

const knownScopes = [
    {
        name: 'openid',
        bit: 0,
    },
    {
        name: 'profile',
        bit: 1,
    },
    {
        name: 'email',
        bit: 2,
    },
    {
        name: 'address',
        bit: 3,
    },
    {
        name: 'phone',
        bit: 4,
    },
    {
        name: 'offline_access',
        bit: 5,
    },
];

const getScopeNumericComponent = (scopeObj) => {
    return Math.pow(2, scopeObj.bit);
};

// Checks a number (`scopeVal`) that comes from the code's scope encoding and determines
// (based on info referenced from `scopeObj`) whether the scope signified by `scopeObj`
// is present.
const scopeValContainsScope = (scopeVal, scopeObj) => {
    /*
    scopeVal: a number created by adding various powers of 2, in which each scope is
        signified by a specific power of 2
    scopeObj: a piece of configuration that ties a scope to a bit, which is also
        determines which power of 2 the scope is associated with
    
    For example, let's say scopeVal is 23 and scopeObj is { name: 'email', bit: 2 }.
    * `Math.pow(2, scopeObj.bit)` will equal 4
    * This means `scopeVal & Math.pow(2, scopeObj.bit)` will resolve to `23 & 4`
    * Since we're using bitwise operators, it'll be better to now think of this as
        `10111 & 00100`
    * The result of this will be `00100`
    * The `!!` will convert this to a boolean based on truthiness, which in this case
        resolves to true
    
    This means that the scopeVal indicates the presence of the 'email' scope. In the
    case it didn't, it would've resulted in a value of zero, resolving to false.
    */
    return !!(scopeVal & Math.pow(2, scopeObj.bit));
};

// Accepts a two character string encoded to contain scopes, and outputs the explicit list of scopes
const getListOfScopesFromScopeString = (scopeStr) => {
    const scopeVal = parseInt(scopeStr, 16);
    const scopes = [];
    for (const knownScope of knownScopes) {
        if (scopeValContainsScope(scopeVal, knownScope)) {
            scopes.push(knownScope.name);
        }
    }
    return scopes;
};

// Encodes a list of scopes as a two character string
const getStringBasedOnScopes = (scopes) => {
    let scopeVal = 0;
    for (const knownScope of knownScopes) {
        if (scopes.includes(knownScope.name)) {
            scopeVal += getScopeNumericComponent(knownScope);
        }
    }
    let str = scopeVal.toString(16);
    return str.length < 2 ? '0' + str : str;
};

const getStringForHash = (
    codePrefix,
    scopeStr,
    redirectUri,
    clientId,
    nonce,
    mixinStr,
    includeRedirectUriInHash,
    includeClientIdInHash
) => {
    let stringForHash = codePrefix + scopeStr + mixinStr;
    if (includeRedirectUriInHash) {
        stringForHash = stringForHash + redirectUri;
    }
    if (includeClientIdInHash) {
        stringForHash = stringForHash + clientId;
    }
    if (nonce) {
        stringForHash = stringForHash + nonce;
    }
    return stringForHash;
};

export const getCodeForScope = (
    scopesStr,
    redirectUri,
    clientId,
    nonce,
    includeRedirectUriInHash,
    includeClientIdInHash
) => {
    // Scopes will come to this function as a space-delimited list
    const scopes = getScopeListFromSpaceDelimitedString(scopesStr);

    // Creates a random string 24 characters long
    const codePrefix = Crypto.randomBytes(18).toString('base64');

    // Create a two character string containing scope info
    const scopeStr = getStringBasedOnScopes(scopes);

    // Concatenate all the strings needed to go in the hash
    const stringForHash = getStringForHash(
        codePrefix,
        scopeStr,
        redirectUri,
        clientId,
        nonce,
        mixin,
        includeRedirectUriInHash,
        includeClientIdInHash
    );

    const hasher = Crypto.createHash('sha256');
    const codeSuffix = hasher.update(stringForHash).digest().toString('base64');

    let code = codePrefix + scopeStr;
    if (nonce) {
        code = code + nonce;
    }
    return code + codeSuffix;
};

export const getNonceFromCode = (code) => {
    return code.substr(26, code.length - (26 + sha256HashLengthInB64));
};

export const checkCode = (
    code,
    redirectUri,
    clientId,
    includeRedirectUriInHash,
    includeClientIdInHash
) => {
    const codePrefix = code.substring(0, 24);
    const scopeStr = code.substring(24, 26);
    const nonce = getNonceFromCode(code);
    const expectedHash = code.substr(-1 * sha256HashLengthInB64);

    const stringForHash = getStringForHash(
        codePrefix,
        scopeStr,
        redirectUri,
        clientId,
        nonce,
        mixin,
        includeRedirectUriInHash,
        includeClientIdInHash
    );

    const hasher = Crypto.createHash('sha256');
    const actualHash = hasher.update(stringForHash).digest().toString('base64');

    return expectedHash === actualHash;
};

export const getScopesFromCode = (code) => {
    const scopeStr = code.substring(24, 26);
    return getListOfScopesFromScopeString(scopeStr);
};
