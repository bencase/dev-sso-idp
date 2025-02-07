import { checkCode, getScopesFromCode } from '../codeManagement.js';
import { accessDeniedWithLog } from '../commonLogic.js';
import { correlationIdHeader, logLevelWarn } from '../constants.js';
import { createLogger } from '../loggerManager.js';

const logger = createLogger('userInfo');

const profileInfo = {
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

const emailInfo = {
    email: 'tuser@example.com',
    email_verified: true,
};

const addressInfo = {
    address: {
        formatted: '248 Live Oak Lane\nAustin, TX 78787\nUnited States',
        street_address: '248 Live Oak Lane',
        locality: 'Austin',
        region: 'TX',
        postal_code: '78787',
        country: 'United States',
    },
};

const phoneInfo = {
    phone_number: '+1 (555) 555-5555',
    phone_number_verified: true,
};

const scopeInfo = {
    profile: profileInfo,
    email: emailInfo,
    address: addressInfo,
    phone: phoneInfo,
};

const checkAuthHeaderValue = (authValue, correlationId, res) => {
    if (!authValue) {
        accessDeniedWithLog(
            logger,
            logLevelWarn,
            `Access token not found. Access token must be in the 'Authorization' header, in the format 'Bearer <access-token>'.`,
            { correlationId: correlationId },
            res
        );
        return [false, undefined];
    }

    const [bearer, accessToken] = authValue.split(' ');
    if (bearer !== 'Bearer') {
        accessDeniedWithLog(
            logger,
            logLevelWarn,
            `Value in 'Authorization' header must start with 'Bearer '`,
            { correlationId: correlationId },
            res
        );
        return [false, undefined];
    }

    if (!accessToken) {
        accessDeniedWithLog(
            logger,
            logLevelWarn,
            `Value in 'Authorization' header must have 'Bearer ' followed by the access token, in the format 'Bearer <access-token>'.`,
            { correlationId: correlationId },
            res
        );
        return [false, undefined];
    }

    if (!checkCode(accessToken, '', '', false, false)) {
        accessDeniedWithLog(
            logger,
            logLevelWarn,
            `Access token is invalid.`,
            { correlationId: correlationId },
            res
        );
        return [false, accessToken];
    } else {
        return [true, accessToken];
    }
};

export const makeUserInfoRoute = () => (req, res) => {
    const correlationId = req.header(correlationIdHeader);

    const authValue = req.header('Authorization');
    const [accessTokenValid, accessToken] = checkAuthHeaderValue(
        authValue,
        correlationId,
        res
    );
    if (!accessTokenValid) {
        return;
    }

    const scopes = getScopesFromCode(accessToken);
    let userInfo = {};
    for (const scope of scopes) {
        const info = scopeInfo[scope];
        if (info) {
            userInfo = { ...userInfo, ...info };
        }
    }

    res.json(userInfo);
};
