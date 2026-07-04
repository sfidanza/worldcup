import globals from 'globals';
import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import { defineConfig } from 'eslint/config';

export default defineConfig([
	{
		plugins: { js, stylistic },
		extends: ['js/recommended'],
		languageOptions: {
			globals: {
				...globals.browser
			},
		},
		rules: {
			'no-extra-bind': 'error',
			'no-shadow': 'error',
			'no-var': 'error',
			'prefer-const': 'error',
			'stylistic/indent': ['error', 'tab', { 'SwitchCase': 1, 'flatTernaryExpressions': true }],
			'stylistic/quotes': ['error', 'single'],
			'stylistic/semi': ['error', 'always']
		}
	}
]);
