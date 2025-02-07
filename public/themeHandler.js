window.devSsoIdp.changeTheme = (newTheme) => {
    if (newTheme === 'sys') {
        if (window?.matchMedia?.('(prefers-color-scheme:light)')?.matches) {
            newTheme = 'light';
        } else {
            newTheme = 'dark';
        }
    }

    const bodyElem = window.document.getElementsByTagName('body')[0];

    if (newTheme === 'light') {
        window.devSsoIdp.addClassToElement(bodyElem, 'light');
    } else {
        window.devSsoIdp.removeClassFromElement(bodyElem, 'light');
    }
};

window.devSsoIdp.initializeTheme = () => {
    const theme = window.devSsoIdp.settings.theme;
    if ((theme && theme === 'light') || theme === 'sys') {
        window.devSsoIdp.changeTheme(theme);
    }
};

// The below prevents side-effects when running unit tests
// so that the side effects can be repeated in a controlled environment.
// The "try" is needed because the browser environment won't have "process".
/*global process*/
try {
    if (process?.env?.NODE_ENV !== 'test') {
        window.devSsoIdp.initializeTheme();
    }
} catch {
    window.devSsoIdp.initializeTheme();
}
