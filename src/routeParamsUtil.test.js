import { getRouteParams, RouteParams } from './routeParamsUtil';

const envVarHolder = {
    useHttp: 'true',
    httpPort: '3000',
    useHttps: 'true',
    httpsPort: '3443',
    issuer: 'https://example.com',
    percentEncodedRedirectUris:
        'http%3A%2F%2Flocalhost%3A5173,http%3A%2F%2Flocalhost%3A8080',
    clientIdsWithSecretsStr:
        'relying_party:bnhFJWV2HPIHNiOh+cC796BXAgjbWl8VJAPca4V5K1U=,my_cool_app:QjbYa8VlKM3yBzPwKibD3kaNmTJdfbNloDagTryV1WQ=',
    clientIdsStr: 'relying_party,my_cool_app',
    hashSecret: 'true',
    saltsForHashingSecret: 'my-super-cool-salt,my-other-almost-as-cool-salt',
    idTokenExpirationSeconds: '14400',
    ignoreResponseTypeValidation: 'false',
    ignoreClientIdValidation: 'false',
    ignoreScopeValidation: 'false',
    ignoreRedirectUriValidation: 'false',
    includeExpiresInInTokenResponse: 'true',
    redirectUriOptionalForTokenEndpoint: 'false',
    clientIdOptionalForTokenEndpoint: 'false',
    enableRefreshTokens: 'true',
    logLevel: 'info',
    authorizePagePath: '/authorize',
    settingsPagePath: '/settings',
    environmentPagePath: '/environment',
    codeEndpointPath: '/api/v1/code',
    tokenEndpointPath: '/api/v1/token',
    userInfoEndpointPath: '/api/v1/userInfo',
    healthCheckEndpointPath: '/api/v1/health',
    healthCheckEnvEndpointPath: '/api/v1/health/env',
};

describe('src/routeParamsUtil.js', () => {
    test('should provide route params based on the environment variables (happy path)', () => {
        const expectedRouteParams = new RouteParams();
        expectedRouteParams.clientIdsStr = envVarHolder.clientIdsStr;
        expectedRouteParams.clientIdsWithSecretsStr =
            envVarHolder.clientIdsWithSecretsStr;
        expectedRouteParams.issuer = envVarHolder.issuer;
        expectedRouteParams.idTokenExpirationSeconds = parseInt(
            envVarHolder.idTokenExpirationSeconds
        );
        expectedRouteParams.mustUseCredentials = true;
        expectedRouteParams.mustHashSecret = true;
        expectedRouteParams.salts = envVarHolder.saltsForHashingSecret;
        expectedRouteParams.mustCheckRedirectUri = true;
        expectedRouteParams.mustCheckClientId = true;
        expectedRouteParams.includeExpiresInInTokenResponse = true;
        expectedRouteParams.enableRefreshTokens = true;

        const routeParams = getRouteParams(envVarHolder);

        expect(routeParams).toEqual(expectedRouteParams);
    });

    test('should provide route params based on the environment variables (idTokenExpirationSeconds omitted from envVarHolder)', () => {
        const alteredEnvVarHolder = {
            ...envVarHolder,
        };
        delete alteredEnvVarHolder.idTokenExpirationSeconds;

        const expectedRouteParams = new RouteParams();
        expectedRouteParams.clientIdsStr = alteredEnvVarHolder.clientIdsStr;
        expectedRouteParams.clientIdsWithSecretsStr =
            alteredEnvVarHolder.clientIdsWithSecretsStr;
        expectedRouteParams.issuer = alteredEnvVarHolder.issuer;
        expectedRouteParams.idTokenExpirationSeconds = 0;
        expectedRouteParams.mustUseCredentials = true;
        expectedRouteParams.mustHashSecret = true;
        expectedRouteParams.salts = alteredEnvVarHolder.saltsForHashingSecret;
        expectedRouteParams.mustCheckRedirectUri = true;
        expectedRouteParams.mustCheckClientId = true;
        expectedRouteParams.includeExpiresInInTokenResponse = true;
        expectedRouteParams.enableRefreshTokens = true;

        const routeParams = getRouteParams(alteredEnvVarHolder);

        expect(routeParams).toEqual(expectedRouteParams);
    });

    test('should provide route params based on the environment variables (swap boolean fields)', () => {
        const alteredEnvVarHolder = {
            ...envVarHolder,
            hashSecret: 'false',
            redirectUriOptionalForTokenEndpoint: 'true',
            clientIdOptionalForTokenEndpoint: 'true',
            includeExpiresInInTokenResponse: 'false',
            enableRefreshTokens: 'false',
        };
        alteredEnvVarHolder.clientIdsWithSecretsStr = '';

        const expectedRouteParams = new RouteParams();
        expectedRouteParams.clientIdsStr = alteredEnvVarHolder.clientIdsStr;
        expectedRouteParams.clientIdsWithSecretsStr =
            alteredEnvVarHolder.clientIdsWithSecretsStr;
        expectedRouteParams.issuer = alteredEnvVarHolder.issuer;
        expectedRouteParams.idTokenExpirationSeconds = parseInt(
            alteredEnvVarHolder.idTokenExpirationSeconds
        );
        expectedRouteParams.mustUseCredentials = false;
        expectedRouteParams.mustHashSecret = false;
        expectedRouteParams.salts = alteredEnvVarHolder.saltsForHashingSecret;
        expectedRouteParams.mustCheckRedirectUri = false;
        expectedRouteParams.mustCheckClientId = false;
        expectedRouteParams.includeExpiresInInTokenResponse = false;
        expectedRouteParams.enableRefreshTokens = false;

        const routeParams = getRouteParams(alteredEnvVarHolder);

        expect(routeParams).toEqual(expectedRouteParams);
    });
});
