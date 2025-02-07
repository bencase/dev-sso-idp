import { jest } from '@jest/globals';

import { createConfigJsTransform } from './configJsTransform';

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

const inputConfigJs = `window.devSsoIdp = {
    responseError: 'access_denied',
};
window.devSsoIdp.CLIENT_IDS = 'CLIENT_IDS_GO_HERE';
window.devSsoIdp.PERCENT_ENCODED_REDIRECT_URIS =
    'PERCENT_ENCODED_REDIRECT_URIS_GOES_HERE';
window.devSsoIdp.IGNORE_RESPONSE_TYPE_VALIDATION =
    'IGNORE_RESPONSE_TYPE_VALIDATION_GOES_HERE';
window.devSsoIdp.IGNORE_CLIENT_ID_VALIDATION =
    'IGNORE_CLIENT_ID_VALIDATION_GOES_HERE';
window.devSsoIdp.IGNORE_SCOPE_VALIDATION =
    'IGNORE_SCOPE_VALIDATION_GOES_HERE';
window.devSsoIdp.IGNORE_REDIRECT_URI_VALIDATION =
    'IGNORE_REDIRECT_URI_VALIDATION_GOES_HERE';
window.devSsoIdp.envVarServerValidationResult =
    'ENV_VAR_SERVER_VALIDATION_RESULT_GOES_HERE';
`;

const removeFourSpacesAndNewLines = (str) => {
    return str.replace(/\n/g, '').replace(/ {4}/g, '');
};

describe('src/transforms/configJsTransform', () => {
    test('should replace all placeholders with actual values', () => {
        const callback = jest.fn();

        const transformObj = { output: [] };
        const transform = getTransform(transformObj);

        const envVarHolder = {
            percentEncodedRedirectUris:
                'http%3A%2F%2Flocalhost%3A5173,http%3A%2F%2Flocalhost%3A8080',
            ignoreResponseTypeValidation: false,
            ignoreClientIdValidation: false,
            ignoreScopeValidation: false,
            ignoreRedirectUriValidation: false,
        };
        const envVarsValidationResult = {
            errors: [],
            warnings: [],
        };

        const expectedOutput = `window.devSsoIdp = {
            responseError: 'access_denied',
        };
        window.devSsoIdp.CLIENT_IDS = 'relying_party,my_cool_app';
        window.devSsoIdp.PERCENT_ENCODED_REDIRECT_URIS =
            'http%3A%2F%2Flocalhost%3A5173,http%3A%2F%2Flocalhost%3A8080';
        window.devSsoIdp.IGNORE_RESPONSE_TYPE_VALIDATION =
            false;
        window.devSsoIdp.IGNORE_CLIENT_ID_VALIDATION =
            false;
        window.devSsoIdp.IGNORE_SCOPE_VALIDATION =
            false;
        window.devSsoIdp.IGNORE_REDIRECT_URI_VALIDATION =
            false;
        window.devSsoIdp.envVarServerValidationResult =
            {"errors":[],"warnings":[]};
        `;

        createConfigJsTransform(
            transform,
            envVarHolder,
            envVarsValidationResult,
            'relying_party,my_cool_app'
        )(inputConfigJs, 'utf8', callback);

        const output = transformObj.output[0];

        expect(removeFourSpacesAndNewLines(output)).toBe(
            removeFourSpacesAndNewLines(expectedOutput)
        );
    });
});
