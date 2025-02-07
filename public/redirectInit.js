(() => {
    const redirectWithParams = (redirectUri, paramsObj, windowLocation) => {
        const queryParams = new URLSearchParams(paramsObj);

        let url = `${redirectUri}?${queryParams.toString()}`;

        windowLocation.href = url;
    };

    window.devSsoIdp.redirectWithSuccess = () => {
        const redirectUri = window.devSsoIdp.requestParams.redirectUri;
        const code = window.devSsoIdp.code;
        const state = window.devSsoIdp.requestParams.state;

        const queryParamsObj = {
            code: code,
        };
        if (state) {
            queryParamsObj.state = state;
        }
        redirectWithParams(redirectUri, queryParamsObj, window.location);
    };

    window.devSsoIdp.redirectWithFail = () => {
        const redirectUri = window.devSsoIdp.requestParams.redirectUri;
        const responseError = window.devSsoIdp.settings.error;
        const responseErrorDesc = window.devSsoIdp.settings.errorDesc;
        const state = window.devSsoIdp.requestParams.state;

        const queryParamsObj = {
            error: responseError,
        };
        if (responseErrorDesc) {
            queryParamsObj.error_description = responseErrorDesc;
        }
        if (state) {
            queryParamsObj.state = state;
        }
        redirectWithParams(redirectUri, queryParamsObj, window.location);
    };
})();
