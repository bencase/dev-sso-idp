import express from 'express';
import fs from 'fs';
import parseUrl from 'parseurl';
import { Transform } from 'node:stream';
import compression from 'compression';
import helmet from 'helmet';
import https from 'https';

import { getCerts, getIntermediateCerts, getKeys } from './certs.js';
import { getNormalizedClientIdsStr } from './commonLogic.js';
import {
    correlationIdHeader,
    DEFAULT_HTTPS_PORT,
    DEFAULT_PORT,
    USE_HTTPS_ENV_VAR,
} from './constants.js';
import { getSummaryOfEnvVars } from './envVarSummarizer.js';
import { getEnvVarHolder } from './envVarUtil.js';
import { makeHealthRoute, makeEnvHealthRoute } from './routes/health.js';
import { createLogger } from './loggerManager.js';
import { getRouteParams } from './routeParamsUtil.js';
import { makeCodeRoute } from './routes/code.js';
import { makeTokenRoute } from './routes/token.js';
import { makeUserInfoRoute } from './routes/userInfo.js';
import { createConfigJsTransform } from './transforms/configJsTransform.js';
import { createHtmlTransform } from './transforms/htmlTransform.js';
import { createSummariesTransform } from './transforms/summariesTransform.js';
import { validateValues } from './validateEnvVars.js';

const configJsPath = '/config.js';

const logger = createLogger('app');

const envVarHolder = getEnvVarHolder();

const authorizePagePath = envVarHolder.authorizePagePath || '/authorize';
const settingsPagePath = envVarHolder.settingsPagePath || '/settings';
const environmentPagePath = envVarHolder.environmentPagePath || '/environment';
const codeEndpointPath = envVarHolder.codeEndpointPath || '/api/v1/code';
const tokenEndpointPath = envVarHolder.tokenEndpointPath || '/api/v1/token';
const userInfoEndpointPath =
    envVarHolder.userInfoEndpointPath || '/api/v1/userInfo';
const basicHealthCheckEndpointPath =
    envVarHolder.healthCheckEndpointPath || '/api/v1/health';
const envHealthCheckEndpointPath =
    envVarHolder.healthCheckEnvEndpointPath || '/api/v1/health/env';

const envVarsValidationResult = (() => {
    try {
        return validateValues(envVarHolder);
    } catch (err) {
        logger.error(`Error: ${err.message}`);
        process.exitCode = 1;
        process.exit();
    }
})();

const envVarsSummary = getSummaryOfEnvVars(
    envVarHolder,
    envVarsValidationResult
);

const routeParams = getRouteParams(envVarHolder);

const app = express();

app.use(compression());
app.use(helmet());

app.use((req, res, next) => {
    const correlationId = req.header(correlationIdHeader);
    logger.info(`${req.method} ${req.path} - ${req.ip || 'NOIP'}`, {
        correlationId: correlationId,
    });
    next();
});

const getCssAndSettingsInjectTransform = (settingsLinkHtml) => {
    const stylesCss = fs.readFileSync('inject/styles.css');
    const normalizeCss = fs.readFileSync('inject/normalize.css');
    const summariesCss = fs.readFileSync('inject/summaries.css');
    const settingInputsHtml = fs.readFileSync('inject/settingInputs.html');

    const htmlTransform = new Transform();
    htmlTransform._transform = createHtmlTransform(
        htmlTransform,
        stylesCss,
        normalizeCss,
        summariesCss,
        settingInputsHtml,
        settingsLinkHtml,
        authorizePagePath
    );

    return htmlTransform;
};

const getEnvVarsSummaryTransform = () => {
    const summaryHtml = fs.readFileSync('inject/summary.html');
    const summaryErrorHtml = fs.readFileSync('inject/summaryError.html');
    const summaryWarningHtml = fs.readFileSync('inject/summaryWarning.html');

    const htmlTransform = new Transform();
    htmlTransform._transform = createSummariesTransform(
        htmlTransform,
        summaryHtml.toString(),
        summaryErrorHtml.toString(),
        summaryWarningHtml.toString(),
        envVarsSummary
    );

    return htmlTransform;
};

const getConfigJsTransform = () => {
    const normalizedClientIdsStr = getNormalizedClientIdsStr(
        envVarHolder.clientIdsStr,
        envVarHolder.clientIdsWithSecretsStr
    );

    const configJsTransform = new Transform();
    configJsTransform._transform = createConfigJsTransform(
        configJsTransform,
        envVarHolder,
        envVarsValidationResult,
        normalizedClientIdsStr
    );

    return configJsTransform;
};

app.use((req, res, next) => {
    let path = parseUrl(req).pathname;

    if (path === authorizePagePath) {
        res.setHeader('content-type', 'text/html');

        const settingsLinkHtml = `<br><br>Note that this setting and all the below settings may be changed on the <a href="${settingsPagePath}">settings page</a>.`;
        let stream = fs.createReadStream('inject/authorize.html');
        stream
            .pipe(getCssAndSettingsInjectTransform(settingsLinkHtml))
            .pipe(res);
    } else if (path === settingsPagePath) {
        res.setHeader('content-type', 'text/html');

        let stream = fs.createReadStream('inject/settings.html');
        stream.pipe(getCssAndSettingsInjectTransform('')).pipe(res);
    } else if (path === environmentPagePath) {
        res.setHeader('content-type', 'text/html');

        let stream = fs.createReadStream('inject/environment.html');
        stream
            .pipe(getCssAndSettingsInjectTransform(''))
            .pipe(getEnvVarsSummaryTransform())
            .pipe(res);
    } else if (path === configJsPath) {
        res.setHeader('content-type', 'application/javascript; charset=UTF-8');

        let stream = fs.createReadStream('inject/config.js');
        stream.pipe(getConfigJsTransform()).pipe(res);
    } else {
        next();
    }
});

app.use(express.urlencoded());

app.get(codeEndpointPath, makeCodeRoute(routeParams));

app.post(tokenEndpointPath, makeTokenRoute(routeParams));

app.get(userInfoEndpointPath, makeUserInfoRoute());

app.get(basicHealthCheckEndpointPath, makeHealthRoute());

app.get(
    envHealthCheckEndpointPath,
    makeEnvHealthRoute(envVarsValidationResult)
);

app.use(express.static('public'));

app.get('*', (req, res) => {
    res.setHeader('content-type', 'text/html');

    let stream = fs.createReadStream('inject/404.html');
    stream.pipe(getCssAndSettingsInjectTransform('')).pipe(res);
});

if (String(envVarHolder.useHttp).toLowerCase() === 'true') {
    const port = envVarHolder.httpPort || DEFAULT_PORT;
    app.listen(port, () => logger.info(`Listening on port ${port}`));
}

if (String(envVarHolder.useHttps).toLowerCase() === 'true') {
    let certs, keys, intermediateCerts;

    // When running with HTTPS enabled, the cert and key directories needs to exist.
    try {
        certs = getCerts();
    } catch (e) {
        if (e.code === 'ENOENT') {
            logger.error(
                `No SSL certificate found in 'ssl/cert' directory. This is required when ${USE_HTTPS_ENV_VAR} is 'true'.`
            );
            process.exit(1);
        } else {
            throw e;
        }
    }
    try {
        keys = getKeys();
    } catch (e) {
        if (e.code === 'ENOENT') {
            logger.error(
                `No private key found in 'ssl/key' directory. This is required when ${USE_HTTPS_ENV_VAR} is 'true'.`
            );
            process.exit(1);
        } else {
            throw e;
        }
    }

    // The ca directory don't always need to exist.
    try {
        intermediateCerts = getIntermediateCerts();
    } catch (e) {
        if (e.code === 'ENOENT') {
            logger.info(`No found: 'ssl/ca' directory.`);
            intermediateCerts = [];
        } else {
            throw e;
        }
    }

    const sslOptions = {
        key: keys,
        cert: certs,
        ca: intermediateCerts,
    };

    const port = envVarHolder.httpsPort || DEFAULT_HTTPS_PORT;
    https
        .createServer(sslOptions, app)
        .listen(port, () => logger.info(`Listening on port ${port} with TLS`));
}
