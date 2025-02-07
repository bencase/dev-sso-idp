import { jest } from '@jest/globals';

import {
    accessDeniedWithLog,
    getListFromCommaDelimitedString,
    getClientIdsAndSecretsFromString,
    getNormalizedClientIdsStr,
    getScopeListFromSpaceDelimitedString,
} from './commonLogic.js';

test('access denied with log', () => {
    const logger = {
        log: jest.fn(),
    };
    const level = 'info';
    const logStr = 'log string';
    const logMetadata = { correlationId: 'abc123' };
    const resStatusJson = jest.fn();
    const res = {
        status: jest.fn(() => {
            return {
                json: resStatusJson,
            };
        }),
    };
    accessDeniedWithLog(logger, level, logStr, logMetadata, res);
    expect(logger.log).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status.mock.calls[0][0]).toBe(403);
    expect(resStatusJson).toHaveBeenCalledTimes(1);
});

test('get list from comma-delimited string', () => {
    const str = 'my-client-id-1,my-client-id-2,my-client-id-3';
    const expectedOutput = [
        'my-client-id-1',
        'my-client-id-2',
        'my-client-id-3',
    ];
    expect(getListFromCommaDelimitedString(str)).toStrictEqual(expectedOutput);
});

test('get single-item list from string having no commas', () => {
    const str = 'my-client-id-1';
    const expectedOutput = ['my-client-id-1'];
    expect(getListFromCommaDelimitedString(str)).toStrictEqual(expectedOutput);
});

const makeClientIdsTestFunc = (clientIdsWithSecretsStr) => () => {
    const clientIdsStr = 'my-client-id-1,my-client-id-2,my-client-id-3';
    const expectedOutput = [
        { clientId: 'my-client-id-1' },
        { clientId: 'my-client-id-2' },
        { clientId: 'my-client-id-3' },
    ];
    expect(
        getClientIdsAndSecretsFromString(clientIdsStr, clientIdsWithSecretsStr)
    ).toStrictEqual(expectedOutput);
};

test(
    'get client IDs from string (clientIdsWithSecretsStr empty)',
    makeClientIdsTestFunc('')
);
test(
    'get client IDs from string (clientIdsWithSecretsStr undefined)',
    makeClientIdsTestFunc(undefined)
);

test('get client IDs and secrets from string', () => {
    const clientIdsStr = 'someOtherClientId1,someOtherClientId2';
    const clientIdsWithSecretStr =
        'my-client-id-1:my-secret-1,my-client-id-2:my-secret-2,my-client-id-3:my-secret-3';
    const expectedOutput = [
        { clientId: 'my-client-id-1', secret: 'my-secret-1' },
        { clientId: 'my-client-id-2', secret: 'my-secret-2' },
        { clientId: 'my-client-id-3', secret: 'my-secret-3' },
    ];
    expect(
        getClientIdsAndSecretsFromString(clientIdsStr, clientIdsWithSecretStr)
    ).toStrictEqual(expectedOutput);
});

const makeNormalizedClientIdsTestFunc = (clientIdsWithSecretsStr) => () => {
    const clientIdsStr = 'my-client-id-1,my-client-id-2,my-client-id-3';
    const expectedOutput = 'my-client-id-1,my-client-id-2,my-client-id-3';
    expect(
        getNormalizedClientIdsStr(clientIdsStr, clientIdsWithSecretsStr)
    ).toBe(expectedOutput);
};

test(
    'get normalized client IDs string (clientIdsWithSecretsStr empty)',
    makeNormalizedClientIdsTestFunc('')
);
test(
    'get normalized client IDs string (clientIdsWithSecretsStr undefined)',
    makeNormalizedClientIdsTestFunc(undefined)
);

test('get normalized client IDs with secrets string', () => {
    const clientIdsStr = 'someOtherClientId1,someOtherClientId2';
    const clientIdsWithSecretsStr =
        'my-client-id-1:my-secret-1,my-client-id-2:my-secret-2,my-client-id-3:my-secret-3';
    const expectedOutput = 'my-client-id-1,my-client-id-2,my-client-id-3';
    expect(
        getNormalizedClientIdsStr(clientIdsStr, clientIdsWithSecretsStr)
    ).toBe(expectedOutput);
});

test('get scope list from space-delimited string', () => {
    const scopeStr = 'openid profile address';
    const expectedOutput = ['openid', 'profile', 'address'];
    expect(getScopeListFromSpaceDelimitedString(scopeStr)).toStrictEqual(
        expectedOutput
    );
});

test('get single scope list from string having no spaces', () => {
    const scopeStr = 'openid';
    const expectedOutput = ['openid'];
    expect(getScopeListFromSpaceDelimitedString(scopeStr)).toStrictEqual(
        expectedOutput
    );
});
