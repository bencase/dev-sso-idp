export const createHtmlTransform =
    (
        transform,
        stylesCss,
        normalizeCss,
        summariesCss,
        settingInputsHtml,
        settingsLinkHtml,
        authorizePath
    ) =>
    (data, encoding, callback) => {
        let transformedStr = data
            .toString()
            .replace('/*STYLES_CSS_GOES_HERE*/', stylesCss);
        transformedStr = transformedStr.replace(
            '/*NORMALIZE_CSS_GOES_HERE*/',
            normalizeCss
        );
        transformedStr = transformedStr.replace(
            '/*SUMMARIES_CSS_GOES_HERE*/',
            summariesCss
        );
        transformedStr = transformedStr.replace(
            'SETTING_INPUTS_GO_HERE',
            settingInputsHtml
        );
        transformedStr = transformedStr.replace(
            'AUTHORIZE_PATH_GOES_HERE',
            authorizePath
        );
        transformedStr = transformedStr.replace(
            'SETTINGS_LINK_GOES_HERE',
            settingsLinkHtml
        );
        transform.push(transformedStr);
        callback();
    };
