'use strict';

const fs = require('fs');
const babel = require('babel-core');
const plugin = require('babel-plugin-inferno');

require.extensions['.jsx'] = function (module, filename) {
	let content = fs.readFileSync(filename, 'utf8');

	let compiled = babel.transform(content, {
		presets: ['es2015', 'stage-2'],
		plugins: [
        [plugin],
        'inline-json-import',
        'syntax-jsx'
    ]
	}).code;

	return module._compile(compiled, filename);
};