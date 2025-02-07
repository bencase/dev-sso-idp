(() => {
    const hideLoadingSpinner = () => {
        // Add '.hidden' to the loading spinner
        const loadingSpinnerElem = window.document.getElementById(
            'simulatorLoadingSpinner'
        );
        window.devSsoIdp.addHiddenClassToElement(loadingSpinnerElem);

        // Remove '.hidden' from the content that should now be ready
        const simulatorContentElem =
            window.document.getElementById('simulatorContent');
        window.devSsoIdp.removeHiddenClassFromElement(simulatorContentElem);
    };

    const getCode = async (
        scopes,
        redirectUri,
        clientId,
        nonce,
        handleFetchErr
    ) => {
        const stringDelimitedScopes = scopes.join(' ');
        let url = `/api/v1/code?scopeStr=${encodeURIComponent(stringDelimitedScopes)}&redirectUri=${encodeURIComponent(redirectUri)}&clientId=${clientId}`;
        if (nonce) {
            url = url + `&nonce=${encodeURIComponent(nonce)}`;
        }

        try {
            const response = await fetch(url);
            if (!response.ok) {
                handleFetchErr();
                return '';
            }
            const resBody = await response.json();
            return resBody.code;
        } catch {
            handleFetchErr();
            return '';
        }
    };

    const shouldAutoRedirect = () => {
        const requestParamVal = window.devSsoIdp.requestParams.autoRedirect;
        if (requestParamVal?.toLowerCase() === 'y') {
            return true;
        } else if (requestParamVal?.toLowerCase() === 'n') {
            return false;
        } else {
            return window.devSsoIdp.settings.autoRedirectAfterLoad;
        }
    };

    const getDelayMillis = () => {
        if (window.devSsoIdp.requestParams.loadingDelay < 0) {
            return window.devSsoIdp.settings.loadingDelay
                ? window.devSsoIdp.settings.loadingDelay
                : 0;
        } else {
            return window.devSsoIdp.requestParams.loadingDelay;
        }
    };

    const handleCodeRetrieval = async () => {
        if (!window.devSsoIdp.maySimulate) {
            hideLoadingSpinner();
            // Don't get the code if there's no possibility for simulation to actually occur
            return;
        }

        const handleErr = () => {
            const elem = window.document.getElementById('codeErrorContainer');
            window.devSsoIdp.disableSimButtons(window.document);
            window.devSsoIdp.removeHiddenClassFromElement(elem);
            hideLoadingSpinner();
        };

        const scopes = window.devSsoIdp.requestParams.scope;
        const redirectUri = window.devSsoIdp.requestParams.redirectUri;
        const clientId = window.devSsoIdp.requestParams.clientId;
        const nonce = window.devSsoIdp.requestParams.nonce;
        window.devSsoIdp.code = await getCode(
            scopes,
            redirectUri,
            clientId,
            nonce,
            handleErr
        );

        setTimeout(() => {
            if (shouldAutoRedirect()) {
                if (window.devSsoIdp.settings.failWhenAutoRedirecting) {
                    window.devSsoIdp.redirectWithFail();
                } else {
                    window.devSsoIdp.redirectWithSuccess();
                }
            } else {
                hideLoadingSpinner();
            }
        }, getDelayMillis());
    };

    window.devSsoIdp.retrieveCode = () => handleCodeRetrieval();
})();

// The below prevents side-effects when running unit tests
// so that the side effects can be repeated in a controlled environment.
// The "try" is needed because the browser environment won't have "process".
/*global process*/
try {
    if (process?.env?.NODE_ENV !== 'test') {
        window.devSsoIdp.retrieveCode();
    }
} catch {
    window.devSsoIdp.retrieveCode();
}
