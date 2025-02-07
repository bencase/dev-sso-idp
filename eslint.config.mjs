import globals from 'globals';
import eslintjs from '@eslint/js';

export default [
    {
        // ESLint will consider only files matching the below patterns for linting.
        // The below matches all files with JavaScript- and TypeScript-related extensions.
        files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,mts,tsx,mtsx}'],
    },
    eslintjs.configs.recommended, // This enables all the rules designated as "recommended" here: https://eslint.org/docs/latest/rules/
    {
        // This turns off the 'require-atomic-updates' rule.
        // It would otherwise be off according to the recommended rules enabled above.
        // 'require-atomic-updates' is set to show as an error when the issue is found by ESLint.
        rules: {
            'require-atomic-updates': [
                'error',
                {
                    allowProperties: true,
                },
            ],
        },
    },
    {
        // This sets which globals ESLint knows about when evaluating its 'no-global-assign' rule
        languageOptions: {
            globals: {
                ...globals.builtin,
            },
        },
    },
    {
        // Add node globals for files used for the REST API
        files: ['src/**', '__tests__/**'],
        languageOptions: {
            globals: {
                ...globals.node,
            },
        },
    },
    {
        // Add browser globals for JS that will be executed in the browser
        files: ['public/**', 'inject/**'],
        languageOptions: {
            globals: {
                ...globals.browser,
            },
        },
    },
    {
        // This adds jest-related globals for unit test files only.
        // The `languageOptions` and `globals` objects defined above are not overwritten, but instead extended.
        files: [
            '**/*.test.{js,mjs,cjs,jsx,mjsx,ts,mts,tsx,mtsx}',
            '**/__tests__/**',
        ],
        languageOptions: {
            globals: {
                ...globals.jest,
            },
        },
    },
    {
        // In tests, globals sometimes need to be mocked, so that rule is removed for such files.
        files: [
            '**/*.test.{js,mjs,cjs,jsx,mjsx,ts,mts,tsx,mtsx}',
            '**/__tests__/**',
        ],
        rules: {
            'no-global-assign': 'off',
        },
    },
];
