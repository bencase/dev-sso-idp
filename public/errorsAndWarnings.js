window.devSsoIdp.maySimulate = false;

(() => {
    const getErrorElement = (doc, text, childList) => {
        const liTag = doc.createElement('li');
        liTag.className = 'liText';
        const span = doc.createElement('span');
        span.appendChild(doc.createTextNode(text));
        liTag.appendChild(span);
        if (childList && childList.length > 0) {
            const childListContainer = doc.createElement('ul');
            for (const childListItem of childList) {
                const childLiTag = doc.createElement('li');
                childLiTag.appendChild(doc.createTextNode(childListItem));
                childListContainer.appendChild(childLiTag);
            }
            liTag.appendChild(childListContainer);
        }
        return liTag;
    };

    const addErrorElementIfInvalid = (validityObj, doc, errorElements) => {
        if (!validityObj.isValid) {
            errorElements.push(
                getErrorElement(doc, validityObj.message, validityObj.validList)
            );
        }
    };

    const getErrorElements = (validityObj, validations, doc) => {
        let errorElements = [];
        for (const validation of validations) {
            addErrorElementIfInvalid(
                validityObj[validation],
                doc,
                errorElements
            );
        }
        return errorElements;
    };

    const getEnvVarValidationDesignations = (envVarValidity) => {
        const designations = [];
        for (const designation in envVarValidity) {
            designations.push(designation);
        }
        return designations;
    };

    const requestParamValidations = [
        'responseType',
        'clientId',
        'scope',
        'redirectUri',
    ];

    const disableIfErrors = () => {
        const doc = document;

        const envVarValidity = window.devSsoIdp.envVarValidity;
        const envVarErrorElems = getErrorElements(
            envVarValidity,
            getEnvVarValidationDesignations(envVarValidity),
            doc
        );
        if (envVarErrorElems.length > 0) {
            window.devSsoIdp.removeHiddenClassFromElement(
                doc.getElementById('envVarErrorsContainer')
            );
            const errorListContainer = doc.getElementById('envVarErrorsList');
            for (const elem of envVarErrorElems) {
                errorListContainer.appendChild(elem);
            }
        }

        const requestParamValidity = window.devSsoIdp.requestParamValidity;
        const requestParamErrorElems = getErrorElements(
            requestParamValidity,
            requestParamValidations,
            doc
        );
        if (requestParamErrorElems.length > 0) {
            window.devSsoIdp.removeHiddenClassFromElement(
                doc.getElementById('requestParamErrorsContainer')
            );
            const errorListContainer = doc.getElementById(
                'requestParamErrorsList'
            );
            for (const elem of requestParamErrorElems) {
                errorListContainer.appendChild(elem);
            }
        }

        const maySimulate =
            envVarErrorElems.length === 0 &&
            requestParamErrorElems.length === 0;
        window.devSsoIdp.maySimulate = maySimulate;

        // Disable the simulation buttons if there are errors
        if (!maySimulate) {
            window.devSsoIdp.disableSimButtons(doc);
        }
    };

    window.devSsoIdp.addErrorsAndWarnings = () => disableIfErrors();
})();

// The below prevents side-effects when running unit tests
// so that the side effects can be repeated in a controlled environment.
// The "try" is needed because the browser environment won't have "process".
/*global process*/
try {
    if (process?.env?.NODE_ENV !== 'test') {
        window.devSsoIdp.addErrorsAndWarnings();
    }
} catch {
    window.devSsoIdp.addErrorsAndWarnings();
}
