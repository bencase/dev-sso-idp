/**
 * @jest-environment jsdom
 */

describe('public/settingsInit.js', () => {
    beforeAll(async () => {
        await import('./settingsInit.js');
    });

    afterEach(() => {
        window.localStorage.clear();
    });

    test('should set default settings when no settings are in local storage', () => {
        window.devSsoIdp.initializeSettings();

        expect(window.devSsoIdp.settings.theme).toBe('sys');
        expect(window.devSsoIdp.settings.autoRedirectAfterLoad).toBe(false);
        expect(window.devSsoIdp.settings.loadingDelay).toBe(0);
        expect(window.devSsoIdp.settings.failWhenAutoRedirecting).toBe(false);
        expect(window.devSsoIdp.settings.error).toBe('access_denied');
        expect(window.devSsoIdp.settings.errorDesc).toBe('');
    });

    test('should set settings from local storage when they exist', () => {
        window.localStorage.setItem('theme', 'light');
        window.localStorage.setItem('autoRedirectAfterLoad', 'y');
        window.localStorage.setItem('loadingDelay', '2000');
        window.localStorage.setItem('failWhenAutoRedirecting', 'y');
        window.localStorage.setItem('error', 'invalid_request');
        window.localStorage.setItem('errorDesc', 'An error occurred');

        window.devSsoIdp.initializeSettings();

        expect(window.devSsoIdp.settings.theme).toBe('light');
        expect(window.devSsoIdp.settings.autoRedirectAfterLoad).toBe(true);
        expect(window.devSsoIdp.settings.loadingDelay).toBe(2000);
        expect(window.devSsoIdp.settings.failWhenAutoRedirecting).toBe(true);
        expect(window.devSsoIdp.settings.error).toBe('invalid_request');
        expect(window.devSsoIdp.settings.errorDesc).toBe('An error occurred');
    });
});
