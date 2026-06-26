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
};
