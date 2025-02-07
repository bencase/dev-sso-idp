import Crypto from 'crypto';
import process from 'process';

import winston from 'winston';

import { LOG_LEVEL_ENV_VAR } from './constants.js';

const pid = process.pid;

// Random string for differentiating logs combined from multiple processes on e.g. a Kubernetes cluster
const randomId = Crypto.randomBytes(18).toString('base64');

export const createLogger = (name) => {
    return winston.createLogger({
        level: process.env[LOG_LEVEL_ENV_VAR] || 'info',
        format: winston.format.combine(
            winston.format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss.SSS ZZ',
            }),
            winston.format.printf((meta) => {
                const correlationIdStr = meta.correlationId
                    ? meta.correlationId
                    : '';
                return `${meta.timestamp} ${meta.level} ${pid} --- [${randomId},${correlationIdStr}] ${name}: ${meta.message}`;
            })
        ),
        transports: [new winston.transports.Console()],
    });
};
