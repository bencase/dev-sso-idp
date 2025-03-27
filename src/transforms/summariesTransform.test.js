import { jest } from '@jest/globals';

import { envVarOrder } from '../envVarSummarizer.js';
import {
    HTTP_PORT_ENV_VAR,
    HTTPS_PORT_ENV_VAR,
    USE_HTTP_ENV_VAR,
    USE_HTTPS_ENV_VAR,
    ISSUER_ENV_VAR,
    PERCENT_ENCODED_REDIRECT_URIS_ENV_VAR,
    CLIENT_IDS_WITH_SECRETS_ENV_VAR,
    CLIENT_IDS_ENV_VAR,
    HASH_SECRET_ENV_VAR,
    SALTS_FOR_HASHING_SECRET_ENV_VAR,
    ID_TOKEN_EXPIRATION_SECONDS_ENV_VAR,
    IGNORE_RESPONSE_TYPE_VALIDATION_ENV_VAR,
    IGNORE_CLIENT_ID_VALIDATION_ENV_VAR,
    IGNORE_SCOPE_VALIDATION_ENV_VAR,
    IGNORE_REDIRECT_URI_VALIDATION_ENV_VAR,
    INCLUDE_EXPIRES_IN_IN_TOKEN_RESPONSE_ENV_VAR,
    REDIRECT_URI_OPTIONAL_FOR_TOKEN_ENDPOINT_ENV_VAR,
    CLIENT_ID_OPTIONAL_FOR_TOKEN_ENDPOINT_ENV_VAR,
    LOG_LEVEL_ENV_VAR,
    AUTHORIZE_PAGE_PATH_ENV_VAR,
    SETTINGS_PAGE_PATH_ENV_VAR,
    ENVIRONMENT_PAGE_PATH_ENV_VAR,
    CODE_ENDPOINT_PATH_ENV_VAR,
    TOKEN_ENDPOINT_PATH_ENV_VAR,
    USER_INFO_ENDPOINT_PATH_ENV_VAR,
    HEALTH_CHECK_ENDPOINT_PATH_ENV_VAR,
    HEALTH_CHECK_ENV_ENDPOINT_PATH_ENV_VAR,
    ENABLE_REFRESH_TOKENS_ENV_VAR,
    EXCLUDE_USER_INFO_FROM_ID_TOKEN_ENV_VAR,
    ID_TOKEN_NAME_FIELD_ENV_VAR,
    ID_TOKEN_USERNAME_FIELD_ENV_VAR,
    ID_TOKEN_FIRST_NAME_FIELD_ENV_VAR,
    ID_TOKEN_MIDDLE_NAME_FIELD_ENV_VAR,
    ID_TOKEN_LAST_NAME_FIELD_ENV_VAR,
    ID_TOKEN_EMAIL_FIELD_ENV_VAR,
} from '../constants.js';
import { createSummariesTransform } from './summariesTransform';

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

const pageHtml = `<html>
    <head></head>
    <body>
        <div class="summaryContainer">
            SUMMARIES_GO_HERE
        </div>
    </body>
</html>`;

const summaryHtml = `<div class="summary SUMMARY_TYPE_CLASS_GOES_HERE flexLeftAlignedColumn">
    <div>
        <div class="summaryEnvVarName">ENV_VAR_NAME_GOES_HERE</div>
        <div class="summaryEnvVarValue ml2rem">ENV_VAR_VAL_GOES_HERE</div>
    </div>
    <!--SUMMARY_ISSUES_GO_HERE-->
</div>`;

const summaryErrorHtml = `<div id="requestParamErrorsContainer" class="errorContainer errorContainerColor">
    <div class="errorHeader">
        <svg class="errorIcon errorIconColor"  xmlns="http://www.w3.org/2000/svg"></svg>
        <div class="summaryErrorText">ISSUE_TEXT_GOES_HERE</div>
    </div>
</div>`;

const summaryWarningHtml = `<div id="requestParamErrorsContainer" class="errorContainer warningContainerColor">
    <div class="errorHeader">
        <svg class="errorIcon warningIconColor" xmlns="http://www.w3.org/2000/svg"></svg>
        <div class="summaryErrorText">ISSUE_TEXT_GOES_HERE</div>
    </div>
</div>`;

let providedEnvVarOrder = [...envVarOrder];
providedEnvVarOrder.splice(
    providedEnvVarOrder.indexOf(PERCENT_ENCODED_REDIRECT_URIS_ENV_VAR),
    1
);
providedEnvVarOrder.splice(providedEnvVarOrder.indexOf(CLIENT_IDS_ENV_VAR), 1);
providedEnvVarOrder.splice(
    providedEnvVarOrder.indexOf(ID_TOKEN_EXPIRATION_SECONDS_ENV_VAR),
    1
);
providedEnvVarOrder.splice(
    providedEnvVarOrder.indexOf(IGNORE_RESPONSE_TYPE_VALIDATION_ENV_VAR),
    1
);
providedEnvVarOrder = [
    CLIENT_IDS_ENV_VAR,
    PERCENT_ENCODED_REDIRECT_URIS_ENV_VAR,
    ID_TOKEN_EXPIRATION_SECONDS_ENV_VAR,
    IGNORE_RESPONSE_TYPE_VALIDATION_ENV_VAR,
    ...providedEnvVarOrder,
];

const envVarsSummary = {
    order: providedEnvVarOrder,
    summaries: {
        [USE_HTTP_ENV_VAR]: {
            value: 'true',
        },
        [HTTP_PORT_ENV_VAR]: {
            value: '3000',
        },
        [USE_HTTPS_ENV_VAR]: {
            value: 'true',
        },
        [HTTPS_PORT_ENV_VAR]: {
            value: '3443',
        },
        [ISSUER_ENV_VAR]: {
            value: 'https://example.com',
        },
        [PERCENT_ENCODED_REDIRECT_URIS_ENV_VAR]: {
            errors: [
                {
                    message: `The ${PERCENT_ENCODED_REDIRECT_URIS_ENV_VAR} environment variable contains invalid redirect URIs: [http%3A%2F%2Flocalhost%3A8081]`,
                },
            ],
            value: 'http%3A%2F%2Flocalhost%3A5173,http%3A%2F%2Flocalhost%3A8081',
        },
        [CLIENT_IDS_WITH_SECRETS_ENV_VAR]: {
            value: '',
        },
        [CLIENT_IDS_ENV_VAR]: {
            errors: [
                {
                    message: `No client IDs found. Make sure the ${CLIENT_IDS_ENV_VAR} or ${CLIENT_IDS_WITH_SECRETS_ENV_VAR} environment variable is populated.`,
                },
            ],
            value: undefined,
        },
        [HASH_SECRET_ENV_VAR]: {
            value: 'true',
        },
        [SALTS_FOR_HASHING_SECRET_ENV_VAR]: {
            value: '******************,****************************',
        },
        [ID_TOKEN_EXPIRATION_SECONDS_ENV_VAR]: {
            warnings: [
                {
                    message: `The ${ID_TOKEN_EXPIRATION_SECONDS_ENV_VAR} environment variable contains a value higher than the suggested 14400.`,
                },
            ],
            value: '14401',
        },
        [IGNORE_RESPONSE_TYPE_VALIDATION_ENV_VAR]: {
            warnings: [
                {
                    message: `The ${IGNORE_RESPONSE_TYPE_VALIDATION_ENV_VAR} environment variable is set to 'true'. This is not recommended.`,
                },
            ],
            value: 'true',
        },
        [IGNORE_CLIENT_ID_VALIDATION_ENV_VAR]: {
            value: 'false',
        },
        [IGNORE_SCOPE_VALIDATION_ENV_VAR]: {
            value: 'false',
        },
        [IGNORE_REDIRECT_URI_VALIDATION_ENV_VAR]: {
            value: 'false',
        },
        [INCLUDE_EXPIRES_IN_IN_TOKEN_RESPONSE_ENV_VAR]: {
            value: 'true',
        },
        [REDIRECT_URI_OPTIONAL_FOR_TOKEN_ENDPOINT_ENV_VAR]: {
            value: 'false',
        },
        [CLIENT_ID_OPTIONAL_FOR_TOKEN_ENDPOINT_ENV_VAR]: {
            value: 'false',
        },
        [ENABLE_REFRESH_TOKENS_ENV_VAR]: {
            value: 'true',
        },
        [EXCLUDE_USER_INFO_FROM_ID_TOKEN_ENV_VAR]: {
            value: 'false',
        },
        [ID_TOKEN_NAME_FIELD_ENV_VAR]: {
            value: 'name',
        },
        [ID_TOKEN_USERNAME_FIELD_ENV_VAR]: {
            value: 'preferred_username',
        },
        [ID_TOKEN_FIRST_NAME_FIELD_ENV_VAR]: {
            value: 'given_name',
        },
        [ID_TOKEN_MIDDLE_NAME_FIELD_ENV_VAR]: {
            value: 'middle_name',
        },
        [ID_TOKEN_LAST_NAME_FIELD_ENV_VAR]: {
            value: 'family_name',
        },
        [ID_TOKEN_EMAIL_FIELD_ENV_VAR]: {
            value: 'email',
        },
        [LOG_LEVEL_ENV_VAR]: {
            value: 'info',
        },
        [AUTHORIZE_PAGE_PATH_ENV_VAR]: {
            value: '/authorize',
        },
        [SETTINGS_PAGE_PATH_ENV_VAR]: {
            value: '/settings',
        },
        [ENVIRONMENT_PAGE_PATH_ENV_VAR]: {
            value: '/environment',
        },
        [CODE_ENDPOINT_PATH_ENV_VAR]: {
            value: '/api/v1/code',
        },
        [TOKEN_ENDPOINT_PATH_ENV_VAR]: {
            value: '/api/v1/token',
        },
        [USER_INFO_ENDPOINT_PATH_ENV_VAR]: {
            value: '/api/v1/userInfo',
        },
        [HEALTH_CHECK_ENDPOINT_PATH_ENV_VAR]: {
            value: '/api/v1/health',
        },
        [HEALTH_CHECK_ENV_ENDPOINT_PATH_ENV_VAR]: {
            value: '/api/v1/health/env',
        },
    },
};

const expectedHtml = `<html>
    <head></head>
    <body>
        <div class="summaryContainer">
            <div class="summary summaryError flexLeftAlignedColumn">
                <div>
                    <div class="summaryEnvVarName">DEVSSOIDP_CLIENT_IDS</div>
                    <div class="summaryEnvVarValue ml2rem">undefined</div>
                </div>
                <div id="requestParamErrorsContainer" class="errorContainer errorContainerColor">
                    <div class="errorHeader">
                        <svg class="errorIcon errorIconColor"  xmlns="http://www.w3.org/2000/svg"></svg>
                        <div class="summaryErrorText">No client IDs found. Make sure the DEVSSOIDP_CLIENT_IDS or DEVSSOIDP_CLIENT_IDS_WITH_SECRETS environment variable is populated.</div>
                    </div>
                </div>
            </div>
            <div class="summary summaryError flexLeftAlignedColumn">
                <div>
                    <div class="summaryEnvVarName">DEVSSOIDP_PERCENT_ENCODED_REDIRECT_URIS</div>
                    <div class="summaryEnvVarValue ml2rem">http%3A%2F%2Flocalhost%3A5173,http%3A%2F%2Flocalhost%3A8081</div>
                </div>
                <div id="requestParamErrorsContainer" class="errorContainer errorContainerColor">
                    <div class="errorHeader">
                        <svg class="errorIcon errorIconColor"  xmlns="http://www.w3.org/2000/svg"></svg>
                        <div class="summaryErrorText">The DEVSSOIDP_PERCENT_ENCODED_REDIRECT_URIS environment variable contains invalid redirect URIs: [http%3A%2F%2Flocalhost%3A8081]</div>
                    </div>
                </div>
            </div>
            <div class="summary summaryWarning flexLeftAlignedColumn">
                <div>
                    <div class="summaryEnvVarName">DEVSSOIDP_ID_TOKEN_EXPIRATION_SECONDS</div>
                    <div class="summaryEnvVarValue ml2rem">14401</div>
                </div>
                <div id="requestParamErrorsContainer" class="errorContainer warningContainerColor">
                    <div class="errorHeader">
                        <svg class="errorIcon warningIconColor" xmlns="http://www.w3.org/2000/svg"></svg>
                        <div class="summaryErrorText">The DEVSSOIDP_ID_TOKEN_EXPIRATION_SECONDS environment variable contains a value higher than the suggested 14400.</div>
                    </div>
                </div>
            </div>
            <div class="summary summaryWarning flexLeftAlignedColumn">
                <div>
                    <div class="summaryEnvVarName">DEVSSOIDP_IGNORE_RESPONSE_TYPE_VALIDATION</div>
                    <div class="summaryEnvVarValue ml2rem">true</div>
                </div>
                <div id="requestParamErrorsContainer" class="errorContainer warningContainerColor">
                    <div class="errorHeader">
                        <svg class="errorIcon warningIconColor" xmlns="http://www.w3.org/2000/svg"></svg>
                        <div class="summaryErrorText">The DEVSSOIDP_IGNORE_RESPONSE_TYPE_VALIDATION environment variable is set to 'true'. This is not recommended.</div>
                    </div>
                </div>
            </div>
            <div class="summary summaryNormal flexLeftAlignedColumn">
                <div>
                    <div class="summaryEnvVarName">DEVSSOIDP_USE_HTTP</div>
                    <div class="summaryEnvVarValue ml2rem">true</div>
                </div>
            </div>
            <div class="summary summaryNormal flexLeftAlignedColumn">
                <div>
                    <div class="summaryEnvVarName">DEVSSOIDP_HTTP_PORT</div>
                    <div class="summaryEnvVarValue ml2rem">3000</div>
                </div>
            </div>
            <div class="summary summaryNormal flexLeftAlignedColumn">
                <div>
                    <div class="summaryEnvVarName">DEVSSOIDP_USE_HTTPS</div>
                    <div class="summaryEnvVarValue ml2rem">true</div>
                </div>
            </div>
            <div class="summary summaryNormal flexLeftAlignedColumn">
                <div>
                    <div class="summaryEnvVarName">DEVSSOIDP_HTTPS_PORT</div>
                    <div class="summaryEnvVarValue ml2rem">3443</div>
                </div>
            </div>
            <div class="summary summaryNormal flexLeftAlignedColumn">
                <div>
                    <div class="summaryEnvVarName">DEVSSOIDP_ISSUER</div>
                    <div class="summaryEnvVarValue ml2rem">https://example.com</div>
                </div>
            </div>
            <div class="summary summaryNormal flexLeftAlignedColumn">
                <div>
                    <div class="summaryEnvVarName">DEVSSOIDP_CLIENT_IDS_WITH_SECRETS</div>
                    <div class="summaryEnvVarValue ml2rem"></div>
                </div>
            </div>
            <div class="summary summaryNormal flexLeftAlignedColumn">
                <div>
                    <div class="summaryEnvVarName">DEVSSOIDP_HASH_SECRET</div>
                    <div class="summaryEnvVarValue ml2rem">true</div>
                </div>
            </div>
            <div class="summary summaryNormal flexLeftAlignedColumn">
                <div>
                    <div class="summaryEnvVarName">DEVSSOIDP_SALTS_FOR_HASHING_SECRET</div>
                    <div class="summaryEnvVarValue ml2rem">******************,****************************</div>
                </div>
            </div>
            <div class="summary summaryNormal flexLeftAlignedColumn">
                <div>
                    <div class="summaryEnvVarName">DEVSSOIDP_IGNORE_CLIENT_ID_VALIDATION</div>
                    <div class="summaryEnvVarValue ml2rem">false</div>
                </div>
            </div>
            <div class="summary summaryNormal flexLeftAlignedColumn">
                <div>
                    <div class="summaryEnvVarName">DEVSSOIDP_IGNORE_SCOPE_VALIDATION</div>
                    <div class="summaryEnvVarValue ml2rem">false</div>
                </div>
            </div>
            <div class="summary summaryNormal flexLeftAlignedColumn">
                <div>
                    <div class="summaryEnvVarName">DEVSSOIDP_IGNORE_REDIRECT_URI_VALIDATION</div>
                    <div class="summaryEnvVarValue ml2rem">false</div>
                </div>
            </div>
            <div class="summary summaryNormal flexLeftAlignedColumn">
                <div>
                    <div class="summaryEnvVarName">DEVSSOIDP_INCLUDE_EXPIRES_IN_IN_TOKEN_RESPONSE</div>
                    <div class="summaryEnvVarValue ml2rem">true</div>
                </div>
            </div>
            <div class="summary summaryNormal flexLeftAlignedColumn">
                <div>
                    <div class="summaryEnvVarName">DEVSSOIDP_REDIRECT_URI_OPTIONAL_FOR_TOKEN_ENDPOINT</div>
                    <div class="summaryEnvVarValue ml2rem">false</div>
                </div>
            </div>
            <div class="summary summaryNormal flexLeftAlignedColumn">
                <div>
                    <div class="summaryEnvVarName">DEVSSOIDP_CLIENT_ID_OPTIONAL_FOR_TOKEN_ENDPOINT</div>
                    <div class="summaryEnvVarValue ml2rem">false</div>
                </div>
            </div>
            <div class="summary summaryNormal flexLeftAlignedColumn">
                <div>
                    <div class="summaryEnvVarName">DEVSSOIDP_ENABLE_REFRESH_TOKENS</div>
                    <div class="summaryEnvVarValue ml2rem">true</div>
                </div>
            </div>
            <div class="summary summaryNormal flexLeftAlignedColumn">
                <div>
                    <div class="summaryEnvVarName">DEVSSOIDP_EXCLUDE_USER_INFO_FROM_ID_TOKEN</div>
                    <div class="summaryEnvVarValue ml2rem">false</div>
                </div>
            </div>
            <div class="summary summaryNormal flexLeftAlignedColumn">
                <div>
                    <div class="summaryEnvVarName">DEVSSOIDP_ID_TOKEN_NAME_FIELD</div>
                    <div class="summaryEnvVarValue ml2rem">name</div>
                </div>
            </div>
            <div class="summary summaryNormal flexLeftAlignedColumn">
                <div>
                    <div class="summaryEnvVarName">DEVSSOIDP_ID_TOKEN_USERNAME_FIELD</div>
                    <div class="summaryEnvVarValue ml2rem">preferred_username</div>
                </div>
            </div>
            <div class="summary summaryNormal flexLeftAlignedColumn">
                <div>
                    <div class="summaryEnvVarName">DEVSSOIDP_ID_TOKEN_FIRST_NAME_FIELD</div>
                    <div class="summaryEnvVarValue ml2rem">given_name</div>
                </div>
            </div>
            <div class="summary summaryNormal flexLeftAlignedColumn">
                <div>
                    <div class="summaryEnvVarName">DEVSSOIDP_ID_TOKEN_MIDDLE_NAME_FIELD</div>
                    <div class="summaryEnvVarValue ml2rem">middle_name</div>
                </div>
            </div>
            <div class="summary summaryNormal flexLeftAlignedColumn">
                <div>
                    <div class="summaryEnvVarName">DEVSSOIDP_ID_TOKEN_LAST_NAME_FIELD</div>
                    <div class="summaryEnvVarValue ml2rem">family_name</div>
                </div>
            </div>
            <div class="summary summaryNormal flexLeftAlignedColumn">
                <div>
                    <div class="summaryEnvVarName">DEVSSOIDP_ID_TOKEN_EMAIL_FIELD</div>
                    <div class="summaryEnvVarValue ml2rem">email</div>
                </div>
            </div>
            <div class="summary summaryNormal flexLeftAlignedColumn">
                <div>
                    <div class="summaryEnvVarName">DEVSSOIDP_LOG_LEVEL</div>
                    <div class="summaryEnvVarValue ml2rem">info</div>
                </div>
            </div>
            <div class="summary summaryNormal flexLeftAlignedColumn">
                <div>
                    <div class="summaryEnvVarName">DEVSSOIDP_AUTHORIZE_PAGE_PATH</div>
                    <div class="summaryEnvVarValue ml2rem">/authorize</div>
                </div>
            </div>
            <div class="summary summaryNormal flexLeftAlignedColumn">
                <div>
                    <div class="summaryEnvVarName">DEVSSOIDP_SETTINGS_PAGE_PATH</div>
                    <div class="summaryEnvVarValue ml2rem">/settings</div>
                </div>
            </div>
            <div class="summary summaryNormal flexLeftAlignedColumn">
                <div>
                    <div class="summaryEnvVarName">DEVSSOIDP_ENVIRONMENT_PAGE_PATH</div>
                    <div class="summaryEnvVarValue ml2rem">/environment</div>
                </div>
            </div>
            <div class="summary summaryNormal flexLeftAlignedColumn">
                <div>
                    <div class="summaryEnvVarName">DEVSSOIDP_CODE_ENDPOINT_PATH</div>
                    <div class="summaryEnvVarValue ml2rem">/api/v1/code</div>
                </div>
            </div>
            <div class="summary summaryNormal flexLeftAlignedColumn">
                <div>
                    <div class="summaryEnvVarName">DEVSSOIDP_TOKEN_ENDPOINT_PATH</div>
                    <div class="summaryEnvVarValue ml2rem">/api/v1/token</div>
                </div>
            </div>
            <div class="summary summaryNormal flexLeftAlignedColumn">
                <div>
                    <div class="summaryEnvVarName">DEVSSOIDP_USER_INFO_ENDPOINT_PATH</div>
                    <div class="summaryEnvVarValue ml2rem">/api/v1/userInfo</div>
                </div>
            </div>
            <div class="summary summaryNormal flexLeftAlignedColumn">
                <div>
                    <div class="summaryEnvVarName">DEVSSOIDP_HEALTH_CHECK_ENDPOINT_PATH</div>
                    <div class="summaryEnvVarValue ml2rem">/api/v1/health</div>
                </div>
            </div>
            <div class="summary summaryNormal flexLeftAlignedColumn">
                <div>
                    <div class="summaryEnvVarName">DEVSSOIDP_HEALTH_CHECK_ENV_ENDPOINT_PATH</div>
                    <div class="summaryEnvVarValue ml2rem">/api/v1/health/env</div>
                </div>
            </div>
        </div>
    </body>
</html>`;

const removeFourSpacesAndNewLines = (str) => {
    return str.replace(/\n/g, '').replace(/ {4}/g, '');
};

describe('src/transforms/summariesTransform.js', () => {
    test('should swap html elements having errors and warnings into the provided html document', () => {
        const callback = jest.fn();

        const transformObj = { output: [] };
        const transform = getTransform(transformObj);

        createSummariesTransform(
            transform,
            summaryHtml,
            summaryErrorHtml,
            summaryWarningHtml,
            envVarsSummary
        )(pageHtml, 'utf-8', callback);

        const outputHtml = transformObj.output[0];

        expect(removeFourSpacesAndNewLines(outputHtml)).toBe(
            removeFourSpacesAndNewLines(expectedHtml)
        );

        expect(callback).toHaveBeenCalledTimes(1);
    });
});
