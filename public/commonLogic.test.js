/**
 * @jest-environment jsdom
 */

describe('public/commonLogic.js', () => {
    beforeAll(async () => {
        window.devSsoIdp = {};
        await import('./commonLogic.js');
    });

    test('should be able to add a class to an element that already has another', () => {
        document.body.innerHTML =
            '<div>' +
            '  <div id="targetElement" class="initialClass"></div>' +
            '  <div id="someOtherElement" class="initialClass"></div>' +
            '  <div id="yetAnotherElement" class="someOtherClass"></div>' +
            '  <div id="andAnotherElement"></div>' +
            '</div>';
        const targetElement = document.getElementById('targetElement');
        const someOtherElement = document.getElementById('someOtherElement');
        const yetAnotherElement = document.getElementById('yetAnotherElement');
        const andAnotherElement = document.getElementById('andAnotherElement');

        window.devSsoIdp.addClassToElement(targetElement, 'newClass');

        expect(targetElement.className).toBe('initialClass newClass');
        expect(someOtherElement.className).toBe('initialClass');
        expect(yetAnotherElement.className).toBe('someOtherClass');
        expect(andAnotherElement.className).toBe('');
    });

    test("should be able to add a class to an element that doesn't have one", () => {
        document.body.innerHTML =
            '<div>' +
            '  <div id="targetElement"></div>' +
            '  <div id="someOtherElement" class="initialClass"></div>' +
            '  <div id="yetAnotherElement" class="someOtherClass"></div>' +
            '  <div id="andAnotherElement"></div>' +
            '</div>';
        const targetElement = document.getElementById('targetElement');
        const someOtherElement = document.getElementById('someOtherElement');
        const yetAnotherElement = document.getElementById('yetAnotherElement');
        const andAnotherElement = document.getElementById('andAnotherElement');

        window.devSsoIdp.addClassToElement(targetElement, 'newClass');

        expect(targetElement.className).toBe('newClass');
        expect(someOtherElement.className).toBe('initialClass');
        expect(yetAnotherElement.className).toBe('someOtherClass');
        expect(andAnotherElement.className).toBe('');
    });

    test("should not change an element's class if an attempt is made to add a class that already exists on it", () => {
        document.body.innerHTML =
            '<div>' +
            '  <div id="targetElement" class="initialClass"></div>' +
            '  <div id="someOtherElement" class="initialClass"></div>' +
            '  <div id="yetAnotherElement" class="someOtherClass"></div>' +
            '  <div id="andAnotherElement"></div>' +
            '</div>';
        const targetElement = document.getElementById('targetElement');
        const someOtherElement = document.getElementById('someOtherElement');
        const yetAnotherElement = document.getElementById('yetAnotherElement');
        const andAnotherElement = document.getElementById('andAnotherElement');

        window.devSsoIdp.addClassToElement(targetElement, 'initialClass');

        expect(targetElement.className).toBe('initialClass');
        expect(someOtherElement.className).toBe('initialClass');
        expect(yetAnotherElement.className).toBe('someOtherClass');
        expect(andAnotherElement.className).toBe('');
    });

    test('should be able to add the "hidden" class to an element that doesn\'t have it', () => {
        document.body.innerHTML =
            '<div>' +
            '  <div id="targetElement" class="initialClass"></div>' +
            '  <div id="someOtherElement" class="initialClass"></div>' +
            '  <div id="yetAnotherElement" class="someOtherClass"></div>' +
            '  <div id="andAnotherElement"></div>' +
            '</div>';
        const targetElement = document.getElementById('targetElement');
        const someOtherElement = document.getElementById('someOtherElement');
        const yetAnotherElement = document.getElementById('yetAnotherElement');
        const andAnotherElement = document.getElementById('andAnotherElement');

        window.devSsoIdp.addHiddenClassToElement(targetElement);

        expect(targetElement.className).toBe('initialClass hidden');
        expect(someOtherElement.className).toBe('initialClass');
        expect(yetAnotherElement.className).toBe('someOtherClass');
        expect(andAnotherElement.className).toBe('');
    });

    test('should remove one class from an element that has multiple', () => {
        document.body.innerHTML =
            '<div>' +
            '  <div id="targetElement" class="remainingClass unwantedClass"></div>' +
            '  <div id="someOtherElement" class="unwantedClass"></div>' +
            '  <div id="yetAnotherElement" class="someOtherClass"></div>' +
            '  <div id="andAnotherElement"></div>' +
            '</div>';
        const targetElement = document.getElementById('targetElement');
        const someOtherElement = document.getElementById('someOtherElement');
        const yetAnotherElement = document.getElementById('yetAnotherElement');
        const andAnotherElement = document.getElementById('andAnotherElement');

        window.devSsoIdp.removeClassFromElement(targetElement, 'unwantedClass');

        expect(targetElement.className).toBe('remainingClass');
        expect(someOtherElement.className).toBe('unwantedClass');
        expect(yetAnotherElement.className).toBe('someOtherClass');
        expect(andAnotherElement.className).toBe('');
    });

    test('should remove one class from an element that has only one', () => {
        document.body.innerHTML =
            '<div>' +
            '  <div id="targetElement" class="unwantedClass"></div>' +
            '  <div id="someOtherElement" class="unwantedClass"></div>' +
            '  <div id="yetAnotherElement" class="someOtherClass"></div>' +
            '  <div id="andAnotherElement"></div>' +
            '</div>';
        const targetElement = document.getElementById('targetElement');
        const someOtherElement = document.getElementById('someOtherElement');
        const yetAnotherElement = document.getElementById('yetAnotherElement');
        const andAnotherElement = document.getElementById('andAnotherElement');

        window.devSsoIdp.removeClassFromElement(targetElement, 'unwantedClass');

        expect(targetElement.className).toBe('');
        expect(someOtherElement.className).toBe('unwantedClass');
        expect(yetAnotherElement.className).toBe('someOtherClass');
        expect(andAnotherElement.className).toBe('');
    });

    test('should remove the hidden class from one element', () => {
        document.body.innerHTML =
            '<div>' +
            '  <div id="targetElement" class="hidden"></div>' +
            '  <div id="someOtherElement" class="hidden"></div>' +
            '  <div id="yetAnotherElement" class="someOtherClass"></div>' +
            '  <div id="andAnotherElement"></div>' +
            '</div>';
        const targetElement = document.getElementById('targetElement');
        const someOtherElement = document.getElementById('someOtherElement');
        const yetAnotherElement = document.getElementById('yetAnotherElement');
        const andAnotherElement = document.getElementById('andAnotherElement');

        window.devSsoIdp.removeHiddenClassFromElement(targetElement);

        expect(targetElement.className).toBe('');
        expect(someOtherElement.className).toBe('hidden');
        expect(yetAnotherElement.className).toBe('someOtherClass');
        expect(andAnotherElement.className).toBe('');
    });

    test('should disable all buttons with the "simButton" class', () => {
        document.body.innerHTML =
            '<div>' +
            '  <button id="simButton1" class="simButton"></button>' +
            '  <button id="simButton2" class="simButton someOtherClass"></button>' +
            '  <button id="notSimButton" class="notSimButton"></button>' +
            '</div>';
        const simButton1 = document.getElementById('simButton1');
        const simButton2 = document.getElementById('simButton2');
        const notSimButton = document.getElementById('notSimButton');

        window.devSsoIdp.disableSimButtons(document);

        expect(simButton1.className).toBe('simButton disabled');
        expect(simButton1.title).toBe('Cannot simulate due to above errors');
        expect(simButton1.hasAttribute('disabled')).toBe(true);

        expect(simButton2.className).toBe('simButton someOtherClass disabled');
        expect(simButton2.title).toBe('Cannot simulate due to above errors');
        expect(simButton2.hasAttribute('disabled')).toBe(true);

        expect(notSimButton.className).toBe('notSimButton');
        expect(notSimButton.title).toBe('');
        expect(notSimButton.hasAttribute('disabled')).toBe(false);
    });
});
