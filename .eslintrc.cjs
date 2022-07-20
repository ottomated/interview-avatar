module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	env: {
		browser: true,
		es2017: true,
		node: true,
	},
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'prettier',
	],
	plugins: [
		'svelte3',
		'@typescript-eslint',
	],
	ignorePatterns: ['*.cjs'],
	overrides: [
		{
			files: ['*.svelte'],
			processor: 'svelte3/svelte3',
		},
		{
			files: ['*.ts'],
			extends: [
				"plugin:prettier/recommended",
			]
		}

	],
	settings: {
		'svelte3/typescript': () => require('typescript'),
	},
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020,
	},
};