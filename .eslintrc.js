module.exports = {
	env: {
		es6: true,
		browser: true,
		node: true,
		jest: true,
	},
	extends: ['eslint:recommended'],
	parser: 'babel-eslint',
	globals: {
		Atomics: 'readonly',
		SharedArrayBuffer: 'readonly',
	},
	parserOptions: {
		ecmaVersion: 2018,
		sourceType: 'module',
	},
	rules: {},
}
