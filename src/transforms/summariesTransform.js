const getSummaryTypeClass = (errors, warnings) => {
    if (errors && errors.length > 0) {
        return 'summaryError';
    } else if (warnings && warnings.length > 0) {
        return 'summaryWarning';
    } else {
        return 'summaryNormal';
    }
};

const getErrorsAndWarningsHtml = (
    errors,
    warnings,
    errorIssueHtml,
    warningIssueHtml
) => {
    const htmlComponents = [];
    if (errors) {
        for (const error of errors) {
            htmlComponents.push(
                errorIssueHtml.replace('ISSUE_TEXT_GOES_HERE', error.message)
            );
        }
    }
    if (warnings) {
        for (const warning of warnings) {
            htmlComponents.push(
                warningIssueHtml.replace(
                    'ISSUE_TEXT_GOES_HERE',
                    warning.message
                )
            );
        }
    }
    return htmlComponents.join('');
};

const addValuesIntoHtml = (
    summaryHtml,
    errorIssueHtml,
    warningIssueHtml,
    envVarName,
    envVarValue,
    errors,
    warnings
) => {
    return summaryHtml
        .replace(
            'SUMMARY_TYPE_CLASS_GOES_HERE',
            getSummaryTypeClass(errors, warnings)
        )
        .replace('ENV_VAR_NAME_GOES_HERE', envVarName)
        .replace('ENV_VAR_VAL_GOES_HERE', envVarValue)
        .replace(
            '<!--SUMMARY_ISSUES_GO_HERE-->',
            getErrorsAndWarningsHtml(
                errors,
                warnings,
                errorIssueHtml,
                warningIssueHtml
            )
        );
};

export const createSummariesTransform =
    (
        transform,
        summaryHtml,
        errorIssueHtml,
        warningIssueHtml,
        envVarsSummary
    ) =>
    (data, encoding, callback) => {
        const envVarHtmls = [];
        let envVarsOrder = envVarsSummary.order;
        let envVarSummaries = envVarsSummary.summaries;

        /*
        envVarsOrder = ['MY_TEST_VAR1', 'MY_TEST_VAR2', 'MY_TEST_VAR3', 'MY_TEST_VAR4', 'MY_TEST_VAR5', ...envVarsOrder];
        envVarSummaries['MY_TEST_VAR1'] = {
            value: 'froot loops',
            errors: [
                { message: 'Uh oh! You really did it this time! AAAAAAAAAA AAAAAAAAAA AAAAAAAAAA AAAAAAAAAA AAAAAAAAAA AAAAAAAAAA AAAAAAAAAA AAAAAAAAAA AAAAAAAAAA AAAAAAAAAA AAAAAAAAAA AAAAAAAAAA.' }
            ],
        };
        envVarSummaries['MY_TEST_VAR2'] = {
            value: 'abcdefghijklmnopqrstuvwxyz_abcdefghijklmnopqrstuvwxyz_abcdefghijklmnopqrstuvwxyz_abcdefghijklmnopqrstuvwxyz',
            errors: [
                { message: 'Not again! AAAAAAAAAA AAAAAAAAAA AAAAAAAAAA AAAAAAAAAA AAAAAAAAAA AAAAAAAAAA AAAAAAAAAA AAAAAAAAAA AAAAAAAAAA AAAAAAAAAA AAAAAAAAAA AAAAAAAAAA.' },
                { message: 'And another error! AAAAAAAAAA AAAAAAAAAA AAAAAAAAAA AAAAAAAAAA AAAAAAAAAA AAAAAAAAAA AAAAAAAAAA AAAAAAAAAA AAAAAAAAAA AAAAAAAAAA AAAAAAAAAA AAAAAAAAAA.' }
            ],
        };
        envVarSummaries['MY_TEST_VAR3'] = {
            value: 'abcdefghijklmnopqrstuvwxyz abcdefghijklmnopqrstuvwxyz abcdefghijklmnopqrstuvwxyz abcdefghijklmnopqrstuvwxyz',
            warnings: [
                { message: 'Watch out! AAAAAAAAAA AAAAAAAAAA AAAAAAAAAA AAAAAAAAAA AAAAAAAAAA AAAAAAAAAA AAAAAAAAAA AAAAAAAAAA AAAAAAAAAA AAAAAAAAAA AAAAAAAAAA AAAAAAAAAA.' }
            ],
            errors: [
                { message: 'Oh noooooooooooooooooo! AAAAAAAAAA AAAAAAAAAA AAAAAAAAAA AAAAAAAAAA AAAAAAAAAA AAAAAAAAAA AAAAAAAAAA AAAAAAAAAA AAAAAAAAAA AAAAAAAAAA AAAAAAAAAA AAAAAAAAAA.' },
            ],
        };
        envVarSummaries['MY_TEST_VAR4'] = {
            value: 'a',
            warnings: [
                { message: 'Im letting you off with a warning. AAAAAAAAAA AAAAAAAAAA AAAAAAAAAA AAAAAAAAAA AAAAAAAAAA AAAAAAAAAA AAAAAAAAAA AAAAAAAAAA AAAAAAAAAA AAAAAAAAAA AAAAAAAAAA AAAAAAAAAA.' },
                { message: 'Tiny warning.' }
            ],
        };
        envVarSummaries['MY_TEST_VAR5'] = {
            value: 'O0O0O0O0O0O0O0O0O0O0O0O0O0O0O0O0O0O0O0O0O0O0O0O0O0',
            warnings: [
                { message: 'Little itty bitty warning.' }
            ],
        };
        */

        for (const envVar of envVarsOrder) {
            const summary = envVarSummaries[envVar];
            envVarHtmls.push(
                addValuesIntoHtml(
                    summaryHtml,
                    errorIssueHtml,
                    warningIssueHtml,
                    envVar,
                    summary.value,
                    summary.errors,
                    summary.warnings
                )
            );
        }
        const fullHtml = envVarHtmls.join('');

        let transformedStr = data
            .toString()
            .replace('SUMMARIES_GO_HERE', fullHtml);
        transform.push(transformedStr);
        callback();
    };
