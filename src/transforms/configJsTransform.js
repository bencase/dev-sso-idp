export const createConfigJsTransform =
    (
        transform,
        envVarHolder,
        envVarsValidationResult,
        normalizedClientIdsStr
    ) =>
    (data, encoding, callback) => {
        let transformedStr = data
            .toString()
            .replace('CLIENT_IDS_GO_HERE', normalizedClientIdsStr);
        transformedStr = transformedStr.replace(
            'PERCENT_ENCODED_REDIRECT_URIS_GOES_HERE',
            envVarHolder.percentEncodedRedirectUris
        );
        transformedStr = transformedStr.replace(
            "'IGNORE_RESPONSE_TYPE_VALIDATION_GOES_HERE'",
            envVarHolder.ignoreResponseTypeValidation
        );
        transformedStr = transformedStr.replace(
            "'IGNORE_CLIENT_ID_VALIDATION_GOES_HERE'",
            envVarHolder.ignoreClientIdValidation
        );
        transformedStr = transformedStr.replace(
            "'IGNORE_SCOPE_VALIDATION_GOES_HERE'",
            envVarHolder.ignoreScopeValidation
        );
        transformedStr = transformedStr.replace(
            "'IGNORE_REDIRECT_URI_VALIDATION_GOES_HERE'",
            envVarHolder.ignoreRedirectUriValidation
        );
        transformedStr = transformedStr.replace(
            "'ENV_VAR_SERVER_VALIDATION_RESULT_GOES_HERE'",
            JSON.stringify(envVarsValidationResult)
        );
        transform.push(transformedStr);
        callback();
    };
