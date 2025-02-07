import { jest } from '@jest/globals';
import winston from 'winston';

global.console = {
    ...console,
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    // warn: jest.fn(),
    // error: jest.fn(),
};

jest.mock('winston', () => {
    const logger = {
        debug: jest.fn(),
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
        log: jest.fn(),
    };

    return {
        ...winston,
        createLogger: jest.fn().mockReturnValue(logger),
    };
});

it('should be a test since this file must contain at least one test', () => {
    expect(true).toBe(true);
});
