import {
    base64ErrorStr,
    getClientIdAndSecretFromHeaderAuthorizationCredentials,
    getSecretForClientId,
    checkCredentials,
} from './credentialManagement';

describe('getClientIdAndSecretFromHeaderAuthorizationCredentials', () => {
    test('should extract clientId and secret from Authorization header credentials', () => {
        const credentials = 'bXlfY2xpZW50X2lkOm15X3NlY3JldA==';
        const result =
            getClientIdAndSecretFromHeaderAuthorizationCredentials(credentials);
        expect(result).toEqual(['my_client_id', 'my_secret']);
    });

    test("should throw an error if credentials can't be parsed as base64", () => {
        expect(() => {
            const invalidCredentials = 'invalid!base64';
            getClientIdAndSecretFromHeaderAuthorizationCredentials(
                invalidCredentials
            );
        }).toThrow(base64ErrorStr);
    });
});

describe('getSecretForClientId', () => {
    test('should return the secret for the given client ID', () => {
        const clientIdsStr = 'client1,client2,client3';
        const clientIdsWithSecretsStr =
            'client1:secret1,client2:secret2,client3:secret3';

        const clientId = 'client2';
        const result = getSecretForClientId(
            clientId,
            clientIdsStr,
            clientIdsWithSecretsStr
        );
        expect(result).toBe('secret2');
    });

    test('should fail upon receiving an invalid client ID', () => {
        const clientIdsStr = 'client1,client2,client3';
        const clientIdsWithSecretsStr =
            'client1:secret1,client2:secret2,client3:secret3';

        const invalidClientId = 'client4';
        expect(() => {
            getSecretForClientId(
                invalidClientId,
                clientIdsStr,
                clientIdsWithSecretsStr
            );
        }).toThrow();
    });
});

describe('checkCredentials', () => {
    it('secret should match, not using hashing', () => {
        const clientId = 'relying_party';
        const providedSecret = 'secret1';
        const expectedSecret = 'secret1';
        const mustHashSecret = false;
        const correlationId = 'abc123';
        const result = checkCredentials(
            clientId,
            providedSecret,
            expectedSecret,
            mustHashSecret,
            undefined,
            correlationId
        );
        expect(result).toBe(true);
    });

    it('secret should match, using hashing', () => {
        const clientId = 'relying_party';
        const providedSecret = 'mysupersecretpw';
        const expectedSecret = 'bnhFJWV2HPIHNiOh+cC796BXAgjbWl8VJAPca4V5K1U=';
        const mustHashSecret = true;
        const salt = 'my-super-cool-salt';
        const correlationId = 'abc123';
        const result = checkCredentials(
            clientId,
            providedSecret,
            expectedSecret,
            mustHashSecret,
            salt,
            correlationId
        );
        expect(result).toBe(true);
    });

    it("secret shouldn't match, not using hash", () => {
        const clientId = 'relying_party';
        const providedSecret = 'secret0';
        const expectedSecret = 'secret1';
        const mustHashSecret = false;
        const correlationId = 'abc123';
        const result = checkCredentials(
            clientId,
            providedSecret,
            expectedSecret,
            mustHashSecret,
            undefined,
            correlationId
        );
        expect(result).toBe(false);
    });

    it("secret shouldn't match, using hash", () => {
        const clientId = 'relying_party';
        const providedSecret = 'mysupersecretpw0';
        const expectedSecret = 'bnhFJWV2HPIHNiOh+cC796BXAgjbWl8VJAPca4V5K1U=';
        const mustHashSecret = true;
        const salt = 'my-super-cool-salt';
        const correlationId = 'abc123';
        const result = checkCredentials(
            clientId,
            providedSecret,
            expectedSecret,
            mustHashSecret,
            salt,
            correlationId
        );
        expect(result).toBe(false);
    });
});
