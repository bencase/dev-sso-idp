const accessDeniedMessage = 'Access denied';

export const accessDeniedWithLog = (
    logger,
    level,
    logStr,
    logMetadata,
    res
) => {
    logger.log({
        level: level,
        message: logStr,
        meta: logMetadata,
    });
    res.status(403).json({ message: accessDeniedMessage });
    return;
};

export const getListFromCommaDelimitedString = (str) => {
    if (!str) {
        return [];
    } else {
        return str.split(',');
    }
};

export const getClientIdsAndSecretsFromString = (
    clientIdsStr,
    clientIdsWithSecretsStr
) => {
    if (clientIdsWithSecretsStr && clientIdsWithSecretsStr.length > 0) {
        const pairs = getListFromCommaDelimitedString(clientIdsWithSecretsStr);
        return pairs.map((pair) => {
            const [clientId, secret] = pair.split(':');
            return { clientId: clientId, secret: secret };
        });
    } else if (clientIdsStr && clientIdsStr.length > 0) {
        const clientIds = getListFromCommaDelimitedString(clientIdsStr);
        return clientIds.map((clientId) => {
            return { clientId: clientId };
        });
    } else {
        return [];
    }
};

export const getNormalizedClientIdsStr = (
    clientIdsStr,
    clientIdsWithSecretsStr
) => {
    if (clientIdsWithSecretsStr && clientIdsWithSecretsStr.length > 0) {
        const pairs = getListFromCommaDelimitedString(clientIdsWithSecretsStr);
        return pairs
            .map((pair) => {
                const pairValues = pair.split(':');
                return pairValues[0];
            })
            .join(',');
    } else {
        return clientIdsStr;
    }
};

export const getScopeListFromSpaceDelimitedString = (scopeStr) => {
    return scopeStr.split(' ');
};
