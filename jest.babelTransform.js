'use strict';

const babelJest = require('babel-jest').default;

const hasJsxRuntime = (() => {
    if (process.env.DISABLE_NEW_JSX_TRANSFORM === 'true') {
        return false;
    }

    try {
        require.resolve('react/jsx-runtime');
        return true;
    } catch (_) {
        return false;
    }
})();

module.exports = babelJest.createTransformer({
    presets: [
        [
            require.resolve('babel-preset-react-app'),
            {
                runtime: hasJsxRuntime ? 'automatic' : 'classic',
            },
        ],
    ],
    plugins: [require.resolve('./jest.transform-import-meta-env.js')],
    babelrc: false,
    configFile: false,
});

