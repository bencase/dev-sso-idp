/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals';

const innerHtml = `<div>
    <section>
        <div>
            <label>Theme:</label>
            <input id="themeLightInput" type="radio" name="theme" value="light"><label>Light</label>
            <input id="themeDarkInput" type="radio" name="theme" value="dark"><label>Dark</label>
            <input id="themeSystemDefaultInput" type="radio" name="theme" value="sys"><label>System Default</label>
        </div>
    </section>
    <section>
        <div>
            <input id="autoRedirectAfterLoadInput" type="checkbox">
            <label>Auto-redirect after load</label>
        </div>
        <small>
            Auto-redirect caption text here.
        </small>
    </section>
    <section>
        <div>
            <input id="failWhenAutoRedirectingInput" type="checkbox">
            <label>Fail when auto-redirecting?</label>
        </div>
        <small>
            Fail when auto-redirecting caption text here.
        </small>
    </section>
    <section>
        <div>
            <label>Error:</label>
            <input id="errorInput" type="text">
        </div>
        <small>
            Error caption text here.
        </small>
    </section>
    <section>
        <div>
            <label>Error Description:</label>
            <input id="errorDescInput" type="text">
        </div>
        <small>
            Error description caption text here.
        </small>
    </section>
    <section>
        <div>
            <label>Loading delay (ms):</label>
            <input id="loadingDelayInput" type="number" min="0" step="100">
        </div>
        <small>
            Loading delay caption text here.
        </small>
    </section>
</div>`;

const resetValues = () => {
    window.devSsoIdp.settings.theme = undefined;
    window.devSsoIdp.settings.autoRedirectAfterLoad = undefined;
    window.devSsoIdp.settings.failWhenAutoRedirecting = undefined;
    window.devSsoIdp.settings.loadingDelay = undefined;
    window.devSsoIdp.settings.error = undefined;
    window.devSsoIdp.settings.errorDesc = undefined;
    window.localStorage.clear();
    document.getElementById('themeLightInput').checked = false;
    document.getElementById('themeDarkInput').checked = false;
    document.getElementById('themeSystemDefaultInput').checked = false;
    document.getElementById('autoRedirectAfterLoadInput').checked = false;
    document.getElementById('failWhenAutoRedirectingInput').checked = false;
    document.getElementById('loadingDelayInput').value = '';
    document.getElementById('errorInput').value = '';
    document.getElementById('errorDescInput').value = '';
};

const initializeSettingsWithValues = () => {
    window.devSsoIdp.settings.autoRedirectAfterLoad = true;
    window.devSsoIdp.settings.failWhenAutoRedirecting = true;
    window.devSsoIdp.settings.loadingDelay = 1000;
    window.devSsoIdp.settings.error = 'access_denied';
    window.devSsoIdp.settings.errorDesc = 'Error description';
    window.localStorage.setItem(
        window.devSsoIdp.settingKeys.autoRedirectAfterLoad,
        'y'
    );
    window.localStorage.setItem(
        window.devSsoIdp.settingKeys.failWhenAutoRedirecting,
        'y'
    );
    window.localStorage.setItem(
        window.devSsoIdp.settingKeys.loadingDelay,
        '1000'
    );
    window.localStorage.setItem(
        window.devSsoIdp.settingKeys.error,
        'access_denied'
    );
    window.localStorage.setItem(
        window.devSsoIdp.settingKeys.errorDesc,
        'Error description'
    );
    document.getElementById('autoRedirectAfterLoadInput').checked = true;
    document.getElementById('failWhenAutoRedirectingInput').checked = true;
    document.getElementById('loadingDelayInput').value = '1000';
    document.getElementById('errorInput').value = 'access_denied';
    document.getElementById('errorDescInput').value = 'Error description';
};

describe('public/settingsBehavior.js', () => {
    const changeThemeFunc = jest.fn();

    beforeAll(async () => {
        window.devSsoIdp = {
            settings: {},
            settingKeys: {
                theme: 'theme',
                autoRedirectAfterLoad: 'autoRedirectAfterLoad',
                loadingDelay: 'loadingDelay',
                failWhenAutoRedirecting: 'failWhenAutoRedirecting',
                error: 'error',
                errorDesc: 'errorDesc',
            },
        };
        window.devSsoIdp.changeTheme = changeThemeFunc;
        document.body.innerHTML = innerHtml;
        await import('./settingsBehavior.js');
    });

    beforeEach(() => {
        for (let key in window.devSsoIdp.settings) {
            if (
                Object.prototype.hasOwnProperty.call(
                    window.devSsoIdp.settings,
                    key
                )
            ) {
                delete window.devSsoIdp.settings[key];
            }
        }
    });

    afterEach(() => {
        jest.clearAllMocks();
        resetValues();
    });

    test('should change theme to light', () => {
        const settings = window.devSsoIdp.settings;
        const settingKeys = window.devSsoIdp.settingKeys;

        const themeLightInput = document.getElementById('themeLightInput');
        const themeDarkInput = document.getElementById('themeDarkInput');
        const themeSysInput = document.getElementById(
            'themeSystemDefaultInput'
        );

        themeLightInput.click();

        expect(changeThemeFunc).toHaveBeenCalledWith('light');
        expect(settings.theme).toBe('light');
        expect(window.localStorage.getItem(settingKeys.theme)).toBe('light');
        expect(themeLightInput.checked).toBe(true);
        expect(themeDarkInput.checked).toBe(false);
        expect(themeSysInput.checked).toBe(false);
    });

    test('should set autoRedirectAfterLoad to true', () => {
        const settings = window.devSsoIdp.settings;
        const settingKeys = window.devSsoIdp.settingKeys;

        const autoRedirectAfterLoadInput = document.getElementById(
            'autoRedirectAfterLoadInput'
        );

        autoRedirectAfterLoadInput.click();

        expect(settings.autoRedirectAfterLoad).toBe(true);
        expect(
            window.localStorage.getItem(settingKeys.autoRedirectAfterLoad)
        ).toBe('y');
        expect(autoRedirectAfterLoadInput.checked).toBe(true);
    });

    test('should set autoRedirectAfterLoad to false', () => {
        initializeSettingsWithValues();
        const settings = window.devSsoIdp.settings;
        const settingKeys = window.devSsoIdp.settingKeys;

        const autoRedirectAfterLoadInput = document.getElementById(
            'autoRedirectAfterLoadInput'
        );

        autoRedirectAfterLoadInput.click();

        expect(settings.autoRedirectAfterLoad).toBe(false);
        expect(
            window.localStorage.getItem(settingKeys.autoRedirectAfterLoad)
        ).toBe(null);
        expect(autoRedirectAfterLoadInput.checked).toBe(false);
    });

    test('should set loadingDelay to 2000', () => {
        const settings = window.devSsoIdp.settings;
        const settingKeys = window.devSsoIdp.settingKeys;

        const loadingDelayInput = document.getElementById('loadingDelayInput');

        loadingDelayInput.value = '2000';
        loadingDelayInput.dispatchEvent(new Event('change'));

        expect(settings.loadingDelay).toBe(2000);
        expect(window.localStorage.getItem(settingKeys.loadingDelay)).toBe(
            '2000'
        );
        expect(loadingDelayInput.value).toBe('2000');
    });

    test('should clear loadingDelay', () => {
        initializeSettingsWithValues();
        const settings = window.devSsoIdp.settings;
        const settingKeys = window.devSsoIdp.settingKeys;

        const loadingDelayInput = document.getElementById('loadingDelayInput');

        loadingDelayInput.value = '0';
        loadingDelayInput.dispatchEvent(new Event('change'));

        expect(settings.loadingDelay).toBe(undefined);
        expect(window.localStorage.getItem(settingKeys.loadingDelay)).toBe(
            null
        );
        expect(loadingDelayInput.value).toBe('0');
    });

    test('should set failWhenAutoRedirecting to true', () => {
        const settings = window.devSsoIdp.settings;
        const settingKeys = window.devSsoIdp.settingKeys;

        const failWhenAutoRedirectingInput = document.getElementById(
            'failWhenAutoRedirectingInput'
        );

        failWhenAutoRedirectingInput.click();

        expect(settings.failWhenAutoRedirecting).toBe(true);
        expect(
            window.localStorage.getItem(settingKeys.failWhenAutoRedirecting)
        ).toBe('y');
        expect(failWhenAutoRedirectingInput.checked).toBe(true);
    });

    test('should set failWhenAutoRedirecting to false', () => {
        initializeSettingsWithValues();
        const settings = window.devSsoIdp.settings;
        const settingKeys = window.devSsoIdp.settingKeys;

        const failWhenAutoRedirectingInput = document.getElementById(
            'failWhenAutoRedirectingInput'
        );

        failWhenAutoRedirectingInput.click();

        expect(settings.failWhenAutoRedirecting).toBe(false);
        expect(
            window.localStorage.getItem(settingKeys.failWhenAutoRedirecting)
        ).toBe(null);
        expect(failWhenAutoRedirectingInput.checked).toBe(false);
    });

    test('should set error to "invalid_request"', () => {
        const settings = window.devSsoIdp.settings;
        const settingKeys = window.devSsoIdp.settingKeys;

        const errorInput = document.getElementById('errorInput');

        errorInput.value = 'invalid_request';
        errorInput.dispatchEvent(new Event('change'));

        expect(settings.error).toBe('invalid_request');
        expect(window.localStorage.getItem(settingKeys.error)).toBe(
            'invalid_request'
        );
        expect(errorInput.value).toBe('invalid_request');
    });

    test('should clear error', () => {
        initializeSettingsWithValues();
        const settings = window.devSsoIdp.settings;
        const settingKeys = window.devSsoIdp.settingKeys;

        const errorInput = document.getElementById('errorInput');

        errorInput.value = '';
        errorInput.dispatchEvent(new Event('change'));

        expect(settings.error).toBe(undefined);
        expect(window.localStorage.getItem(settingKeys.error)).toBe(null);
        expect(errorInput.value).toBe('');
    });

    test('should set errorDesc to "Invalid request"', () => {
        const settings = window.devSsoIdp.settings;
        const settingKeys = window.devSsoIdp.settingKeys;

        const errorDescInput = document.getElementById('errorDescInput');

        errorDescInput.value = 'Invalid request';
        errorDescInput.dispatchEvent(new Event('change'));

        expect(settings.errorDesc).toBe('Invalid request');
        expect(window.localStorage.getItem(settingKeys.errorDesc)).toBe(
            'Invalid request'
        );
        expect(errorDescInput.value).toBe('Invalid request');
    });

    test('should clear errorDesc', () => {
        initializeSettingsWithValues();
        const settings = window.devSsoIdp.settings;
        const settingKeys = window.devSsoIdp.settingKeys;

        const errorDescInput = document.getElementById('errorDescInput');

        errorDescInput.value = '';
        errorDescInput.dispatchEvent(new Event('change'));

        expect(settings.errorDesc).toBe(undefined);
        expect(window.localStorage.getItem(settingKeys.errorDesc)).toBe(null);
        expect(errorDescInput.value).toBe('');
    });
});
