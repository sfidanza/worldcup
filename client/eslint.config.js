import js from '@eslint/js';
import globals from 'globals';

export default [
	js.configs.recommended,
	{
		languageOptions: {
			globals: {
				...globals.browser
			},
		},
		rules: {
			'indent': ['error', 'tab', { 'SwitchCase': 1 }],
			'no-extra-bind': 'error',
			'no-shadow': 'error',
			'no-var': 'error',
			'prefer-const': 'error',
			'quotes': [ 'error', 'single' ],
			'semi': [ 'error', 'always' ]
		}
	}
];
