var typescript = require('rollup-plugin-typescript2');
var babel = require('rollup-plugin-babel');
var replace = require('rollup-plugin-replace');

var pkg = require('../package.json');

// compatible with jslib-base and @yanhaijing/jslib-base
// @yanhaijing/jslib-base -> jslib-base
// var name = pkg.name.split('/').pop();
var name = 'z'
// @yanhaijing/jslib-base -> yanhaijing_jslib-base
// var name = pkg.name.replace('@', '').replace(/\//g, '_');
var version = pkg.version;

var banner =
`/*!
 * ${pkg.name} ${version} (${pkg.repository.url})
 * API ${pkg.repository.url}/blob/master/doc/api.md
 * Copyright 2019-${(new Date).getFullYear()} ${pkg.name}. All Rights Reserved
 * Licensed under MIT (${pkg.repository.url}/blob/master/LICENSE)
 */
`;

var type = pkg.srctype === 'ts' ? 'ts' : 'js';

function getCompiler(opt) {
    if (type === 'js') {
        return babel({
            babelrc: false,
            presets: [
                [
                    '@babel/preset-env',
                    {
                        'targets': {
                          'browsers': 'last 2 versions, > 1%, ie >= 6, Android >= 4, iOS >= 6, and_uc > 9',
                          'node': '0.10'
                        },
                        'modules': false,
                        'loose': false
                    }
                ],
            ],
            plugins: [
                [
                    '@babel/plugin-transform-runtime',
                    {
                        'helpers': true,
                        'regenerator': true
                    }
                ],
                "@babel/plugin-proposal-class-properties",
                "@babel/plugin-syntax-dynamic-import"
            ],
            runtimeHelpers: true,
            exclude: 'node_modules/**'
        });
    }

    opt = opt || {
        tsconfigOverride: { compilerOptions : { module: 'ES2015' } }
    }

    return typescript(opt);
}

exports.type = type;
exports.name = name;
exports.banner = banner;
exports.getCompiler = getCompiler;
exports.plugins = [
    replace({
        // include: 'src/index.js', // 指定可以使用变量的文件路径
        exclude: 'node_modules/**',
        ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
        VERSION: JSON.stringify(pkg.version)
    })
]
