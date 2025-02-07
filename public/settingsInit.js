if (!window.devSsoIdp) {
    window.devSsoIdp = {};
}

(() => {
    const getLocalStorageValGeneric = (ky, defaultValue, isBool, isNumber) => {
        const localStorageVal = (() => {
            if (isBool) {
                return window.localStorage.getItem(ky)?.toLowerCase() === 'y';
            } else if (isNumber) {
                const val = window.localStorage.getItem(ky);
                return val ? parseFloat(val) : 0;
            } else {
                return window.localStorage.getItem(ky);
            }
        })();

        if (localStorageVal) {
            return localStorageVal;
        } else {
            return defaultValue;
        }
    };

    const getLocalStorageValText = (ky, defaultValue) =>
        getLocalStorageValGeneric(ky, defaultValue, false, false);
    const getLocalStorageValBool = (ky, defaultValue) =>
        getLocalStorageValGeneric(ky, defaultValue, true, false);
    const getLocalStorageValNumber = (ky, defaultValue) =>
        getLocalStorageValGeneric(ky, defaultValue, false, true);

    const initializeSettings = () => {
        window.devSsoIdp.settingKeys = {
            theme: 'theme',
            autoRedirectAfterLoad: 'autoRedirectAfterLoad',
            loadingDelay: 'loadingDelay',
            failWhenAutoRedirecting: 'failWhenAutoRedirecting',
            error: 'error',
            errorDesc: 'errorDesc',
        };

        const settingKeys = window.devSsoIdp.settingKeys;

        const defaultResponseError = window.devSsoIdp.responseError
            ? window.devSsoIdp.responseError
            : 'access_denied';

        window.devSsoIdp.settings = {
            theme: getLocalStorageValText(settingKeys.theme, 'sys'),
            autoRedirectAfterLoad: getLocalStorageValBool(
                settingKeys.autoRedirectAfterLoad,
                false
            ),
            loadingDelay: getLocalStorageValNumber(settingKeys.loadingDelay, 0),
            failWhenAutoRedirecting: getLocalStorageValBool(
                settingKeys.failWhenAutoRedirecting,
                false
            ),
            error: getLocalStorageValText(
                settingKeys.error,
                defaultResponseError
            ),
            errorDesc: getLocalStorageValText(settingKeys.errorDesc, ''),
        };
    };

    window.devSsoIdp.initializeSettings = initializeSettings;
})();

// The below prevents side-effects when running unit tests
// so that the side effects can be repeated in a controlled environment.
// The "try" is needed because the browser environment won't have "process".
/*global process*/
try {
    if (process?.env?.NODE_ENV !== 'test') {
        window.devSsoIdp.initializeSettings();
    }
} catch {
    window.devSsoIdp.initializeSettings();
}
