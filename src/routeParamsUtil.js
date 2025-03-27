export class RouteParams {
    clientIdsStr;
    clientIdsWithSecretsStr;
    issuer;
    idTokenExpirationSeconds;
    salts;
    mustUseCredentials = false;
    mustHashSecret = false;
    mustCheckRedirectUri = false;
    mustCheckClientId = false;
    includeExpiresInInTokenResponse = false;
    enableRefreshTokens = false;
    excludeUserInfoFromIdToken = false;
}

export const getRouteParams = (envVarHolder) => {
    const routeParams = new RouteParams();
    routeParams.clientIdsStr = envVarHolder.clientIdsStr;
    routeParams.clientIdsWithSecretsStr = envVarHolder.clientIdsWithSecretsStr;
    routeParams.issuer = envVarHolder.issuer;
    routeParams.idTokenExpirationSeconds = envVarHolder.idTokenExpirationSeconds
        ? parseInt(envVarHolder.idTokenExpirationSeconds)
        : 0;
    routeParams.mustUseCredentials = Boolean(
        envVarHolder.clientIdsWithSecretsStr
    );
    routeParams.mustHashSecret =
        String(envVarHolder.hashSecret).toLowerCase() === 'true';
    routeParams.salts = envVarHolder.saltsForHashingSecret;
    routeParams.mustCheckRedirectUri = !(
        String(
            envVarHolder.redirectUriOptionalForTokenEndpoint
        ).toLowerCase() === 'true'
    );
    routeParams.mustCheckClientId = !(
        String(envVarHolder.clientIdOptionalForTokenEndpoint).toLowerCase() ===
        'true'
    );
    routeParams.includeExpiresInInTokenResponse =
        String(envVarHolder.includeExpiresInInTokenResponse).toLowerCase() ===
        'true';
    routeParams.enableRefreshTokens =
        String(envVarHolder.enableRefreshTokens).toLowerCase() === 'true';
    routeParams.excludeUserInfoFromIdToken =
        String(envVarHolder.excludeUserInfoFromIdToken).toLowerCase() ===
        'true';
    return routeParams;
};
