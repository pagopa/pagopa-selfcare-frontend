import * as env from 'env-var';

const PUBLIC_URL_INNER: string | undefined = env.get('PUBLIC_URL').asString() || '/ui';
export const ENV = {
  ENV: env.get('REACT_APP_ENV').required().asString(),
  PUBLIC_URL: PUBLIC_URL_INNER,

  ASSISTANCE: {
    EMAIL: env.get('REACT_APP_PAGOPA_HELP_EMAIL').required().asString(),
  },

  URL_FE: {
    LOGIN: env.get('REACT_APP_URL_FE_LOGIN').required().asString(),
    LOGOUT: env.get('REACT_APP_URL_FE_LOGOUT').required().asString(),
    LANDING: env.get('REACT_APP_URL_FE_LANDING').required().asString(),
    ASSISTANCE: env.get('REACT_APP_URL_FE_ASSISTANCE').required().asString(),
    SELFCARE: env.get('REACT_APP_URL_FE_SELFCARE').required().asString(),
    TOKEN_EXCHANGE: env.get('REACT_APP_URL_FE_TOKEN_EXCHANGE').required().asString(),
  },

  URL_API: {
    PORTAL: env.get('REACT_APP_URL_API_PORTAL').required().asString(),
    TOKEN: env.get('REACT_APP_URL_API_TOKEN').required().asString(),
  },

  API_TIMEOUT_MS: {
    PORTAL: env.get('REACT_APP_API_PORTAL_TIMEOUT_MS').required().asInt(),
  },

  URL_INSTITUTION_LOGO: {
    PREFIX: env.get('REACT_APP_URL_INSTITUTION_LOGO_PREFIX').required().asString(),
    SUFFIX: env.get('REACT_APP_URL_INSTITUTION_LOGO_SUFFIX').required().asString(),
  },

  ANALYTCS: {
    ENABLE: env.get('REACT_APP_ANALYTICS_ENABLE').default('false').asBool(),
    MOCK: env.get('REACT_APP_ANALYTICS_MOCK').default('false').asBool(),
    DEBUG: env.get('REACT_APP_ANALYTICS_DEBUG').default('false').asBool(),
    TOKEN: env.get('REACT_APP_MIXPANEL_TOKEN').required().asString(),
    API_HOST: env
      .get('REACT_APP_MIXPANEL_API_HOST')
      .default('https://api-eu.mixpanel.com')
      .asString(),
  },
};
