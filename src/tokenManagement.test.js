import timekeeper from 'timekeeper';

import { getIdToken } from './tokenManagement';

describe('src/tokenManagement.js', () => {
    beforeAll(() => {
        timekeeper.freeze(1735579993504);
    });

    test('should get an ID token', async () => {
        const issuer = 'https://example.com';
        const clientId = 'relying_party';
        const expirationSeconds = 14400;
        const nonce = 'my_nonce';

        const idToken = await getIdToken(
            issuer,
            clientId,
            expirationSeconds,
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

        const idToken = await getIdToken(issuer, clientId, expirationSeconds);

        expect(idToken).toBe(
            'eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3MzU1Nzk5OTMsImlzcyI6Imh0dHBzOi8vZXhhbXBsZS5jb20iLCJhdWQiOiJyZWx5aW5nX3BhcnR5Iiwic3ViIjoidHVzZXIiLCJleHAiOjE3MzU1OTQzOTN9.OLMW1imc0oGlq9Aa5WIZoyoJalXGApMJs-LrSsMvXPY'
        );
    });
});
