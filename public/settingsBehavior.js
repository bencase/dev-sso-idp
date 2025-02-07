(() => {
    const settings = window.devSsoIdp.settings;
    const settingKeys = window.devSsoIdp.settingKeys;

    const themeLightInputId = 'themeLightInput';
    const themeDarkInputId = 'themeDarkInput';
    const themeSystemDefaultInputId = 'themeSystemDefaultInput';

    const autoRedirectAfterLoadInputId = 'autoRedirectAfterLoadInput';
    const loadingDelayInputId = 'loadingDelayInput';
    const failWhenAutoRedirectingInputId = 'failWhenAutoRedirectingInput';
    const errorInputId = 'errorInput';
    const errorDescInputId = 'errorDescInput';

    const theme = settings.theme;

    // Initialize input values based on settings
    document.getElementById(themeLightInputId).checked = theme === 'light';
    document.getElementById(themeDarkInputId).checked = theme === 'dark';
    document.getElementById(themeSystemDefaultInputId).checked =
        theme !== 'light' && theme !== 'dark';
    document.getElementById(autoRedirectAfterLoadInputId).checked =
        settings.autoRedirectAfterLoad;
    document.getElementById(loadingDelayInputId).value =
        settings.loadingDelay?.toString();
    document.getElementById(failWhenAutoRedirectingInputId).checked =
        settings.failWhenAutoRedirecting;
    document.getElementById(errorInputId).value = settings.error;
    document.getElementById(errorDescInputId).value = settings.errorDesc;

    // On change events for adding values to local storage
    const onThemeInputChange = (event) => {
        window.localStorage.setItem(settingKeys.theme, event.target.value);
        settings.theme = event.target.value;
        window.devSsoIdp.changeTheme(event.target.value);
    };

    const onAutoRedirectAfterLoadInputChange = (event) => {
        if (event.target.checked) {
            window.localStorage.setItem(settingKeys.autoRedirectAfterLoad, 'y');
            settings.autoRedirectAfterLoad = true;
        } else {
            window.localStorage.removeItem(settingKeys.autoRedirectAfterLoad);
            settings.autoRedirectAfterLoad = false;
        }
    };

    const onLoadingDelayInputChange = (event) => {
        const val = event.target.value;
        if (!val || val === '0') {
            window.localStorage.removeItem(settingKeys.loadingDelay);
            settings.loadingDelay = undefined;
        } else {
            window.localStorage.setItem(settingKeys.loadingDelay, val);
            settings.loadingDelay = parseFloat(val);
        }
    };

    const onFailWhenAutoRedirectingInputChange = (event) => {
        if (event.target.checked) {
            window.localStorage.setItem(
                settingKeys.failWhenAutoRedirecting,
                'y'
            );
            settings.failWhenAutoRedirecting = true;
        } else {
            window.localStorage.removeItem(settingKeys.failWhenAutoRedirecting);
            settings.failWhenAutoRedirecting = false;
        }
    };

    const onErrorInputChange = (event) => {
        const val = event.target.value;
        if (!val) {
            window.localStorage.removeItem(settingKeys.error);
            settings.error = undefined;
        } else {
            window.localStorage.setItem(settingKeys.error, val);
            settings.error = val;
        }
    };

    const onErrorDescInputChange = (event) => {
        const val = event.target.value;
        if (!val) {
            window.localStorage.removeItem(settingKeys.errorDesc);
            settings.errorDesc = undefined;
        } else {
            window.localStorage.setItem(settingKeys.errorDesc, val);
            settings.errorDesc = val;
        }
    };

    // Radio input events
    [themeLightInputId, themeDarkInputId, themeSystemDefaultInputId].forEach(
        (elemId) => {
            document
                .getElementById(elemId)
                .addEventListener('change', onThemeInputChange);
        }
    );

    // Text input events
    [
        [loadingDelayInputId, onLoadingDelayInputChange],
        [errorInputId, onErrorInputChange],
        [errorDescInputId, onErrorDescInputChange],
    ].forEach((idAndFunc) => {
        const [id, onChange] = idAndFunc;
        ['input', 'change'].forEach((eventType) => {
            document.getElementById(id).addEventListener(eventType, onChange);
        });
    });

    // Checkbox events
    [
        [autoRedirectAfterLoadInputId, onAutoRedirectAfterLoadInputChange],
        [failWhenAutoRedirectingInputId, onFailWhenAutoRedirectingInputChange],
    ].forEach((idAndFunc) => {
        const [id, onChange] = idAndFunc;
        ['change'].forEach((eventType) => {
            document.getElementById(id).addEventListener(eventType, onChange);
        });
    });
})();
