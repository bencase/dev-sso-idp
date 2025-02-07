(() => {
    const getListFromCommaDelimitedString = (str) => {
        if (!str) {
            return [];
        } else {
            return str.split(',');
        }
    };

    const getRedirectUris = (redirectUrisStr) => {
        if (!redirectUrisStr) {
            return [];
        } else {
            return redirectUrisStr.split(',').map(decodeURIComponent);
        }
    };

    const initializeEnvVars = () => {
        const envVarServerValidationResult =
            window.devSsoIdp.envVarServerValidationResult;
        if (envVarServerValidationResult.errors) {
            let count = 0;
            const validityObj = {};
            for (const error of envVarServerValidationResult.errors) {
                validityObj[count.toString()] = {
                    isValid: false,
                    message: error.message,
                    var: error.var,
                };
                count++;
            }
            window.devSsoIdp.envVarValidity = validityObj;
        } else {
            console.log(
                'No errors list found in ENV_VAR_SERVER_VALIDATION_RESULT.'
            );
            window.devSsoIdp.envVarValidity = {};
        }

        const clientIdsStr = window.devSsoIdp.CLIENT_IDS;
        window.devSsoIdp.CLIENT_IDS_ARRAY =
            getListFromCommaDelimitedString(clientIdsStr);

        const urlEncodedRedirectUrisStr =
            window.devSsoIdp.PERCENT_ENCODED_REDIRECT_URIS;
        window.devSsoIdp.REDIRECT_URIS_ARRAY = getRedirectUris(
            urlEncodedRedirectUrisStr
        );
    };

    window.devSsoIdp.initializeEnvVars = initializeEnvVars;
})();

// The below prevents side-effects when running unit tests
// so that the side effects can be repeated in a controlled environment.
// The "try" is needed because the browser environment won't have "process".
/*global process*/
try {
    if (process?.env?.NODE_ENV !== 'test') {
        window.devSsoIdp.initializeEnvVars();
    }
} catch {
    window.devSsoIdp.initializeEnvVars();
}
