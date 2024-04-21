import js from '@eslint/js';
import globals from 'globals';

export default [
    js.configs.recommended,
    {
        ignores: ['src/business/history.js'], // pending import attributes being supported by eslint: https://github.com/tc39/proposal-import-attributes
    },
    {
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.mocha
            },
        },
        rules: {
            'no-extra-bind': 'error',
            'no-shadow': 'error',
            'no-var': 'error',
            'prefer-const': 'error',
            'quotes': [ 'error', 'single' ],
            'semi': [ 'error', 'always' ]
        }
    }
];
