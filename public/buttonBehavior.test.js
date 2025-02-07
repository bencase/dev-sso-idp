/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals';

test('should have created event listeners', async () => {
    document.body.innerHTML =
        '<div>' +
        '  <button id="succeedButton"></button>' +
        '  <button id="failButton"></button>' +
        '</div>';
    const succeedButtonElem = document.getElementById('succeedButton');
    const failButtonElem = document.getElementById('failButton');

    const redirectWithSuccess = jest.fn();
    const redirectWithFail = jest.fn();
    window.devSsoIdp = {
        redirectWithSuccess: redirectWithSuccess,
        redirectWithFail: redirectWithFail,
    };

    const succeedSpy = jest.spyOn(succeedButtonElem, 'addEventListener');
    const failSpy = jest.spyOn(failButtonElem, 'addEventListener');

    // Lazy load the file so that the above mocks are in place before it runs
    await import('./buttonBehavior.js');

    expect(succeedSpy).toHaveBeenCalledTimes(1);
    expect(succeedSpy.mock.calls[0][0]).toBe('click');
    expect(succeedSpy.mock.calls[0][1]).toBe(redirectWithSuccess);
    expect(failSpy).toHaveBeenCalledTimes(1);
    expect(failSpy.mock.calls[0][0]).toBe('click');
    expect(failSpy.mock.calls[0][1]).toBe(redirectWithFail);

    jest.restoreAllMocks();
});
