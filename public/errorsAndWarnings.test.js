/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals';

describe('errorsAndWarnings', () => {
    beforeAll(async () => {
        window.devSsoIdp = {};
        await import('./errorsAndWarnings');
    });

    test('should disable simulation and show envVarErrorsContainer if there are env var errors', () => {
        document.body.innerHTML = `
            <div id="envVarErrorsContainer" class="errorContainer hidden">
                <ul id="envVarErrorsList"></ul>
            </div>
            <div id="requestParamErrorsContainer" class="errorContainer hidden">
                <ul id="requestParamErrorsList"></ul>
            </div>
        `;
        const envVarErrorsContainer = document.getElementById(
            'envVarErrorsContainer'
        );
        const envVarErrorsList = document.getElementById('envVarErrorsList');
        const requestParamErrorsList = document.getElementById(
            'requestParamErrorsList'
        );

        const removeHiddenClass = jest.fn();
        const disableSimButtons = jest.fn();
        window.devSsoIdp = {
            ...window.devSsoIdp,
            envVarValidity: {
                0: {
                    isValid: false,
                    message: 'percent encoded redirect uris error message',
                    var: 'PERCENT_ENCODED_REDIRECT_URIS',
                },
                1: {
                    isValid: false,
                    message: 'client ids error message',
                    var: 'CLIENT_IDS',
                },
            },
            requestParamValidity: {
                responseType: { isValid: true },
                clientId: { isValid: true },
                scope: { isValid: true },
                redirectUri: { isValid: true },
            },
            removeHiddenClassFromElement: removeHiddenClass,
            disableSimButtons: disableSimButtons,
        };

        window.devSsoIdp.addErrorsAndWarnings();

        const envVarErrorsListChildren = envVarErrorsList.children;
        expect(envVarErrorsListChildren.length).toBe(2);

        expect(envVarErrorsListChildren[0].tagName).toBe('LI');
        expect(envVarErrorsListChildren[0].className).toBe('liText');
        expect(envVarErrorsListChildren[0].textContent).toBe(
            'percent encoded redirect uris error message'
        );
        expect(envVarErrorsListChildren[0].children.length).toBe(1);

        expect(envVarErrorsListChildren[1].tagName).toBe('LI');
        expect(envVarErrorsListChildren[1].className).toBe('liText');
        expect(envVarErrorsListChildren[1].textContent).toBe(
            'client ids error message'
        );
        expect(envVarErrorsListChildren[1].children.length).toBe(1);

        const requestParamErrorsListChildren = requestParamErrorsList.children;
        expect(requestParamErrorsListChildren.length).toBe(0);

        expect(removeHiddenClass).toHaveBeenCalledTimes(1);
        expect(removeHiddenClass).toHaveBeenCalledWith(envVarErrorsContainer);
        expect(disableSimButtons).toHaveBeenCalledTimes(1);

        expect(window.devSsoIdp.maySimulate).toBe(false);
    });

    test('should disable simulation and show requestParamErrorsContainer if there are request param errors', async () => {
        document.body.innerHTML = `
            <div id="envVarErrorsContainer" class="errorContainer hidden">
                <ul id="envVarErrorsList"></ul>
            </div>
            <div id="requestParamErrorsContainer" class="errorContainer hidden">
                <ul id="requestParamErrorsList"></ul>
            </div>
        `;
        const envVarErrorsList = document.getElementById('envVarErrorsList');
        const requestParamErrorsContainer = document.getElementById(
            'requestParamErrorsContainer'
        );
        const requestParamErrorsList = document.getElementById(
            'requestParamErrorsList'
        );

        const removeHiddenClass = jest.fn();
        const disableSimButtons = jest.fn();
        window.devSsoIdp = {
            ...window.devSsoIdp,
            envVarValidity: {
                0: { isValid: true },
                1: { isValid: true },
            },
            requestParamValidity: {
                clientId: {
                    isValid: false,
                    message: 'client id error message',
                    validList: ['client_id_1', 'client_id_2', 'client_id_3'],
                },
                redirectUri: {
                    isValid: false,
                    message: 'redirect uri error message',
                    validList: [
                        'http://localhost:5173',
                        'http://localhost:8080',
                    ],
                },
                responseType: {
                    isValid: false,
                    message: 'response type error message',
                },
                scope: {
                    isValid: false,
                    message: 'scope error message',
                },
            },
            removeHiddenClassFromElement: removeHiddenClass,
            disableSimButtons: disableSimButtons,
        };

        window.devSsoIdp.addErrorsAndWarnings();

        const envVarErrorsListChildren = envVarErrorsList.children;
        expect(envVarErrorsListChildren.length).toBe(0);

        const requestParamErrorsListChildren = requestParamErrorsList.children;
        expect(requestParamErrorsListChildren.length).toBe(4);

        expect(requestParamErrorsListChildren[0].tagName).toBe('LI');
        expect(requestParamErrorsListChildren[0].className).toBe('liText');
        expect(
            requestParamErrorsListChildren[0].getElementsByTagName('span')[0]
                .textContent
        ).toBe('response type error message');
        expect(requestParamErrorsListChildren[0].children.length).toBe(1);

        expect(requestParamErrorsListChildren[1].tagName).toBe('LI');
        expect(requestParamErrorsListChildren[1].className).toBe('liText');
        expect(
            requestParamErrorsListChildren[1].getElementsByTagName('span')[0]
                .textContent
        ).toBe('client id error message');
        expect(requestParamErrorsListChildren[1].children.length).toBe(2);
        const clientIdUl =
            requestParamErrorsListChildren[1].getElementsByTagName('ul')[0];
        expect(clientIdUl.children.length).toBe(3);
        expect(clientIdUl.children[0].tagName).toBe('LI');
        expect(clientIdUl.children[0].textContent).toBe('client_id_1');
        expect(clientIdUl.children[1].tagName).toBe('LI');
        expect(clientIdUl.children[1].textContent).toBe('client_id_2');
        expect(clientIdUl.children[2].tagName).toBe('LI');
        expect(clientIdUl.children[2].textContent).toBe('client_id_3');

        expect(requestParamErrorsListChildren[2].tagName).toBe('LI');
        expect(requestParamErrorsListChildren[2].className).toBe('liText');
        expect(
            requestParamErrorsListChildren[2].getElementsByTagName('span')[0]
                .textContent
        ).toBe('scope error message');
        expect(requestParamErrorsListChildren[2].children.length).toBe(1);

        expect(requestParamErrorsListChildren[3].tagName).toBe('LI');
        expect(requestParamErrorsListChildren[3].className).toBe('liText');
        expect(
            requestParamErrorsListChildren[3].getElementsByTagName('span')[0]
                .textContent
        ).toBe('redirect uri error message');
        expect(requestParamErrorsListChildren[3].children.length).toBe(2);
        const redirectUriUl =
            requestParamErrorsListChildren[3].getElementsByTagName('ul')[0];
        expect(redirectUriUl.children.length).toBe(2);
        expect(redirectUriUl.children[0].tagName).toBe('LI');
        expect(redirectUriUl.children[0].textContent).toBe(
            'http://localhost:5173'
        );
        expect(redirectUriUl.children[1].tagName).toBe('LI');
        expect(redirectUriUl.children[1].textContent).toBe(
            'http://localhost:8080'
        );

        expect(removeHiddenClass).toHaveBeenCalledTimes(1);
        expect(removeHiddenClass).toHaveBeenCalledWith(
            requestParamErrorsContainer
        );
        expect(disableSimButtons).toHaveBeenCalledTimes(1);

        expect(window.devSsoIdp.maySimulate).toBe(false);
    });

    test('should disable simulation and show both envVarErrorsContainer and requestParamErrorsContainer if each has errors pertaining to it', () => {
        document.body.innerHTML = `
            <div id="envVarErrorsContainer" class="errorContainer hidden">
                <ul id="envVarErrorsList"></ul>
            </div>
            <div id="requestParamErrorsContainer" class="errorContainer hidden">
                <ul id="requestParamErrorsList"></ul>
            </div>
        `;
        const envVarErrorsContainer = document.getElementById(
            'envVarErrorsContainer'
        );
        const envVarErrorsList = document.getElementById('envVarErrorsList');
        const requestParamErrorsContainer = document.getElementById(
            'requestParamErrorsContainer'
        );
        const requestParamErrorsList = document.getElementById(
            'requestParamErrorsList'
        );

        const removeHiddenClass = jest.fn();
        const disableSimButtons = jest.fn();
        window.devSsoIdp = {
            ...window.devSsoIdp,
            envVarValidity: {
                0: {
                    isValid: false,
                    message: 'percent encoded redirect uris error message',
                    var: 'PERCENT_ENCODED_REDIRECT_URIS',
                },
                1: {
                    isValid: false,
                    message: 'client ids error message',
                    var: 'CLIENT_IDS',
                },
            },
            requestParamValidity: {
                clientId: {
                    isValid: false,
                    message: 'client id error message',
                    validList: ['client_id_1', 'client_id_2', 'client_id_3'],
                },
                redirectUri: {
                    isValid: false,
                    message: 'redirect uri error message',
                    validList: [
                        'http://localhost:5173',
                        'http://localhost:8080',
                    ],
                },
                responseType: {
                    isValid: false,
                    message: 'response type error message',
                },
                scope: {
                    isValid: false,
                    message: 'scope error message',
                },
            },
            removeHiddenClassFromElement: removeHiddenClass,
            disableSimButtons: disableSimButtons,
        };

        window.devSsoIdp.addErrorsAndWarnings();

        const envVarErrorsListChildren = envVarErrorsList.children;
        expect(envVarErrorsListChildren.length).toBe(2);

        expect(envVarErrorsListChildren[0].tagName).toBe('LI');
        expect(envVarErrorsListChildren[0].className).toBe('liText');
        expect(envVarErrorsListChildren[0].textContent).toBe(
            'percent encoded redirect uris error message'
        );
        expect(envVarErrorsListChildren[0].children.length).toBe(1);

        expect(envVarErrorsListChildren[1].tagName).toBe('LI');
        expect(envVarErrorsListChildren[1].className).toBe('liText');
        expect(envVarErrorsListChildren[1].textContent).toBe(
            'client ids error message'
        );
        expect(envVarErrorsListChildren[1].children.length).toBe(1);

        const requestParamErrorsListChildren = requestParamErrorsList.children;
        expect(requestParamErrorsListChildren.length).toBe(4);

        expect(requestParamErrorsListChildren[0].tagName).toBe('LI');
        expect(requestParamErrorsListChildren[0].className).toBe('liText');
        expect(
            requestParamErrorsListChildren[0].getElementsByTagName('span')[0]
                .textContent
        ).toBe('response type error message');
        expect(requestParamErrorsListChildren[0].children.length).toBe(1);

        expect(requestParamErrorsListChildren[1].tagName).toBe('LI');
        expect(requestParamErrorsListChildren[1].className).toBe('liText');
        expect(
            requestParamErrorsListChildren[1].getElementsByTagName('span')[0]
                .textContent
        ).toBe('client id error message');
        expect(requestParamErrorsListChildren[1].children.length).toBe(2);
        const clientIdUl =
            requestParamErrorsListChildren[1].getElementsByTagName('ul')[0];
        expect(clientIdUl.children.length).toBe(3);
        expect(clientIdUl.children[0].tagName).toBe('LI');
        expect(clientIdUl.children[0].textContent).toBe('client_id_1');
        expect(clientIdUl.children[1].tagName).toBe('LI');
        expect(clientIdUl.children[1].textContent).toBe('client_id_2');
        expect(clientIdUl.children[2].tagName).toBe('LI');
        expect(clientIdUl.children[2].textContent).toBe('client_id_3');

        expect(requestParamErrorsListChildren[2].tagName).toBe('LI');
        expect(requestParamErrorsListChildren[2].className).toBe('liText');
        expect(
            requestParamErrorsListChildren[2].getElementsByTagName('span')[0]
                .textContent
        ).toBe('scope error message');
        expect(requestParamErrorsListChildren[2].children.length).toBe(1);

        expect(requestParamErrorsListChildren[3].tagName).toBe('LI');
        expect(requestParamErrorsListChildren[3].className).toBe('liText');
        expect(
            requestParamErrorsListChildren[3].getElementsByTagName('span')[0]
                .textContent
        ).toBe('redirect uri error message');
        expect(requestParamErrorsListChildren[3].children.length).toBe(2);
        const redirectUriUl =
            requestParamErrorsListChildren[3].getElementsByTagName('ul')[0];
        expect(redirectUriUl.children.length).toBe(2);
        expect(redirectUriUl.children[0].tagName).toBe('LI');
        expect(redirectUriUl.children[0].textContent).toBe(
            'http://localhost:5173'
        );
        expect(redirectUriUl.children[1].tagName).toBe('LI');
        expect(redirectUriUl.children[1].textContent).toBe(
            'http://localhost:8080'
        );

        expect(removeHiddenClass).toHaveBeenCalledTimes(2);
        expect(removeHiddenClass).toHaveBeenCalledWith(envVarErrorsContainer);
        expect(removeHiddenClass).toHaveBeenCalledWith(
            requestParamErrorsContainer
        );
        expect(disableSimButtons).toHaveBeenCalledTimes(1);

        expect(window.devSsoIdp.maySimulate).toBe(false);
    });

    test('should not disable simulation if there are no errors', () => {
        document.body.innerHTML = `
            <div id="envVarErrorsContainer" class="errorContainer hidden">
                <ul id="envVarErrorsList"></ul>
            </div>
            <div id="requestParamErrorsContainer" class="errorContainer hidden">
                <ul id="requestParamErrorsList"></ul>
            </div>
        `;
        const envVarErrorsList = document.getElementById('envVarErrorsList');
        const requestParamErrorsList = document.getElementById(
            'requestParamErrorsList'
        );

        const removeHiddenClass = jest.fn();
        const disableSimButtons = jest.fn();
        window.devSsoIdp = {
            ...window.devSsoIdp,
            envVarValidity: {
                0: { isValid: true },
                1: { isValid: true },
            },
            requestParamValidity: {
                responseType: { isValid: true },
                clientId: { isValid: true },
                scope: { isValid: true },
                redirectUri: { isValid: true },
            },
            removeHiddenClassFromElement: removeHiddenClass,
            disableSimButtons: disableSimButtons,
        };

        window.devSsoIdp.addErrorsAndWarnings();

        expect(envVarErrorsList.children.length).toBe(0);
        expect(requestParamErrorsList.children.length).toBe(0);

        expect(removeHiddenClass).toHaveBeenCalledTimes(0);
        expect(disableSimButtons).toHaveBeenCalledTimes(0);

        expect(window.devSsoIdp.maySimulate).toBe(true);
    });
});
