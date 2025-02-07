/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals';

const initDevSsoIdp = () => {
    window.devSsoIdp = {
        ...window.devSsoIdp,
        maySimulate: true,
        requestParams: {
            scope: ['openid', 'profile', 'email'],
            redirectUri: 'http://localhost:5173',
            clientId: 'relying_party',
            nonce: 'my%nonce',
        },
        settings: {
            autoRedirectAfterLoad: false,
            failWhenAutoRedirecting: false,
        },
    };
};

describe('public/getCode.js', () => {
    beforeAll(async () => {
        initDevSsoIdp();
        await import('./getCode.js');
    });

    beforeEach(() => {
        initDevSsoIdp();
        document.body.innerHTML = `<div>
                <div id="simulatorLoadingSpinner"></div>
                <div id="simulatorContent" class="hidden">
                    <button id="succeedButton"></button>
                    <button id="failButton"></button>
                    <div id="codeErrorContainer" class="errorContainer errorContainerColor hidden"></div>
                </div>
            </div>`;
    });

    test('should add code to window.devSsoIdp if code retrieval succeeds', (done) => {
        window.devSsoIdp.disableSimButtons = jest.fn();
        window.devSsoIdp.addHiddenClassToElement = jest.fn();
        window.devSsoIdp.removeHiddenClassFromElement = jest.fn();
        window.devSsoIdp.redirectWithFail = jest.fn();
        window.devSsoIdp.redirectWithSuccess = jest.fn();

        fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                status: 200,
                json: () => Promise.resolve({ code: '12345' }),
            })
        );

        const loadingSpinnerElem = window.document.getElementById(
            'simulatorLoadingSpinner'
        );
        const simulatorContentElem =
            window.document.getElementById('simulatorContent');
        const codeErrorContainerElem =
            window.document.getElementById('codeErrorContainer');

        window.devSsoIdp.retrieveCode();

        expect(fetch).toHaveBeenCalledWith(
            '/api/v1/code?scopeStr=openid%20profile%20email&redirectUri=http%3A%2F%2Flocalhost%3A5173&clientId=relying_party&nonce=my%25nonce'
        );

        setTimeout(() => {
            try {
                expect(window.devSsoIdp.code).toBe('12345');

                expect(
                    window.devSsoIdp.disableSimButtons
                ).not.toHaveBeenCalled();
                expect(
                    window.devSsoIdp.addHiddenClassToElement
                ).toHaveBeenCalledWith(loadingSpinnerElem);
                expect(
                    window.devSsoIdp.removeHiddenClassFromElement
                ).toHaveBeenCalledWith(simulatorContentElem);
                expect(
                    window.devSsoIdp.removeHiddenClassFromElement
                ).not.toHaveBeenCalledWith(codeErrorContainerElem);

                expect(
                    window.devSsoIdp.redirectWithFail
                ).not.toHaveBeenCalled();
                expect(
                    window.devSsoIdp.redirectWithSuccess
                ).not.toHaveBeenCalled();

                done();
            } catch (error) {
                done(error);
            }
        }, 10);
    });

    test('should auto redirect if autoRedirect request param is set to y', (done) => {
        window.devSsoIdp.requestParams.autoRedirect = 'y';
        window.devSsoIdp.requestParams.scope = ['openid'];
        delete window.devSsoIdp.requestParams.nonce;

        window.devSsoIdp.redirectWithFail = jest.fn();
        window.devSsoIdp.redirectWithSuccess = jest.fn();

        fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                status: 200,
                json: () => Promise.resolve({ code: '12345' }),
            })
        );

        window.devSsoIdp.retrieveCode();

        expect(fetch).toHaveBeenCalledWith(
            '/api/v1/code?scopeStr=openid&redirectUri=http%3A%2F%2Flocalhost%3A5173&clientId=relying_party'
        );

        setTimeout(() => {
            try {
                expect(window.devSsoIdp.code).toBe('12345');

                expect(
                    window.devSsoIdp.redirectWithFail
                ).not.toHaveBeenCalled();
                expect(window.devSsoIdp.redirectWithSuccess).toHaveBeenCalled();
                done();
            } catch (error) {
                done(error);
            }
        }, 10);
    });

    test('should auto redirect if autoRedirectAfterLoad setting is true', (done) => {
        window.devSsoIdp.settings.autoRedirectAfterLoad = true;
        window.devSsoIdp.requestParams.scope = ['openid'];
        delete window.devSsoIdp.requestParams.nonce;

        window.devSsoIdp.redirectWithFail = jest.fn();
        window.devSsoIdp.redirectWithSuccess = jest.fn();

        fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                status: 200,
                json: () => Promise.resolve({ code: '12345' }),
            })
        );

        window.devSsoIdp.retrieveCode();

        expect(fetch).toHaveBeenCalledWith(
            '/api/v1/code?scopeStr=openid&redirectUri=http%3A%2F%2Flocalhost%3A5173&clientId=relying_party'
        );

        setTimeout(() => {
            try {
                expect(window.devSsoIdp.code).toBe('12345');

                expect(
                    window.devSsoIdp.redirectWithFail
                ).not.toHaveBeenCalled();
                expect(window.devSsoIdp.redirectWithSuccess).toHaveBeenCalled();
                done();
            } catch (error) {
                done(error);
            }
        }, 10);
    });

    test('should disable simulation and show failure message on endpoint failure', (done) => {
        window.devSsoIdp.disableSimButtons = jest.fn();
        window.devSsoIdp.addHiddenClassToElement = jest.fn();
        window.devSsoIdp.removeHiddenClassFromElement = jest.fn();
        window.devSsoIdp.redirectWithFail = jest.fn();
        window.devSsoIdp.redirectWithSuccess = jest.fn();

        fetch = jest.fn(() => Promise.resolve({ ok: false, status: 500 }));

        const loadingSpinnerElem = window.document.getElementById(
            'simulatorLoadingSpinner'
        );
        const simulatorContentElem =
            window.document.getElementById('simulatorContent');
        const codeErrorContainerElem =
            window.document.getElementById('codeErrorContainer');

        window.devSsoIdp.retrieveCode();

        expect(fetch).toHaveBeenCalledWith(
            '/api/v1/code?scopeStr=openid%20profile%20email&redirectUri=http%3A%2F%2Flocalhost%3A5173&clientId=relying_party&nonce=my%25nonce'
        );

        setTimeout(() => {
            try {
                expect(window.devSsoIdp.disableSimButtons).toHaveBeenCalledWith(
                    window.document
                );
                expect(
                    window.devSsoIdp.addHiddenClassToElement
                ).toHaveBeenCalledWith(loadingSpinnerElem);
                expect(
                    window.devSsoIdp.removeHiddenClassFromElement
                ).toHaveBeenCalledWith(simulatorContentElem);
                expect(
                    window.devSsoIdp.removeHiddenClassFromElement
                ).toHaveBeenCalledWith(codeErrorContainerElem);

                expect(
                    window.devSsoIdp.redirectWithFail
                ).not.toHaveBeenCalled();
                expect(
                    window.devSsoIdp.redirectWithSuccess
                ).not.toHaveBeenCalled();

                done();
            } catch (error) {
                done(error);
            }
        }, 10);
    });
});
