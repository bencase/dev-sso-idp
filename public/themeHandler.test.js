/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals';

describe('public/themeHandler.js', () => {
    const addClassToElementFunc = jest.fn();
    const removeClassFromElementFunc = jest.fn();

    beforeAll(async () => {
        window.devSsoIdp = {
            settings: {
                theme: 'dark',
            },
            addClassToElement: addClassToElementFunc,
            removeClassFromElement: removeClassFromElementFunc,
        };
        document.body.innerHTML = `<body>
                <div>Content</div>
            </body>`;
        await import('./themeHandler.js');
    });

    afterEach(() => {
        window.devSsoIdp.settings.theme = 'dark';
        window.document.getElementsByTagName('body')[0].className = '';
        jest.clearAllMocks();
    });

    test('should not initialize theme if starting theme is "dark"', () => {
        window.devSsoIdp.initializeTheme();

        expect(window.devSsoIdp.settings.theme).toBe('dark');
        expect(addClassToElementFunc).not.toHaveBeenCalled();
    });

    test('should detect theme to be "light" and add "light" class to body', () => {
        window.devSsoIdp.settings.theme = 'light';

        window.devSsoIdp.initializeTheme();

        expect(window.devSsoIdp.settings.theme).toBe('light');

        const bodyElem = window.document.getElementsByTagName('body')[0];
        expect(addClassToElementFunc).toHaveBeenCalledWith(bodyElem, 'light');
        expect(removeClassFromElementFunc).not.toHaveBeenCalled();
    });

    test('should detect theme to be "sys" and use media query to determine theme (light)', () => {
        window.devSsoIdp.settings.theme = 'sys';
        window.matchMedia = jest.fn().mockReturnValue({
            matches: true,
        });

        window.devSsoIdp.initializeTheme();

        expect(window.devSsoIdp.settings.theme).toBe('sys');

        const bodyElem = window.document.getElementsByTagName('body')[0];
        expect(addClassToElementFunc).toHaveBeenCalledWith(bodyElem, 'light');
        expect(removeClassFromElementFunc).not.toHaveBeenCalled();

        expect(window.matchMedia).toHaveBeenCalledWith(
            '(prefers-color-scheme:light)'
        );

        delete window.matchMedia;
    });

    test('should detect theme to be "sys" and use media query to determine theme (dark)', () => {
        window.devSsoIdp.settings.theme = 'sys';
        window.matchMedia = jest.fn().mockReturnValue({
            matches: false,
        });

        window.devSsoIdp.initializeTheme();

        expect(window.devSsoIdp.settings.theme).toBe('sys');

        const bodyElem = window.document.getElementsByTagName('body')[0];
        expect(addClassToElementFunc).not.toHaveBeenCalled();
        expect(removeClassFromElementFunc).toHaveBeenCalledWith(
            bodyElem,
            'light'
        );

        expect(window.matchMedia).toHaveBeenCalledWith(
            '(prefers-color-scheme:light)'
        );

        delete window.matchMedia;
    });

    test('should remove "light" class from body when it is already there and theme is changed to "dark"', () => {
        window.devSsoIdp.settings.theme = 'light';
        const bodyElem = window.document.getElementsByTagName('body')[0];
        bodyElem.className = 'light';

        window.devSsoIdp.changeTheme('dark');

        expect(addClassToElementFunc).not.toHaveBeenCalled();
        expect(removeClassFromElementFunc).toHaveBeenCalledWith(
            bodyElem,
            'light'
        );
    });
});
