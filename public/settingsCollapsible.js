(() => {
    const onCollapseButtonClick = () => {
        const settingsCollapseButtonElem = document.getElementById(
            'settingsCollapseButton'
        );
        const isOpen = settingsCollapseButtonElem.getAttribute('open');
        const collapsibleIconContainerElem = document.getElementById(
            'collapseIconContainer'
        );
        const collapsibleContentElem = document.getElementById(
            'settingsCollapsibleContent'
        );
        if (isOpen || isOpen === '') {
            settingsCollapseButtonElem.removeAttribute('open');
            window.devSsoIdp.addHiddenClassToElement(collapsibleContentElem);
            window.devSsoIdp.addClassToElement(
                collapsibleIconContainerElem,
                'collapseIconContainerRotateRight'
            );
            window.devSsoIdp.removeClassFromElement(
                collapsibleIconContainerElem,
                'collapseIconContainerRotateDown'
            );
        } else {
            settingsCollapseButtonElem.setAttribute('open', '');
            window.devSsoIdp.removeHiddenClassFromElement(
                collapsibleContentElem
            );
            window.devSsoIdp.addClassToElement(
                collapsibleIconContainerElem,
                'collapseIconContainerRotateDown'
            );
            window.devSsoIdp.removeClassFromElement(
                collapsibleIconContainerElem,
                'collapseIconContainerRotateRight'
            );
        }
    };

    document
        .getElementById('settingsCollapseButton')
        .addEventListener('click', onCollapseButtonClick);
})();
