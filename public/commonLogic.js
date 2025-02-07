(() => {
    const addClassToElement = (elem, className) => {
        // First test to see if it already contains this class
        if (
            elem.className &&
            new RegExp(`\\b${className}\\b`).test(elem.className)
        ) {
            return;
        }
        let classes = elem.className;
        if (classes) {
            classes = `${classes} ${className}`;
        } else {
            classes = className;
        }
        elem.className = classes;
    };

    const addHiddenClassToElement = (elem) => {
        addClassToElement(elem, 'hidden');
    };

    window.devSsoIdp.addClassToElement = addClassToElement;
    window.devSsoIdp.addHiddenClassToElement = addHiddenClassToElement;

    const removeClassFromElement = (elem, className) => {
        if (
            !elem.className ||
            !new RegExp(`\\b${className}\\b`).test(elem.className)
        ) {
            return;
        }
        let classes = elem.className.split(' ');
        classes = classes.filter((str) => str !== className);
        elem.className = classes.join(' ');
    };

    const removeHiddenClassFromElement = (elem) => {
        removeClassFromElement(elem, 'hidden');
    };

    window.devSsoIdp.removeClassFromElement = removeClassFromElement;
    window.devSsoIdp.removeHiddenClassFromElement =
        removeHiddenClassFromElement;

    const disableSimButtons = (doc) => {
        const simButtons = doc.getElementsByClassName('simButton');
        for (const simButton of simButtons) {
            addClassToElement(simButton, 'disabled');
            simButton.setAttribute(
                'title',
                'Cannot simulate due to above errors'
            );
            simButton.setAttribute('disabled', '');
        }
    };

    window.devSsoIdp.disableSimButtons = disableSimButtons;
})();
