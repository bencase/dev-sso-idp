import { jest } from '@jest/globals';

import { createHtmlTransform } from './htmlTransform';

const getTransform = (obj) => {
    return {
        push: (val) => {
            if (!obj.output) {
                obj.output = [];
            }
            obj.output.push(val);
        },
    };
};

const inputHtml = `<!doctype html>
<html lang="en">
    <head>
        <style>
            /*NORMALIZE_CSS_GOES_HERE*/
        </style>
        <style>
            /*STYLES_CSS_GOES_HERE*/
        </style>
        <style>
            /*SUMMARIES_CSS_GOES_HERE*/
        </style>
    </head>
    <body>
        <small class="pText settingInputCaption">
            This will automatically redirect the page after the page loads. The value here may be overridden by adding the "auto_redirect" request parameter in the URL, and setting it to either "y" (if you want to auto-redirect) or "n" (if you don't).SETTINGS_LINK_GOES_HERE
        </small>
        <p class="pText">It looks like you're trying to go to a page that doesn't exist. Are you wanting the <a href="AUTHORIZE_PATH_GOES_HERE">Authorize</a> page?</p>
        SETTING_INPUTS_GO_HERE
    </body>
</html>`;

const stylesCss = `body {
    font-family: 'Open Sans', sans-serif;
    padding-bottom: 5rem;
}
`;
const normalizeCss = `/**
* 1. Correct the line height in all browsers.
* 2. Prevent adjustments of font size after orientation changes in iOS.
*/

html {
    line-height: 1.15; /* 1 */
    -webkit-text-size-adjust: 100%; /* 2 */
}
`;
const summariesCss = `.summaryEnvVarName {
    font-weight: 700;
}

.summaryEnvVarValue {
    text-wrap: wrap;
    word-wrap: break-word;
    line-height: 1.7;
}`;
const settingInputsHtml = `<br><br>Note that this setting and all the below settings may be changed on the <a href="/settings">settings page</a>.`;
const settingsLinkHtml = `<section class="settingsSection"></section>`;
const authorizePath = '/authorize';

const removeFourSpacesAndNewLines = (str) => {
    return str.replace(/\n/g, '').replace(/ {4}/g, '');
};

describe('src/transforms/htmlTransform', () => {
    test('should replace all placeholders with actual values', () => {
        const callback = jest.fn();

        const transformObj = { output: [] };
        const transform = getTransform(transformObj);

        const expectedOutput = `<!doctype html>
        <html lang="en">
            <head>
                <style>/*** 1. Correct the line height in all browsers.* 2. Prevent adjustments of font size after orientation changes in iOS.*/html {line-height: 1.15; /* 1 */-webkit-text-size-adjust: 100%; /* 2 */}</style>
                <style>body {font-family: 'Open Sans', sans-serif;padding-bottom: 5rem;}</style>
                <style>.summaryEnvVarName {font-weight: 700;}.summaryEnvVarValue {text-wrap: wrap;word-wrap: break-word;line-height: 1.7;}</style>
            </head>
            <body>
                <small class="pText settingInputCaption">
                    This will automatically redirect the page after the page loads. The value here may be overridden by adding the "auto_redirect" request parameter in the URL, and setting it to either "y" (if you want to auto-redirect) or "n" (if you don't).
                    <section class="settingsSection"></section>
                </small>
                <p class="pText">It looks like you're trying to go to a page that doesn't exist. Are you wanting the <a href="/authorize">Authorize</a> page?</p>
                <br><br>Note that this setting and all the below settings may be changed on the <a href="/settings">settings page</a>.
            </body>
        </html>`;

        const htmlTransform = createHtmlTransform(
            transform,
            stylesCss,
            normalizeCss,
            summariesCss,
            settingInputsHtml,
            settingsLinkHtml,
            authorizePath
        );

        htmlTransform(Buffer.from(inputHtml), 'utf8', callback);

        const output = transformObj.output[0];

        expect(removeFourSpacesAndNewLines(output)).toBe(
            removeFourSpacesAndNewLines(expectedOutput)
        );
    });
});
