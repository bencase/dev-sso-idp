window.devSsoIdp.requestParams = {
    responseType: '',
    clientId: '',
    scope: [],
    redirectUri: '',
    state: '',
    nonce: '',
    autoRedirect: '',
    loadingDelay: -1,
};

window.devSsoIdp.requestParamValidity = {
    responseType: {
        present: false,
        isValid: false,
        message: 'response_type not validated',
    },
    clientId: {
        present: false,
        isValid: false,
        message: 'client_id not validated',
        validList: [],
    },
    scope: {
        present: false,
        isValid: false,
        message: 'scope not validated',
    },
    redirectUri: {
        present: false,
        isValid: false,
        message: 'redirect_uri not validated',
        validList: [],
    },
};

(() => {
    const OPENID_SCOPE = 'openid';

    const decodeScope = (scope) => {
        if (!scope) {
            return [];
        }
        return scope.split(' ');
    };

    const getLoadingDelay = (paramVal) => {
        if (!paramVal) {
            return -1;
        }
        return parseFloat(paramVal);
    };

    const readRequestParams = () => {
        const params = new URLSearchParams(window.location.search);
        let requestParams = {
            responseType: params.get('response_type'),
            clientId: params.get('client_id'),
            scope: decodeScope(params.get('scope')),
            redirectUri: params.get('redirect_uri'),
            state: params.get('state'),
            nonce: params.get('nonce'),
            autoRedirect: params.get('auto_redirect'),
            loadingDelay: getLoadingDelay(params.get('loading_delay')),
        };
        return requestParams;
    };

    const validateResponseType = (requestParams, alwaysPass) => {
        const isPresent = !!requestParams.responseType;
        let result = {
            present: isPresent,
            isValid: false,
            message: '',
        };
        if (alwaysPass || isPresent) {
            if (alwaysPass || requestParams.responseType === 'code') {
                result.isValid = true;
            } else {
                result.message = `response_type parameter must have the value 'code'.`;
            }
        } else {
            result.message = `Request URL must contain a 'response_type' parameter having the value 'code'. For example: ?response_type=code`;
        }
        return result;
    };

    const validateClientId = (requestParams, validClientIds, alwaysPass) => {
        const isPresent = !!requestParams.clientId;
        let result = {
            present: isPresent,
            isValid: false,
            message: '',
            validList: [...validClientIds],
        };
        if (alwaysPass || isPresent) {
            if (alwaysPass || validClientIds.includes(requestParams.clientId)) {
                result.isValid = true;
            } else {
                result.message = `Client ID '${requestParams.clientId}' is not in acceptable client IDs (according to the 'DEVSSOIDP_CLIENT_IDS' or 'DEVSSOIDP_CLIENT_IDS_WITH_SECRETS' environment variables):`;
            }
        } else {
            result.message = `A valid client ID must be specified in the 'client_id' parameter. Valid client IDs according to the 'DEVSSOIDP_CLIENT_IDS' or 'DEVSSOIDP_CLIENT_IDS_WITH_SECRETS' environment variables are:`;
        }
        return result;
    };

    const validateScope = (requestParams, alwaysPass) => {
        const isPresent = requestParams.scope.length > 0;
        let result = {
            present: isPresent,
            isValid: false,
            message: '',
        };
        if (alwaysPass || isPresent) {
            if (alwaysPass || requestParams.scope.includes(OPENID_SCOPE)) {
                result.isValid = true;
            } else {
                result.message = `The 'scope' parameter must include the '${OPENID_SCOPE}' scope.`;
            }
        } else {
            result.message = `The 'scope' parameter must provide a list of valid scopes delimited from each other by a space. One of these scope values must be '${OPENID_SCOPE}'.`;
        }
        return result;
    };

    const validateRedirectUri = (
        requestParams,
        validRedirectUris,
        alwaysPass
    ) => {
        const isPresent = !!requestParams.redirectUri;
        let result = {
            present: isPresent,
            isValid: false,
            message: '',
            validList: [...validRedirectUris],
        };
        if (alwaysPass || isPresent) {
            if (
                alwaysPass ||
                validRedirectUris.includes(requestParams.redirectUri)
            ) {
                result.isValid = true;
            } else {
                result.message = `The redirect URI "${requestParams.redirectUri}" is not in one of the acceptable redirect URIs (according to the 'DEVSSOIDP_PERCENT_ENCODED_REDIRECT_URIS' environment variable):`;
            }
        } else {
            result.message = `A valid redirect URI must be in the 'redirect_uri' parameter. It must exactly match (including encoding) one of the entries in the 'DEVSSOIDP_PERCENT_ENCODED_REDIRECT_URIS' environment variable:`;
        }
        return result;
    };

    const RESPONSE_TYPE = 'responseType';
    const CLIENT_ID = 'clientId';
    const SCOPE = 'scope';
    const REDIRECT_URI = 'redirectUri';
    // There's nothing to validate for "state". State is not mandatory, and the contents of the state is the concern only of the relying party.

    const validateRequestParams = (
        requestParams,
        validClientIds,
        validRedirectUris,
        validationsToAlwaysPass
    ) => {
        const responseTypeValidationResult = validateResponseType(
            requestParams,
            validationsToAlwaysPass.includes(RESPONSE_TYPE)
        );
        const clientIdValidationResult = validateClientId(
            requestParams,
            validClientIds,
            validationsToAlwaysPass.includes(CLIENT_ID)
        );
        const scopeValidationResult = validateScope(
            requestParams,
            validationsToAlwaysPass.includes(SCOPE)
        );
        const redirectUriValidationResult = validateRedirectUri(
            requestParams,
            validRedirectUris,
            validationsToAlwaysPass.includes(REDIRECT_URI)
        );

        return {
            responseType: responseTypeValidationResult,
            clientId: clientIdValidationResult,
            scope: scopeValidationResult,
            redirectUri: redirectUriValidationResult,
        };
    };

    const initializeRequestParams = () => {
        const requestParams = readRequestParams();
        window.devSsoIdp.requestParams = requestParams;

        let validationsToAlwaysPass = [];
        if (window.devSsoIdp.IGNORE_RESPONSE_TYPE_VALIDATION) {
            validationsToAlwaysPass.push(RESPONSE_TYPE);
        }
        if (window.devSsoIdp.IGNORE_CLIENT_ID_VALIDATION) {
            validationsToAlwaysPass.push(CLIENT_ID);
        }
        if (window.devSsoIdp.IGNORE_SCOPE_VALIDATION) {
            validationsToAlwaysPass.push(SCOPE);
        }
        if (window.devSsoIdp.IGNORE_REDIRECT_URI_VALIDATION) {
            validationsToAlwaysPass.push(REDIRECT_URI);
        }

        const validClientIds = window.devSsoIdp.CLIENT_IDS_ARRAY;
        const validRedirectUris = window.devSsoIdp.REDIRECT_URIS_ARRAY;

        const validity = validateRequestParams(
            window.devSsoIdp.requestParams,
            validClientIds,
            validRedirectUris,
            validationsToAlwaysPass
        );
        window.devSsoIdp.requestParamValidity = validity;
    };

    window.devSsoIdp.initializeRequestParams = initializeRequestParams;
})();

// The below prevents side-effects when running unit tests
// so that the side effects can be repeated in a controlled environment.
// The "try" is needed because the browser environment won't have "process".
/*global process*/
try {
    if (process?.env?.NODE_ENV !== 'test') {
        window.devSsoIdp.initializeRequestParams();
    }
} catch {
    window.devSsoIdp.initializeRequestParams();
}
