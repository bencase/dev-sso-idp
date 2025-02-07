# Dev SSO IdP

<div align="center">
    <span>
        <a href="#quick-start-guide">Quick start guide</a>
        <span> - </span>
        <a href="#environment-variable-reference">Environment variable reference</a>
    </span>
    <img src="https://github.com/user-attachments/assets/462bdfa2-2ebe-460c-9b13-bd8d26e2cd2e" alt="A screencap of the Dev SSO IdP authorization page." width="768">
</div>

Dev SSO IdP is a mock single sign-on (SSO) server you can use to ensure your application's compatibility with your production SSO, without actually needing to use your production SSO during development.

Perhaps you only have SSO in your production environment and not your development environment. It'd still be useful to have something that stands in for SSO in dev, so that this environment is as similar as possible to prod and doesn't require extra configurations.

That's where Dev SSO IdP steps in. This project fills in the gap by mocking all the interfaces that would normally be exposed by an SSO server. It ensures the requests it receives are valid according to the Open ID Connect specification, and so using it will alert you to anything it believes to be in error, well before your app goes to production.

## Is Dev SSO IdP compatible with your SSO system?

Dev SSO IdP follows the Open ID Connect (OIDC) specification, which is a very common but not universal standard for web authentication. Your SSO system likely follows OIDC if it does the following:

1. Your app needs to redirect to a third party when a user needs to log in.
2. The user authenticates on the third party, which redirects back to your app with a code.
3. Your app exchanges this code for a token via an API endpoint on the third party.

Dev SSO IdP fills in for the "third party" in your local and development environments.

<img src="https://github.com/user-attachments/assets/02d19373-1641-4b97-b888-6f4035079bf4" alt="A visual breakdown of the steps of Dev SSO IdP's basic flow, the details of which are explained more in the remainder of this quick start guide.">

## Quick start guide

There are two ways to run Dev SSO IdP: with its Docker image (which is the simplest if you're able to run Docker), or cloning this project and running it with Node.

### Option 1: Using the Docker image

For this you'll be using `docker run` with the image `bmcase/devssoidp:1.0.0`. But first you'll need to specify a couple environment variables, and it's recommended that you create a file in which your Dev SSO IdP environment variables will go.

The name of your file doesn't matter when running with Docker. You can call it `env.txt`. There's also a common convention by which this file is called `.env`, which is fine to use, but files with names beginning in dots will usually be hidden unless [set to be visible](https://benswords.com/how-to-make-dotfiles-visible/). Whatever name for it you choose, create this file and then continue with "Configuring environment variables".

### Option 2: Cloning and running this project

This option will assume you have Node. You'll also either need to have git installed, or to download this project from github. If you have git, run:

```
git clone https://github.com/bencase/dev-sso-idp.git
```

Once you have the project code, there are a couple environment variables you will need to configure. Create a file called `.production.env` and proceed to the next section, which discusses these variables in more detail.

### Configuring environment variables

Dev SSO IdP is configured entirely through environment variables. Almost all of them have useful defaults, but there are at least two you will need to define:

-   **`DEVSSOIDP_PERCENT_ENCODED_REDIRECT_URIS`:** This is the URL or URLs of applications that will redirect to Dev SSO IdP for authentication.

    -   For example, if you're running your application locally on port 5173, the host to use would be `http://localhost:5173`. This environment variable's value must be percent-encoded, for which you may use [an online tool](https://www.url-encode-decode.com/). The encoded value in this example would be `http%3A%2F%2Flocalhost%3A5173`.

-   **Either `DEVSSOIDP_CLIENT_IDS` or `DEVSSOIDP_CLIENT_IDS_WITH_SECRETS`:** Use the first of these if all you want to specify is client IDs. Use the second to define client ID/secret pairs for if you want your app to use basic auth when getting tokens. For more info on this topic, see the below section, "Client authentication with the token endpoint".
    -   A client ID is a string of text that the IdP uses to identify your application. It can be any arbitrary text of your choosing so long as it doesn't contain any commas (",") or colons (":"), which these fields use as delimiters.
    -   `DEVSSOIDP_CLIENT_IDS` contains one or more client IDs, separated by commas.
    -   `DEVSSOIDP_CLIENT_IDS_WITH_SECRETS` contains one or more pairings of client IDs and secrets. The pairs are separated by commas, and then within each pair the client ID and secret are separated by a colon.

The above describes the minimum amount of environment variables needed. Further environment variables are described in the "Environment variable reference" section below.

In the file you created for your environment variables, add them, one variable per line, in the format `<ENV_VAR_NAME>=<VALUE>`. For example:

```
DEVSSOIDP_PERCENT_ENCODED_REDIRECT_URIS=http%3A%2F%2Flocalhost%3A5173,http%3A%2F%2Flocalhost%3A8080
DEVSSOIDP_CLIENT_IDS=my_cool_app,my_other_cool_app
```

Once you've specified your environment variables, you'll be ready to start the Dev SSO IdP server.

### Starting Dev SSO IdP

To start Dev SSO IdP:

-   **If using Docker:** Run `docker run -p 3000:3000 -p 3443:3443 --rm --env-file <path/to/your/env/file> bmcase/devssoidp:1.0.0`, swapping in the path to the file in which you defined your environment variables.
-   **If cloning this project:** Run `npm install` and then `npm start`.

### The redirect to Dev SSO IdP's `/authorize` page

In the part of your application's code that handles SSO, you'll need to make changes to ensure the URL it directs users to is correct.

<img src="https://github.com/user-attachments/assets/25a58eb4-71d0-40f5-9c00-fbfd1fc4a24b" alt="An example /authorize URL, and breakdown of its request parameters.">

The URL should follow this pattern (line wraps for display purposes only):

```
<http-or-https>://<dev-sso-idp-host-and-port>/authorize
    ?response_type=code
    &scope=openid%20profile
    &client_id=<your-client-id>
    &redirect_uri=<redirect-uri-you-used-in-env-variable>
```

Swap the angle-bracketed values as per your configured environment variables. If you're using the defaults, Dev SSO IdP will be available at `http://localhost:3000`. You can find more info about these and other optional request parameters in the "`/authorize` request parameters" section.

Once you know what URL you want to use, test it by pasting it in a browser's address bar. Dev SSO IdP will show errors if there are any environment variables or request parameters it knows to be incorrect. Otherwise, you'll see buttons you can click to simulate authentication. On clicking them Dev SSO IdP will redirect to your application.

### Getting ID and access tokens

When successfully redirecting back to your application, Dev SSO IdP will add a code (in the form of a string of text) as a request parameter. The next step is to exchange this code for ID and access tokens.

-   **ID token:** proves authentication was successful
-   **Access token:** used by your application to get user info

The frontend of your application should pass the code to your app's backend, which should then call Dev SSO IdP's token endpoint. This is a REST POST request. It can have two forms depending on whether or not you configured Dev SSO IdP with client ID/secret pairs. The structure of each are shown by the below cURL commands:

**Client ID alone:**

```
curl --request POST \
  --url <http-or-https>://<dev-sso-idp-host-and-port>/api/v1/token \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data 'redirect_uri=<redirect-uri-used-in-authorize-url>&grant_type=authorization_code&client_id=<client-id>&code=<code>'
```

Request body from the above, formatted for readability with line wraps:

```
redirect_uri=<redirect-uri-used-in-authorize-url>
    &grant_type=authorization_code
    &client_id=<client-id>
    &code=<code>
```

**Client ID with secret:**

```
curl --request POST \
  --url <http-or-https>://<dev-sso-idp-host-and-port>/api/v1/token \
  --header 'Authorization: Basic <base-64-encoded-credentials>' \
  --header 'content-type: application/x-www-form-urlencoded' \
  --data 'redirect_uri=<redirect-uri-used-in-authorize-url>&grant_type=authorization_code&code=<code>'
```

Request body from the above, formatted for readability with line wraps:

```
redirect_uri=<redirect-uri-used-in-authorize-url>
    &grant_type=authorization_code
    &code=<code>
```

(You can import cURL commands as new requests in [Postman](https://learning.postman.com/docs/getting-started/importing-and-exporting/importing-curl-commands/) and [Bruno](https://docs.usebruno.com/get-started/bruno-basics/create-a-request).)

The request body will need to be percent-encoded (which your client library might do for you automatically).

A successful response will include the access token, the ID token, and some other fields. Below is an example. The values in your response may be different:

```JSON
{
    "access_token": "H2LkTDZvIImckQQrAkOSeF8z0366OQQk4gHnNsUwNEg2In89viMnAy00YZ7SaZnEVxnTc=",
    "token_type": "Bearer",
    "expires_in": 14400,
    "refresh_token": "PFTxHHlZEi8ZiorEnI/Q+GPe035n4+B4979dAGucf3GC/I3efSk/W/T/z+cjo82GY6Znw=",
    "id_token": "eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3MzgyNjY3MDIsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6MzAwMCIsImF1ZCI6InJlbHlpbmdfcGFydHkiLCJzdWIiOiJ0dXNlciIsImV4cCI6MTczODI4MTEwMn0.n1424ax1Jpjxw-kIqPXVUWNz1pVywaIlCXMMoh18rkc"
}
```

### Using the access token to request user info

Once your backend has the access token, it can use it to learn more about the user via the `/userInfo` endpoint. Do this by sending a GET request in the following format:

```
curl --request GET \
  --url http://localhost:3000/api/v1/userInfo \
  --header 'Authorization: Bearer <access-token>'
```

(Note that this request's Authorization header must use the word "Bearer" instead of "Basic".)

The endpoint will return a JSON having attributes describing the user. Which attributes you see will depend on the scopes you used when navigating to `/authorize`. The scopes Dev SSO IdP recognizes are:

-   `openid` (Required)
-   `profile`
-   `email`
-   `address`
-   `phone`

## Setting Dev SSO IdP to automatically redirect

Clicking the button to redirect every time is unnecessary, especially if you always want Dev SSO IdP to do the same thing. To have it redirect automatically:

1. Go to Dev SSO IdP's `/settings` or `/authorize` page.
2. If in the `/authorize` page, click on "Advanced Settings", below the red and blue buttons.
3. Click the checkbox next to "Auto-redirect after load".

Changes made to this or other settings in-browser are scoped only to that browser. So, when you set it to auto-redirect (or to not auto-redirect), you don't have to worry about this affecting other users.

If you've set Dev SSO IdP to auto-redirect and want to turn off this behavior or change more settings, you can do so by going to its settings page. This will be at the `/settings` path, which by default would be [http://localhost:3000/settings](http://localhost:3000/settings).

You can also control this behavior through a request parameter in the URL. `auto_redirect=y` will have it auto-redirect, while `auto_redirect=n` will disable the redirect regardless of setting.

## `/authorize` request parameters

The `/authorize` page accepts the following request parameters:

-   **`response_type`:** **(Required)** Must be `code`.
-   **`scope`:** **(Required)** A string with keywords separated by spaces. When percent-encoded, these spaces become `%20`. For example, a percent-encoded value for this parameter may be `openid%20profile%20email`. Recognized values are:
    -   `openid` (Required)
    -   `profile`
    -   `email`
    -   `address`
    -   `phone`
-   **`client_id`:** **(Required)** Must exactly match a client ID configured in the environment variables.
-   **`redirect_uri`:** **(Required)** Must exactly match a redirect URL configured in the environment variables.
-   **`state`:** (Optional) A string of text that is not used by Dev SSO IdP, but is instead returned as-is to your application when Dev SSO IdP redirects back to it. Your application may have various uses for this, such as in mitigating cross-site request forgery.
-   **`nonce`:** (Optional) A string of text that Dev SSO IdP will return as-is in the `nonce` field of the ID token. This can be used as a security measure to ensure that the request for this ID token came from your app, and specifically from the `/authorize` request associated with this nonce.
-   **`auto_redirect`:** (Optional) Value should be either `y` or `n` if this parameter is used.
    -   If `y`, Dev SSO IdP will automatically redirect back to your app.
    -   If `n`, it will never automatically redirect regardless of any other setting, and the redirect will instead be done as normal by clicking on one of the buttons.
-   **`loading_delay`:** (Optional) Contains a number of milliseconds. If present and > 0, this parameter will introduce an artificial delay into the loading of Dev SSO IdP's `/authorize` page. The purpose of this is to mimic load times of full-fledged production SSO pages so that, when using Dev SSO IdP for demonstration purposes, others' expectations can be managed with regard to what they'll be seeing in production.

## Customizing `/authorize`, `/token`, and `/userInfo` paths

As described in the quick start guide, the only environment variables you must provide values for are related to redirect URIs and client IDs. But there are some others that can provide a lot of value through customization.

Of note are the ones that let you change the `/authorize`, `/token`, and `/userInfo` paths. You can change them to be whatever are the corresponding paths used by your production OIDC provider, so that your application's code doesn't need to know how to use different paths based on its environment.

-   **`DEVSSOIDP_AUTHORIZE_PAGE_PATH`:** The path at which this server will expose the authorize page. Defaults to `/authorize`
-   **`DEVSSOIDP_TOKEN_ENDPOINT_PATH`:** The path at which the server exposes the token endpoint. Defaults to `/api/v1/token`
-   **`DEVSSOIDP_USER_INFO_ENDPOINT_PATH`:** The path at which the server exposes the user info endpoint. Defaults to `/api/v1/userInfo`

For complete info on all Dev SSO IdP's environment variables, see the below section, "Environment variable reference".

## Providing a TLS certificate

You may choose to use HTTP instead of HTTPS when making requests to this project's server. But keep in mind that production OpenID providers will always require the use of HTTPS.

If you want to deploy this project with a TLS certificate:

-   Add your certificate file into the `ssl/cert` folder. (If using the Docker image, use a volume to add it into the `/app/ssl/cert` folder.)
-   Add your certificate's private key into the `ssl/key` folder. (If using the Docker image, use a volume to add it into the `/app/ssl/key` folder.)
-   If you need to provide any intermediate certificates, add them into the `ssl/ca` folder. (If using the Docker image, use a volume to add these into the `/app/ssl/ca` folder.) If not, then you don't need to have anything in this folder.
-   When starting the server after the above additions, make sure to set the `DEVSSOIDP_USE_HTTPS` environment variable to 'true'.

Every file in the `ssl/cert` and `ssl/ca` folders must be a certificate, and every file in the `ssl/key` folder must be a private key. (Except for `.gitignore` and, potentially, `.DS_Store`, both of which it ignores.)

## Client authentication with the token endpoint

The authentication that occurs in the browser is the authentication of the _user_. When the code is exchanged for token, the OIDC provider then authenticates the _client_ (that is, your application). This project provides 3 options for client authentication, which you should choose based on which is closest to what will be used in your production environment:

### Option 1: No authentication

This is what it will be if the `DEVSSOIDP_CLIENT_IDS_WITH_SECRETS` environment variable is not used (and so the `DEVSSOIDP_CLIENT_IDS` environment variable is used instead). Unless the `DEVSSOIDP_CLIENT_ID_OPTIONAL_FOR_TOKEN_ENDPOINT` environment variable is set to true, the `client_id` will still need to be provided, and must match the client ID used when getting the code.

### Option 2: Basic auth, with secrets stored in `DEVSSOIDP_CLIENT_IDS_WITH_SECRETS` env variable as plain text

**This method is to be used only in sandbox environments having no sensitive data, and for which your secrets do not correspond to any secret used in production.**

This method uses Basic Authentication for the token endpoint. It requires that each client ID be paired with a secret, and so it uses client IDs from the `DEVSSOIDP_CLIENT_IDS_WITH_SECRETS` environment variable instead. Note that if `DEVSSOIDP_CLIENT_IDS_WITH_SECRETS` contains any values, then the `DEVSSOIDP_CLIENT_IDS` environment variable will be ignored.

`DEVSSOIDP_CLIENT_IDS_WITH_SECRETS` contains a comma-delimited list of client ID/secret pairs. These pairs are themselves delimited by a colon.

-   For example, if you have only one client ID, "relying_party", for which the secret is "mysecret1234", then the value of this environment variable should be `relying_party:mysecret1234`.
-   If you have multiple client IDs, then they should each be concatenated with their secrets in this manner, and separated from each other by a comma. For example: `relying_party:mysecret1234,other_client:othersecret1234`
-   Since the secret is stored in the environment variable in plain text, this method is to be used only in sandbox environments having no sensitive data, and for which your secrets do not correspond to any secret used in production.

When making a request to the token endpoint, in accordance with standard Basic Auth practice, the "Authorization" header will be needed. The value of this header should be constructed as follows:

1. The client ID and secret should be concatenated with each other, with a colon in between. For example, `relying_party:mysecret1234`.
2. This text should then be base64-encoded. For the above example, it would result in the following string: `cmVseWluZ19wYXJ0eTpteXNlY3JldDEyMzQ=`
3. The header value should be the word "Basic", followed by a space, and then the generated base64 string. For example, `Basic cmVseWluZ19wYXJ0eTpteXNlY3JldDEyMzQ=`.
4. And so the complete header when entered into `curl` or any other tool for sending HTTP requests would be `Authorization: Basic cmVseWluZ19wYXJ0eTpteXNlY3JldDEyMzQ=`

### Option 3: Basic auth, with `DEVSSOIDP_CLIENT_IDS_WITH_SECRETS` containing hashes instead of plain text secrets

This method will be used if the `DEVSSOIDP_HASH_SECRET` environment variable is set to `true`, and `DEVSSOIDP_CLIENT_IDS_WITH_SECRETS` contains any values. This method also requires the `DEVSSOIDP_SALTS_FOR_HASHING_SECRET` environment variable to contain a value.

This method is the same as the previous in terms of how the request is sent to the token endpoint. The difference is entirely in how the secret is specified in the `DEVSSOIDP_CLIENT_IDS_WITH_SECRETS` environment variable. Instead of the secret, each client ID is instead paired with a SHA-256 hash created from the secret.

-   For example, if the desired client ID is "relying_party" and the desired secret is "mysecret1234", you will put the secret through a hashing process before setting it in the environment variable.
-   You should take "mysecret1234" and concatenate it with an arbitrary string of your choosing, called the salt. For this example, suppose you choose "my-super-cool-salt" as your salt. So, after concatenating, you will have the string "mysecret1234my-super-cool-salt".
-   Input this string into the SHA-256 hashing function, and then base64-encode the output of that. In this example, the result is `dtP556jiLe8bOmBrlnj/L+VLUrVXHH2Dv5DgjhiAxlI=`.
-   When setting the value of the `DEVSSOIDP_CLIENT_IDS_WITH_SECRETS` environment variable, use this value in place of the secret. So, your value for `DEVSSOIDP_CLIENT_IDS_WITH_SECRETS` would be `relying_party:dtP556jiLe8bOmBrlnj/L+VLUrVXHH2Dv5DgjhiAxlI=`.
-   Set the `DEVSSOIDP_SALTS_FOR_HASHING_SECRET` environment variable to include the salt that you used. So in this example, the value of that variable would be `my-super-cool-salt`.
-   Make sure you're also setting `DEVSSOIDP_HASH_SECRET` to `true` if you want to use this method.
-   Repeat the above for each client ID you wish to use.
    -   Include all client ID/hash pairs in `DEVSSOIDP_CLIENT_IDS_WITH_SECRETS`, separated by commas.
    -   Use a different salt for each secret, and include each salt in `DEVSSOIDP_SALTS_FOR_HASHING_SECRET`, again separated by commas. The first salt in this environment variable should correspond to the first client ID/hash pair in `DEVSSOIDP_CLIENT_IDS_WITH_SECRETS`, and so on.

Note that you only need to hash the secret for purpose of populating the `DEVSSOIDP_CLIENT_IDS_WITH_SECRETS` environment variable. The token endpoint request's Authorization header should be constructed as mentioned in the previous method, using the unhashed secret. When the endpoint is validating the Authorization header, it will hash the provided secret and check it against the hash provided in the environment variable, and denying authorization if they don't match. In this way, Basic Auth may be used without the secret being stored

## Degree of similitude with OpenID Connect providers

The OpenID Connect specification enumerates both optional features and multiple nonstandard ways in which a mandatory feature may be implemented. This project targets a broad range of implementations to accomodate, but there are too vast a number of potential discrepancies for it to account for all of them.

One example: the specification notes that the `token_type` field in the token endpoint response must be "Bearer", but is case insensitive. This project uses the common init-capped "Bearer", but your production OpenID provider may use "BEARER". If for some reason your client requires the init-capped string, it will work with this project's server, but not with that of your production environment.

This project's goal is that it can be used by your lower environment applications as a form-fitting substitute for a normative OpenID provider, but it is still up to you as a developer to do due dilligence in making sure compatibility will be maintained in production.

## Health check endpoints

This server exposes two endpoints that can be used with automated health checks:

-   **/api/v1/health:** This endpoint indicates basic readiness to serve requests.
-   **/api/v1/health/env:** Unlike the above endpoint, this one fails if there are any problems detected in any environment variables.

It is recommended that the first endpoint be used on recurring status checks, and the second on initial checks on server startup. But if you use a Kubernetes deployment that will stop the server if a health check fails, you may wish to use the first endpoint for all checks, so that the server will remain running, and you may see from a UI page what the environment variable problems are. In any event, the server will log to the console any environment variable problems it encounters during validation.

## Running on Kubernetes

This repository includes [a sample YAML file](sample/k8s-deployment.yaml) with which you can put Dev SSO IdP on a Kubernetes cluster. Deploy it with `kubectl apply -f sample/k8s-deployment.yaml`

Dev SSO IdP works just fine when configuring the cluster to have multiple replicas of its pod, since it is stateless, and so the code from authorize requests to one pod can be handled by token requests to another.

## Using refresh tokens to get new ID and access tokens

By default Dev SSO IdP will also provide a refresh token alongside ID and access tokens, in the `refresh_token` field. Below shows an example of a request in which this is used to get new tokens after the ID token expired:

```
curl --request POST \
  --url http://localhost:3000/api/v1/token \
  --header 'Authorization: Basic cmVseWluZ19wYXJ0eTpteXN1cGVyc2VjcmV0cHc=' \
  --header 'content-type: application/x-www-form-urlencoded' \
  --data 'grant_type=refresh_token&refresh_token=df0FXXw1e2+WGx6Y/EeitOb81bwMllU+RxU9qTb8RJdw/0jmdtBndhyU2f0J15HIv94qs=&scope=openid profile'
```

Note that the value of `grant_type` is `refresh_token`, and there's a new `refresh_token` field.

## Environment variable reference

-   **`DEVSSOIDP_PERCENT_ENCODED_REDIRECT_URIS`:** **Mandatory.** Contains a comma-delimited list of hosts that the server will recognize as valid values for the `redirect_uri` request parameter in the authorize page. The URL of your application to which you'd like the authorize page to redirect should go here. Each value in this list must be [percent-encoded (AKA URL-encoded)](https://www.url-encode-decode.com/).
-   **`DEVSSOIDP_CLIENT_IDS`:** A comma-delimited list of client IDs. This environment variable does not associate them with secrets, and so is only suitable if you can't use basic auth when calling the token endpoint. **Either this variable or `DEVSSOIDP_CLIENT_IDS_WITH_SECRETS` must have a value.** If `DEVSSOIDP_CLIENT_IDS_WITH_SECRETS` has a value, this will be ignored.
-   **`DEVSSOIDP_CLIENT_IDS_WITH_SECRETS`:** A comma-delimited list of client ID/secret pairs. Each pair is itself delimited by a colon. For more on how to configure this variable, see the above section on client authentication. **Either this variable or `DEVSSOIDP_CLIENT_IDS` must have a value.**
-   **`DEVSSOIDP_USE_HTTP`:** (Default: `true`) Set to `true` if you need to be able to send requests to this server with HTTP. At least one of this or `DEVSSOIDP_USE_HTTPS` must be `true`.
-   **`DEVSSOIDP_HTTP_PORT`:** (`3000`) The port on which this server will listen for HTTP requests. Not used if `DEVSSOIDP_USE_HTTP` is not `true`.
-   **`DEVSSOIDP_USE_HTTPS`:** (`false`) Set to `true` if you want to be able to send requests to this server with HTTPS. At least one of this or `DEVSSOIDP_USE_HTTP` must be `true`.
-   **`DEVSSOIDP_HTTPS_PORT`:** (`3443`) The port on which this server will listen for HTTPS requests. Not used if `DEVSSOIDP_USE_HTTPS` is not `true`.
-   **`DEVSSOIDP_ISSUER`:** (`http://localhost:3000`) This value will go into the `issuer` field of the ID token. Consumers of ID tokens will expect this to be the host at which the identity provider was reached. It should not be percent-encoded. The value of this field will only matter to you if your application will be using this field in the ID token.
-   **`DEVSSOIDP_HASH_SECRET`:** (`true`) If this is `true`, secrets in `DEVSSOIDP_CLIENT_IDS_WITH_SECRETS` will be treated as hashes. For more info, see the above section on client authentication.
-   **`DEVSSOIDP_SALTS_FOR_HASHING_SECRET`:** Contains a comma-delimited list of salts, one for each client ID. **This variable must be given a value if `DEVSSOIDP_HASH_SECRET` is `true`.** For more info, see the above section on client authentication.
-   **`DEVSSOIDP_ID_TOKEN_EXPIRATION_SECONDS`:** (`14400`) The number of seconds after ID token creation at which the token will expire. The default corresponds to 4 hours.
-   **`DEVSSOIDP_IGNORE_RESPONSE_TYPE_VALIDATION`:** (`false`) The default behavior of the authorize page is to check the `response_type` request parameter and require that its value be `code`. This check will be ignored if this variable's value is `true`.
-   **`DEVSSOIDP_IGNORE_CLIENT_ID_VALIDATION`:** (`false`) The default behavior of the authorize page is to check the `client_id` request parameter and require that it contain one of the recognized client IDs configured in `DEVSSOIDP_CLIENT_IDS` or `DEVSSOIDP_CLIENT_IDS_WITH_SECRETS`. This check will be ignored if this variable's value is `true`.
-   **`DEVSSOIDP_IGNORE_SCOPE_VALIDATION`:** (`false`) The default behavior of the authorize page is to check the `scope` request parameter and require that one of the provided scopes is `openid`, as per the OIDC specification. This check will be ignored if this variable's value is `true`.
-   **`DEVSSOIDP_IGNORE_REDIRECT_URI_VALIDATION`:** (`false`) The default behavior of the authorize page is to check the `redirect_uri` request parameter and require that the value is one of the URIs configured in `DEVSSOIDP_PERCENT_ENCODED_REDIRECT_URIS`. This check will be ignored if this variable's value is `true`.
-   **`DEVSSOIDP_INCLUDE_EXPIRES_IN_IN_TOKEN_RESPONSE`:** (`true`) By default, the token endpoint's response body will include the `expires_in` field, having the number of seconds until the ID token expires. The OIDC specification designates this as optional, and so you may remove this behavior by setting this variable to `false`.
-   **`DEVSSOIDP_REDIRECT_URI_OPTIONAL_FOR_TOKEN_ENDPOINT`:** (`false`) The default behavior of the token endpoint is to check the `redirect_uri` field of the request body, and require that it be the same as was used in the `redirect_uri` request parameter of the authorize page, as per the OAuth 2.0 specification. This check will be ignored if this variable's value is `true`.
-   **`DEVSSOIDP_CLIENT_ID_OPTIONAL_FOR_TOKEN_ENDPOINT`:** (`false`) If not using basic authentication (i.e. if `DEVSSOIDP_CLIENT_IDS` is used instead of `DEVSSOIDP_CLIENT_IDS_WITH_SECRETS`), the default behavior of the token endpoint is to check the `client_id` field of the request body, and require that it be the same as was used in the `client_id` request parameter of the authorize page, as per the OAuth 2.0 specification. This check will be ignored if this variable's value is `true`.
-   **`DEVSSOIDP_ENABLE_REFRESH_TOKENS`:** (`true`) Whether a refresh token is provided in the response body of the token endpoint.
-   **`DEVSSOIDP_LOG_LEVEL`:** (`info`) The log level used by this server. `info` is reasonably verbose. Logs can be restricted to only warnings and errors by using the `warn` level, and only errors by using the `error` level.
-   **`DEVSSOIDP_AUTHORIZE_PAGE_PATH`:** (`/authorize`) The path at which this server will expose the authorize page.
-   **`DEVSSOIDP_SETTINGS_PAGE_PATH`:** (`/settings`) The path at which this server will expose a page for changing browser-specific settings.
-   **`DEVSSOIDP_ENVIRONMENT_PAGE_PATH`:** (`/environment`) The path at which this server will expose a page listing environment variable statuses and values, which may be useful for debugging.
-   **`DEVSSOIDP_TOKEN_ENDPOINT_PATH`:** (`/api/v1/token`) The path at which the server exposes the token endpoint.
-   **`DEVSSOIDP_USER_INFO_ENDPOINT_PATH`:** (`/api/v1/userInfo`) The path at which the server exposes the user info endpoint.
-   **`DEVSSOIDP_CODE_ENDPOINT_PATH`:** (`/api/v1/code`) The path at which the server exposes an endpoint for retrieving new codes. This is only used internally by the IdP's web UI and should not be used by your application.
-   **`VDEVSSOIDP_HEALTH_CHECK_ENDPOINT_PATH`:** (`/api/v1/health`) The path at which the server exposes an endpoint indicating basic readiness. See above section on health check endpoints for more info.
-   **`DEVSSOIDP_HEALTH_CHECK_ENV_ENDPOINT_PATH`:** (`/api/v1/health/env`) The path at which the server exposes an endpoint indicating environment validity. See above section on health check endpoints for more info.

## Basic troubleshooting

In case of errors, endpoints will return a message explaining the error, or Dev SSO IdP's UI will provide details. The exception to this is status 403 responses for requests whose access is denied, in which case more info on the error will be available in the server's prints to the console.

## Roadmap

The below features are on my radar regarding potential inclusion into Dev SSO IdP:

-   **Options for adding user info into ID token.** This is not part of the OIDC specification, but is provided as extended functionality by many implementations of it, and is often depended upon by client applications. I would like to add this capability into Dev SSO IdP but can't provide a timeline at this time.
-   **Verification of PKCE codes.** Currently, requests that provide PKCE code challenges and verifiers will work, but Dev SSO IdP will not fail if a verifier doesn't match a previously supplied challenge, and so it can't alert you to problems in your application related to PKCE flows.
-   **Implicit flow.** [This is a bad practice](https://datatracker.ietf.org/doc/html/rfc9700#section-2.1.2), but it's supported by the OIDC specification, and so if there's an overwhelming desire for it I may consider adding it.
