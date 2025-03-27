import { checkCode, getScopesFromCode } from '../codeManagement.js';
import { accessDeniedWithLog } from '../commonLogic.js';
import {
    addressInfo,
    correlationIdHeader,
    emailInfo,
    logLevelWarn,
    phoneInfo,
    profileInfo,
} from '../constants.js';
import { createLogger } from '../loggerManager.js';

const logger = createLogger('userInfo');

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
