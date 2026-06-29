const selfcareCommonAliases = [
  'components',
  'config',
  'decorators',
  'hooks',
  'locale',
  'model',
  'redux',
  'services',
  'utils',
].reduce(
  (aliases, folder) => ({
    ...aliases,
    [`@pagopa/selfcare-common-frontend/${folder}`]: `@pagopa/selfcare-common-frontend/lib/${folder}`,
  }),
  {
    '@pagopa/selfcare-common-frontend/consentManagementConfigure':
      '@pagopa/selfcare-common-frontend/lib/consentManagementConfigure',
  }
);

const customModuleNameMapper = {
  '\\.(css|less)$': '<rootDir>/__mocks__/styleMock.js',
  '^@pagopa/selfcare-common-frontend/lib/(.*)$':
    '<rootDir>/node_modules/@pagopa/selfcare-common-frontend/lib/$1',
  '^@pagopa/selfcare-common-frontend/(.*)$':
    '<rootDir>/node_modules/@pagopa/selfcare-common-frontend/lib/$1',
};

const esModulesToTransform = [
  '@pagopa[\\\\/]mui-italia',
  '@pagopa[\\\\/]selfcare-common-frontend',
  '@mui[\\\\/]icons-material[\\\\/]esm',
  '@mui[\\\\/]material[\\\\/]esm',
  '@mui[\\\\/]system[\\\\/]esm',
  'italia-ts-commons',
].join('|');

const transformIgnorePattern = `[\\\\/]node_modules[\\\\/](?!(${esModulesToTransform})([\\\\/]|$))`;

const babelJestTransform = require.resolve('./jest.babelTransform.js');

const updateJestTransform = (transform = {}) =>
  Object.entries(transform).reduce(
    (updatedTransform, [pattern, transformer]) => ({
      ...updatedTransform,
      [pattern]: pattern.includes('js|jsx|mjs') ? babelJestTransform : transformer,
    }),
    {}
  );

module.exports = {
  webpack: {
    alias: selfcareCommonAliases,
    configure: {
      module: {
        rules: [
          {
            test: /\.m?js/,
            resolve: {
              fullySpecified: false,
            },
          },
        ],
      },
      ignoreWarnings: [/Failed to parse source map/],
    },
  },
  jest: {
    configure: (jestConfig) => ({
      ...jestConfig,
      moduleNameMapper: {
        ...jestConfig.moduleNameMapper,
        ...customModuleNameMapper,
      },
      transform: updateJestTransform(jestConfig.transform),
      transformIgnorePatterns: (jestConfig.transformIgnorePatterns ?? []).some((pattern) =>
        pattern.includes('node_modules')
      )
        ? jestConfig.transformIgnorePatterns.map((pattern) =>
            pattern.includes('node_modules') ? transformIgnorePattern : pattern
          )
        : [transformIgnorePattern],
    }),
  },
};
