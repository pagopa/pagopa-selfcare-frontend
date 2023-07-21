module.exports = {
  webpack: {
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
  jest:{
    configure: {
      coveragePathIgnorePatterns: [
        "src/index.js",
        "src/bootstrap.tsx",
        "src/consentAndAnalyticsConfiguration.ts",
        "src/reportWebVitals.ts",
        "src/api/generated",
        "src/locale/it.ts",
      ],
      collectCoverageFrom: [
        "src/**/*.{js,jsx,ts,tsx}",
        "!src/index.js",
        "!*.test.tsx"
      ],
    }
  }
};
