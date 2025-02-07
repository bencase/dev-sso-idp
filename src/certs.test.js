import fs from 'fs';
import { jest } from '@jest/globals';
import { when } from 'jest-when';

import { getCerts, getIntermediateCerts, getKeys } from './certs.js';

describe('src/certs.js', () => {
    let readdirSyncMock;
    let readFileSyncMock;

    beforeAll(async () => {
        readdirSyncMock = jest.spyOn(fs, 'readdirSync');
        readFileSyncMock = jest.spyOn(fs, 'readFileSync');

        when(readdirSyncMock)
            .calledWith('ssl/cert', { withFileTypes: true })
            .mockReturnValue([
                { isFile: () => false, name: 'old_certs' },
                { isFile: () => true, name: '.DS_Store' },
                { isFile: () => true, name: '.gitignore' },
                { isFile: () => true, name: 'cert1.pem' },
                { isFile: () => true, name: 'cert2.pem' },
            ]);
        when(readdirSyncMock)
            .calledWith('ssl/ca', { withFileTypes: true })
            .mockReturnValue([
                { isFile: () => true, name: '.DS_Store' },
                { isFile: () => true, name: '.gitignore' },
                { isFile: () => true, name: 'ca1.pem' },
                { isFile: () => true, name: 'ca2.pem' },
            ]);
        when(readdirSyncMock)
            .calledWith('ssl/key', { withFileTypes: true })
            .mockReturnValue([
                { isFile: () => true, name: '.DS_Store' },
                { isFile: () => true, name: '.gitignore' },
                { isFile: () => true, name: 'key1.pem' },
            ]);

        readFileSyncMock.mockImplementation((path) => `${path} contents`);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should return contents of ssl/cert directory', () => {
        const certs = getCerts();

        expect(certs).toEqual([
            'ssl/cert/cert1.pem contents',
            'ssl/cert/cert2.pem contents',
        ]);
    });

    test('should return contents of ssl/ca directory', () => {
        const intermediateCerts = getIntermediateCerts();

        expect(intermediateCerts).toEqual([
            'ssl/ca/ca1.pem contents',
            'ssl/ca/ca2.pem contents',
        ]);
    });

    test('should return contents of ssl/key directory', () => {
        const keys = getKeys();

        expect(keys).toEqual(['ssl/key/key1.pem contents']);
    });
});
