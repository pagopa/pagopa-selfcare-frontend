'use strict';

const babelJest = require('babel-jest').default;

module.exports = babelJest.createTransformer({
    presets: [
        [
            require.resolve('@babel/preset-env'),
            {
                targets: {
                    node: 'current',
                },
            },
        ],
        [
            require.resolve('@babel/preset-react'),
            {
                runtime: 'automatic',
            },
        ],
        [
            require.resolve('@babel/preset-typescript'),
            {
                allExtensions: true,
                isTSX: true,
            },
        ],
    ],
    plugins: [require.resolve('./jest.transform-import-meta-env.js')],
    babelrc: false,
    configFile: false,
});
