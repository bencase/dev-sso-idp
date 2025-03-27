import timekeeper from 'timekeeper';

import { getIdToken } from './tokenManagement';

const getIdTokenFieldNames = () => {
    return {
        nameField: 'name',
        usernameField: 'preferred_username',
        firstNameField: 'given_name',
        middleNameField: 'middle_name',
        lastNameField: 'family_name',
        emailField: 'email',
    };
};

describe('src/tokenManagement.js', () => {
    beforeAll(() => {
        timekeeper.freeze(1735579993504);
    });

    test('should get an ID token', async () => {
        const issuer = 'https://example.com';
        const clientId = 'relying_party';
        const expirationSeconds = 14400;
        const scopesList = ['openid', 'profile', 'email'];
        const fieldNames = getIdTokenFieldNames();
        const nonce = 'my_nonce';

        const idToken = await getIdToken(
            issuer,
            clientId,
            expirationSeconds,
            scopesList,
            true,
            fieldNames,
            nonce
        );

        expect(idToken).toBe(
            'eyJhbGciOiJIUzI1NiJ9.eyJ1cm46ZHVtbXlzc29pZHA6Y2xhaW0iOnRydWUsIm5vbmNlIjoibXlfbm9uY2UiLCJpYXQiOjE3MzU1Nzk5OTMsImlzcyI6Imh0dHBzOi8vZXhhbXBsZS5jb20iLCJhdWQiOiJyZWx5aW5nX3BhcnR5Iiwic3ViIjoidHVzZXIiLCJleHAiOjE3MzU1OTQzOTN9.-6gZwD4Nb578TZm29NpCUOaDg52zthPguZUTyK9_xh0'
        );
    });

    test('should get an ID token (no nonce)', async () => {
        const issuer = 'https://example.com';
        const clientId = 'relying_party';
        const expirationSeconds = 14400;
        const scopesList = ['openid', 'profile', 'email'];
        const fieldNames = getIdTokenFieldNames();

        const idToken = await getIdToken(
            issuer,
            clientId,
            expirationSeconds,
            scopesList,
            true,
            fieldNames
        );

        expect(idToken).toBe(
            'eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3MzU1Nzk5OTMsImlzcyI6Imh0dHBzOi8vZXhhbXBsZS5jb20iLCJhdWQiOiJyZWx5aW5nX3BhcnR5Iiwic3ViIjoidHVzZXIiLCJleHAiOjE3MzU1OTQzOTN9.OLMW1imc0oGlq9Aa5WIZoyoJalXGApMJs-LrSsMvXPY'
        );
    });

    test('should get an ID token with user info', async () => {
        const issuer = 'https://example.com';
        const clientId = 'relying_party';
        const expirationSeconds = 14400;
        const scopesList = ['openid', 'profile', 'email'];
        const fieldNames = getIdTokenFieldNames();
        const excludeUserInfoFromIdToken = false;
        const nonce = 'my_nonce';

        const idToken = await getIdToken(
            issuer,
            clientId,
            expirationSeconds,
            scopesList,
            excludeUserInfoFromIdToken,
            fieldNames,
            nonce
        );

        expect(idToken).toBe(
            'eyJhbGciOiJIUzI1NiJ9.eyJ1cm46ZHVtbXlzc29pZHA6Y2xhaW0iOnRydWUsIm5vbmNlIjoibXlfbm9uY2UiLCJuYW1lIjoiVGVzdCBVc2VyIiwicHJlZmVycmVkX3VzZXJuYW1lIjoidHVzZXIiLCJnaXZlbl9uYW1lIjoiVGVzdCIsIm1pZGRsZV9uYW1lIjoiRW0iLCJmYW1pbHlfbmFtZSI6IlVzZXIiLCJlbWFpbCI6InR1c2VyQGV4YW1wbGUuY29tIiwiaWF0IjoxNzM1NTc5OTkzLCJpc3MiOiJodHRwczovL2V4YW1wbGUuY29tIiwiYXVkIjoicmVseWluZ19wYXJ0eSIsInN1YiI6InR1c2VyIiwiZXhwIjoxNzM1NTk0MzkzfQ.71xrNFxQtqrRDZH1TyNornSqQHIoKCJ96x_bm0Mrl84'
        );
    });

    test('should get an ID token with user info (but no email)', async () => {
        const issuer = 'https://example.com';
        const clientId = 'relying_party';
        const expirationSeconds = 14400;
        const scopesList = ['openid', 'profile'];
        const fieldNames = getIdTokenFieldNames();
        const excludeUserInfoFromIdToken = false;
        const nonce = 'my_nonce';

        const idToken = await getIdToken(
            issuer,
            clientId,
            expirationSeconds,
            scopesList,
            excludeUserInfoFromIdToken,
            fieldNames,
            nonce
        );

        expect(idToken).toBe(
            'eyJhbGciOiJIUzI1NiJ9.eyJ1cm46ZHVtbXlzc29pZHA6Y2xhaW0iOnRydWUsIm5vbmNlIjoibXlfbm9uY2UiLCJuYW1lIjoiVGVzdCBVc2VyIiwicHJlZmVycmVkX3VzZXJuYW1lIjoidHVzZXIiLCJnaXZlbl9uYW1lIjoiVGVzdCIsIm1pZGRsZV9uYW1lIjoiRW0iLCJmYW1pbHlfbmFtZSI6IlVzZXIiLCJpYXQiOjE3MzU1Nzk5OTMsImlzcyI6Imh0dHBzOi8vZXhhbXBsZS5jb20iLCJhdWQiOiJyZWx5aW5nX3BhcnR5Iiwic3ViIjoidHVzZXIiLCJleHAiOjE3MzU1OTQzOTN9.EsYVOeAcR7EXqvbOP6k6074IzBP6hvWK_mmx_3dRgLI'
        );
    });

    test('should get an ID token with user info (no nonce)', async () => {
        const issuer = 'https://example.com';
        const clientId = 'relying_party';
        const expirationSeconds = 14400;
        const scopesList = ['openid', 'profile', 'email'];
        const fieldNames = getIdTokenFieldNames();
        const excludeUserInfoFromIdToken = false;

        const idToken = await getIdToken(
            issuer,
            clientId,
            expirationSeconds,
            scopesList,
            excludeUserInfoFromIdToken,
            fieldNames
        );

        expect(idToken).toBe(
            'eyJhbGciOiJIUzI1NiJ9.eyJ1cm46ZHVtbXlzc29pZHA6Y2xhaW0iOnRydWUsIm5hbWUiOiJUZXN0IFVzZXIiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJ0dXNlciIsImdpdmVuX25hbWUiOiJUZXN0IiwibWlkZGxlX25hbWUiOiJFbSIsImZhbWlseV9uYW1lIjoiVXNlciIsImVtYWlsIjoidHVzZXJAZXhhbXBsZS5jb20iLCJpYXQiOjE3MzU1Nzk5OTMsImlzcyI6Imh0dHBzOi8vZXhhbXBsZS5jb20iLCJhdWQiOiJyZWx5aW5nX3BhcnR5Iiwic3ViIjoidHVzZXIiLCJleHAiOjE3MzU1OTQzOTN9.3J1Kr3fn1X5isNnLER0Ape6K8WZK04el1B9K9fsfxiE'
        );
    });
});
