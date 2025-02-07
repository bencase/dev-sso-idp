/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals';

describe('public/settingsCollapsible.js', () => {
    const addHiddenClassToElement = jest.fn();
    const removeHiddenClassFromElement = jest.fn();
    const addClassToElement = jest.fn();
    const removeClassFromElement = jest.fn();

    beforeAll(async () => {
        window.devSsoIdp = {
            addHiddenClassToElement,
            removeHiddenClassFromElement,
            addClassToElement,
            removeClassFromElement,
        };
        document.body.innerHTML = `<div>
                <div class="settingsCollapsibleContainer">
                    <div id="settingsCollapseButton">
                        <span id="collapseIconContainer" class="collapseIconContainerRotateRight">Arrow goes here</span>
                        <span>Advanced Settings</span>
                    </div>
                    <div id="settingsCollapsibleContent" class="hidden"></div>
                </div>
            </div>`;
        await import('./settingsCollapsible.js');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should open settings when closed and button is clicked', () => {
        const button = document.getElementById('settingsCollapseButton');
        const arrow = document.getElementById('collapseIconContainer');
        const content = document.getElementById('settingsCollapsibleContent');

        button.click();

        expect(removeHiddenClassFromElement).toHaveBeenCalledWith(content);
        expect(addClassToElement).toHaveBeenCalledWith(
            arrow,
            'collapseIconContainerRotateDown'
        );
        expect(removeClassFromElement).toHaveBeenCalledWith(
            arrow,
            'collapseIconContainerRotateRight'
        );
        expect(button.getAttribute('open')).toBe('');
    });

    test('should close settings when open and button is clicked', () => {
        const button = document.getElementById('settingsCollapseButton');
        const arrow = document.getElementById('collapseIconContainer');
        const content = document.getElementById('settingsCollapsibleContent');

        button.setAttribute('open', '');
        arrow.className = 'collapseIconContainerRotateDown';
        content.className = '';

        button.click();

        expect(addHiddenClassToElement).toHaveBeenCalledWith(content);
        expect(addClassToElement).toHaveBeenCalledWith(
            arrow,
            'collapseIconContainerRotateRight'
        );
        expect(removeClassFromElement).toHaveBeenCalledWith(
            arrow,
            'collapseIconContainerRotateDown'
        );
        expect(button.getAttribute('open')).toBeNull();
    });
});
