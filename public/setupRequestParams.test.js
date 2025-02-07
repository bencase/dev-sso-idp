/**
 * @jest-environment jsdom
 */

const resetRequestParamData = () => {
    window.devSsoIdp.requestParams = {
        responseType: '',
        clientId: '',
        scope: [],
        redirectUri: '',
        state: '',
        nonce: '',
        autoRedirect: '',
        loadingDelay: -1,
    };

    window.devSsoIdp.requestParamValidity = {
        responseType: {
            present: false,
            isValid: false,
            message: 'response_type not validated',
        },
        clientId: {
            present: false,
            isValid: false,
            message: 'client_id not validated',
            validList: [],
        },
        scope: {
            present: false,
            isValid: false,
            message: 'scope not validated',
        },
        redirectUri: {
            present: false,
            isValid: false,
            message: 'redirect_uri not validated',
            validList: [],
        },
    };
};

describe('public/setupRequestParams.js', () => {
    beforeAll(async () => {
        window.devSsoIdp = {};
        await import('./setupRequestParams.js');
    });

    afterEach(() => {
        window.devSsoIdp.IGNORE_RESPONSE_TYPE_VALIDATION = false;
        window.devSsoIdp.IGNORE_CLIENT_ID_VALIDATION = false;
        window.devSsoIdp.IGNORE_SCOPE_VALIDATION = false;
        window.devSsoIdp.IGNORE_REDIRECT_URI_VALIDATION = false;
        resetRequestParamData();
    });

    test('should read and validate request parameters (all valid)', () => {
        window.location.assign(
            '/authorize?response_type=code&client_id=relying_party&scope=openid%20profile%20address%20phone&redirect_uri=http%3A%2F%2Flocalhost%3A5173&state=my_state&nonce=my_nonce%5E&auto_redirect=y&loading_delay=1500'
        );
        window.devSsoIdp.CLIENT_IDS_ARRAY = ['my_cool_app', 'relying_party'];
        window.devSsoIdp.REDIRECT_URIS_ARRAY = [
            'http://localhost:5173',
            'http://localhost:8080',
        ];

        window.devSsoIdp.initializeRequestParams();

        expect(window.devSsoIdp.requestParams.responseType).toBe('code');
        expect(window.devSsoIdp.requestParams.clientId).toBe('relying_party');
        expect(window.devSsoIdp.requestParams.scope).toEqual([
            'openid',
            'profile',
            'address',
            'phone',
        ]);
        expect(window.devSsoIdp.requestParams.redirectUri).toBe(
            'http://localhost:5173'
        );
        expect(window.devSsoIdp.requestParams.state).toBe('my_state');
        expect(window.devSsoIdp.requestParams.nonce).toBe('my_nonce^');
        expect(window.devSsoIdp.requestParams.autoRedirect).toBe('y');
        expect(window.devSsoIdp.requestParams.loadingDelay).toBe(1500);

        expect(window.devSsoIdp.requestParamValidity.responseType).toEqual({
            present: true,
            isValid: true,
            message: '',
        });
        expect(window.devSsoIdp.requestParamValidity.clientId).toEqual({
            present: true,
            isValid: true,
            message: '',
            validList: ['my_cool_app', 'relying_party'],
        });
        expect(window.devSsoIdp.requestParamValidity.scope).toEqual({
            present: true,
            isValid: true,
            message: '',
        });
        expect(window.devSsoIdp.requestParamValidity.redirectUri).toEqual({
            present: true,
            isValid: true,
            message: '',
            validList: ['http://localhost:5173', 'http://localhost:8080'],
        });
    });

    test('should read and validate request parameters (missing required parameters)', () => {
        window.location.assign('/authorize?state=my_state&nonce=my_nonce%5E');
        window.devSsoIdp.CLIENT_IDS_ARRAY = ['my_cool_app', 'relying_party'];
        window.devSsoIdp.REDIRECT_URIS_ARRAY = [
            'http://localhost:5173',
            'http://localhost:8080',
        ];

        window.devSsoIdp.initializeRequestParams();

        expect(window.devSsoIdp.requestParams.responseType).toBeFalsy();
        expect(window.devSsoIdp.requestParams.clientId).toBeFalsy();
        expect(window.devSsoIdp.requestParams.scope).toEqual([]);
        expect(window.devSsoIdp.requestParams.redirectUri).toBeFalsy();
        expect(window.devSsoIdp.requestParams.state).toBe('my_state');
        expect(window.devSsoIdp.requestParams.nonce).toBe('my_nonce^');
        expect(window.devSsoIdp.requestParams.autoRedirect).toBeFalsy();
        expect(window.devSsoIdp.requestParams.loadingDelay).toBe(-1);

        expect(window.devSsoIdp.requestParamValidity.responseType).toEqual({
            present: false,
            isValid: false,
            message: `Request URL must contain a 'response_type' parameter having the value 'code'. For example: ?response_type=code`,
        });
        expect(window.devSsoIdp.requestParamValidity.clientId).toEqual({
            present: false,
            isValid: false,
            message: `A valid client ID must be specified in the 'client_id' parameter. Valid client IDs according to the 'DEVSSOIDP_CLIENT_IDS' or 'DEVSSOIDP_CLIENT_IDS_WITH_SECRETS' environment variables are:`,
            validList: ['my_cool_app', 'relying_party'],
        });
        expect(window.devSsoIdp.requestParamValidity.scope).toEqual({
            present: false,
            isValid: false,
            message: `The 'scope' parameter must provide a list of valid scopes delimited from each other by a space. One of these scope values must be 'openid'.`,
        });
        expect(window.devSsoIdp.requestParamValidity.redirectUri).toEqual({
            present: false,
            isValid: false,
            message: `A valid redirect URI must be in the 'redirect_uri' parameter. It must exactly match (including encoding) one of the entries in the 'DEVSSOIDP_PERCENT_ENCODED_REDIRECT_URIS' environment variable:`,
            validList: ['http://localhost:5173', 'http://localhost:8080'],
        });
    });

    test('should read and validate request parameters (invalid response type)', () => {
        window.location.assign(
            '/authorize?response_type=token&client_id=relying_party&scope=openid%20profile%20address%20phone&redirect_uri=http%3A%2F%2Flocalhost%3A5173&state=my_state&nonce=my_nonce%5E&auto_redirect=y&loading_delay=1500'
        );
        window.devSsoIdp.CLIENT_IDS_ARRAY = ['my_cool_app', 'relying_party'];
        window.devSsoIdp.REDIRECT_URIS_ARRAY = [
            'http://localhost:5173',
            'http://localhost:8080',
        ];

        window.devSsoIdp.initializeRequestParams();

        expect(window.devSsoIdp.requestParams.responseType).toBe('token');
        expect(window.devSsoIdp.requestParams.clientId).toBe('relying_party');
        expect(window.devSsoIdp.requestParams.scope).toEqual([
            'openid',
            'profile',
            'address',
            'phone',
        ]);
        expect(window.devSsoIdp.requestParams.redirectUri).toBe(
            'http://localhost:5173'
        );
        expect(window.devSsoIdp.requestParams.state).toBe('my_state');
        expect(window.devSsoIdp.requestParams.nonce).toBe('my_nonce^');
        expect(window.devSsoIdp.requestParams.autoRedirect).toBe('y');
        expect(window.devSsoIdp.requestParams.loadingDelay).toBe(1500);

        expect(window.devSsoIdp.requestParamValidity.responseType).toEqual({
            present: true,
            isValid: false,
            message: `response_type parameter must have the value 'code'.`,
        });
        expect(window.devSsoIdp.requestParamValidity.clientId).toEqual({
            present: true,
            isValid: true,
            message: '',
            validList: ['my_cool_app', 'relying_party'],
        });
        expect(window.devSsoIdp.requestParamValidity.scope).toEqual({
            present: true,
            isValid: true,
            message: '',
        });
        expect(window.devSsoIdp.requestParamValidity.redirectUri).toEqual({
            present: true,
            isValid: true,
            message: '',
            validList: ['http://localhost:5173', 'http://localhost:8080'],
        });
    });

    test('should read and validate request parameters (invalid client ID)', () => {
        window.location.assign(
            '/authorize?response_type=code&client_id=not_relying_party&scope=openid%20profile%20address%20phone&redirect_uri=http%3A%2F%2Flocalhost%3A5173&state=my_state&nonce=my_nonce%5E&auto_redirect=y&loading_delay=1500'
        );
        window.devSsoIdp.CLIENT_IDS_ARRAY = ['my_cool_app', 'relying_party'];
        window.devSsoIdp.REDIRECT_URIS_ARRAY = [
            'http://localhost:5173',
            'http://localhost:8080',
        ];

        window.devSsoIdp.initializeRequestParams();

        expect(window.devSsoIdp.requestParams.responseType).toBe('code');
        expect(window.devSsoIdp.requestParams.clientId).toBe(
            'not_relying_party'
        );
        expect(window.devSsoIdp.requestParams.scope).toEqual([
            'openid',
            'profile',
            'address',
            'phone',
        ]);
        expect(window.devSsoIdp.requestParams.redirectUri).toBe(
            'http://localhost:5173'
        );
        expect(window.devSsoIdp.requestParams.state).toBe('my_state');
        expect(window.devSsoIdp.requestParams.nonce).toBe('my_nonce^');
        expect(window.devSsoIdp.requestParams.autoRedirect).toBe('y');
        expect(window.devSsoIdp.requestParams.loadingDelay).toBe(1500);

        expect(window.devSsoIdp.requestParamValidity.responseType).toEqual({
            present: true,
            isValid: true,
            message: '',
        });
        expect(window.devSsoIdp.requestParamValidity.clientId).toEqual({
            present: true,
            isValid: false,
            message: `Client ID 'not_relying_party' is not in acceptable client IDs (according to the 'DEVSSOIDP_CLIENT_IDS' or 'DEVSSOIDP_CLIENT_IDS_WITH_SECRETS' environment variables):`,
            validList: ['my_cool_app', 'relying_party'],
        });
        expect(window.devSsoIdp.requestParamValidity.scope).toEqual({
            present: true,
            isValid: true,
            message: '',
        });
        expect(window.devSsoIdp.requestParamValidity.redirectUri).toEqual({
            present: true,
            isValid: true,
            message: '',
            validList: ['http://localhost:5173', 'http://localhost:8080'],
        });
    });

    test('should read and validate request parameters (invalid scope)', () => {
        window.location.assign(
            '/authorize?response_type=code&client_id=relying_party&scope=profile%20address%20phone&redirect_uri=http%3A%2F%2Flocalhost%3A5173&state=my_state&nonce=my_nonce%5E&auto_redirect=y&loading_delay=1500'
        );
        window.devSsoIdp.CLIENT_IDS_ARRAY = ['my_cool_app', 'relying_party'];
        window.devSsoIdp.REDIRECT_URIS_ARRAY = [
            'http://localhost:5173',
            'http://localhost:8080',
        ];

        window.devSsoIdp.initializeRequestParams();

        expect(window.devSsoIdp.requestParams.responseType).toBe('code');
        expect(window.devSsoIdp.requestParams.clientId).toBe('relying_party');
        expect(window.devSsoIdp.requestParams.scope).toEqual([
            'profile',
            'address',
            'phone',
        ]);
        expect(window.devSsoIdp.requestParams.redirectUri).toBe(
            'http://localhost:5173'
        );
        expect(window.devSsoIdp.requestParams.state).toBe('my_state');
        expect(window.devSsoIdp.requestParams.nonce).toBe('my_nonce^');
        expect(window.devSsoIdp.requestParams.autoRedirect).toBe('y');
        expect(window.devSsoIdp.requestParams.loadingDelay).toBe(1500);

        expect(window.devSsoIdp.requestParamValidity.responseType).toEqual({
            present: true,
            isValid: true,
            message: '',
        });
        expect(window.devSsoIdp.requestParamValidity.clientId).toEqual({
            present: true,
            isValid: true,
            message: '',
            validList: ['my_cool_app', 'relying_party'],
        });
        expect(window.devSsoIdp.requestParamValidity.scope).toEqual({
            present: true,
            isValid: false,
            message: `The 'scope' parameter must include the 'openid' scope.`,
        });
        expect(window.devSsoIdp.requestParamValidity.redirectUri).toEqual({
            present: true,
            isValid: true,
            message: '',
            validList: ['http://localhost:5173', 'http://localhost:8080'],
        });
    });

    test('should read and validate request parameters (invalid redirect URI)', () => {
        window.location.assign(
            '/authorize?response_type=code&client_id=relying_party&scope=openid%20profile%20address%20phone&redirect_uri=http%3A%2F%2Flocalhost%3A8081&state=my_state&nonce=my_nonce%5E&auto_redirect=y&loading_delay=1500'
        );
        window.devSsoIdp.CLIENT_IDS_ARRAY = ['my_cool_app', 'relying_party'];
        window.devSsoIdp.REDIRECT_URIS_ARRAY = [
            'http://localhost:5173',
            'http://localhost:8080',
        ];

        window.devSsoIdp.initializeRequestParams();

        expect(window.devSsoIdp.requestParams.responseType).toBe('code');
        expect(window.devSsoIdp.requestParams.clientId).toBe('relying_party');
        expect(window.devSsoIdp.requestParams.scope).toEqual([
            'openid',
            'profile',
            'address',
            'phone',
        ]);
        expect(window.devSsoIdp.requestParams.redirectUri).toBe(
            'http://localhost:8081'
        );
        expect(window.devSsoIdp.requestParams.state).toBe('my_state');
        expect(window.devSsoIdp.requestParams.nonce).toBe('my_nonce^');
        expect(window.devSsoIdp.requestParams.autoRedirect).toBe('y');
        expect(window.devSsoIdp.requestParams.loadingDelay).toBe(1500);

        expect(window.devSsoIdp.requestParamValidity.responseType).toEqual({
            present: true,
            isValid: true,
            message: '',
        });
        expect(window.devSsoIdp.requestParamValidity.clientId).toEqual({
            present: true,
            isValid: true,
            message: '',
            validList: ['my_cool_app', 'relying_party'],
        });
        expect(window.devSsoIdp.requestParamValidity.scope).toEqual({
            present: true,
            isValid: true,
            message: '',
        });
        expect(window.devSsoIdp.requestParamValidity.redirectUri).toEqual({
            present: true,
            isValid: false,
            message: `The redirect URI "http://localhost:8081" is not in one of the acceptable redirect URIs (according to the 'DEVSSOIDP_PERCENT_ENCODED_REDIRECT_URIS' environment variable):`,
            validList: ['http://localhost:5173', 'http://localhost:8080'],
        });
    });

    test('should read and validate request parameters (invalid response type, client ID, scope, and redirect URI, but these validations set to always pass)', () => {
        window.location.assign(
            '/authorize?response_type=token&client_id=not_relying_party&scope=profile%20address%20phone&redirect_uri=http%3A%2F%2Flocalhost%3A8081&state=my_state&nonce=my_nonce%5E&auto_redirect=y&loading_delay=1500'
        );
        window.devSsoIdp.CLIENT_IDS_ARRAY = ['my_cool_app', 'relying_party'];
        window.devSsoIdp.REDIRECT_URIS_ARRAY = [
            'http://localhost:5173',
            'http://localhost:8080',
        ];

        window.devSsoIdp.IGNORE_RESPONSE_TYPE_VALIDATION = true;
        window.devSsoIdp.IGNORE_CLIENT_ID_VALIDATION = true;
        window.devSsoIdp.IGNORE_SCOPE_VALIDATION = true;
        window.devSsoIdp.IGNORE_REDIRECT_URI_VALIDATION = true;

        window.devSsoIdp.initializeRequestParams();

        expect(window.devSsoIdp.requestParams.responseType).toBe('token');
        expect(window.devSsoIdp.requestParams.clientId).toBe(
            'not_relying_party'
        );
        expect(window.devSsoIdp.requestParams.scope).toEqual([
            'profile',
            'address',
            'phone',
        ]);
        expect(window.devSsoIdp.requestParams.redirectUri).toBe(
            'http://localhost:8081'
        );
        expect(window.devSsoIdp.requestParams.state).toBe('my_state');
        expect(window.devSsoIdp.requestParams.nonce).toBe('my_nonce^');
        expect(window.devSsoIdp.requestParams.autoRedirect).toBe('y');
        expect(window.devSsoIdp.requestParams.loadingDelay).toBe(1500);

        expect(window.devSsoIdp.requestParamValidity.responseType).toEqual({
            present: true,
            isValid: true,
            message: '',
        });
        expect(window.devSsoIdp.requestParamValidity.clientId).toEqual({
            present: true,
            isValid: true,
            message: '',
            validList: ['my_cool_app', 'relying_party'],
        });
        expect(window.devSsoIdp.requestParamValidity.scope).toEqual({
            present: true,
            isValid: true,
            message: '',
        });
        expect(window.devSsoIdp.requestParamValidity.redirectUri).toEqual({
            present: true,
            isValid: true,
            message: '',
            validList: ['http://localhost:5173', 'http://localhost:8080'],
        });
    });
});
