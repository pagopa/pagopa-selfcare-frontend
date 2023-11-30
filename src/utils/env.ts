import * as env from 'env-var';
import {getConfig, Type} from "./config";

const PUBLIC_URL_INNER: string | undefined = env.get('PUBLIC_URL').asString() || '/ui';
export const ENV = {
  ENV: env.get('REACT_APP_ENV').required().asString(),
  PUBLIC_URL: PUBLIC_URL_INNER,

  PAGOPA_OPERATOR: {
    MAIL_ADDRESSES: getConfig('REACT_APP_OPERATOR_EMAIL_ADDRESSES', {required: true}),
  },

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
    TOKEN: env.get('REACT_APP_URL_API_TOKEN').required().asString(),
    BACKOFFICE: getConfig('REACT_APP_URL_BACKOFFICE', {required: true}),
  },

  MOCK: {
    TOKEN: getConfig('REACT_APP_API_MOCK_TOKEN', {required: true, type:Type.boolean}),
    BACKOFFICE: getConfig('REACT_APP_API_MOCK_BACKOFFICE', {required: true, type:Type.boolean}),
  },

  API_TIMEOUT_MS: {
    BACKOFFICE: env.get('REACT_APP_API_BACKOFFICE_TIMEOUT_MS').required().asInt(),
  },

  URL_INSTITUTION_LOGO: {
    PREFIX: env.get('REACT_APP_URL_INSTITUTION_LOGO_PREFIX').required().asString(),
    SUFFIX: env.get('REACT_APP_URL_INSTITUTION_LOGO_SUFFIX').required().asString(),
  },

  FEATURES: {
    DASHBOARD: {
      ENABLED: getConfig('REACT_APP_FEATURES_DASHBOARD_ENABLED', {default: false, type: Type.boolean}),
    },
    CHANNELS: {
      ENABLED: getConfig('REACT_APP_FEATURES_CHANNELS_ENABLED', {default: false, type: Type.boolean}),
    },
    STATIONS: {
      ENABLED: getConfig('REACT_APP_FEATURES_STATIONS_ENABLED', {default: false, type: Type.boolean}),
    },
    IBAN: {
      ENABLED: getConfig('REACT_APP_FEATURES_IBAN_ENABLED', {default: false, type: Type.boolean}),
    },
    COMMISSION_PACKAGES: {
      ENABLED: getConfig('REACT_APP_FEATURES_COMMISSION_PACKAGES_ENABLED', {default: false, type: Type.boolean}),
    },
    OPERATIONTABLE: {
      ENABLED: getConfig('REACT_APP_FEATURES_OPERATIONTABLE_ENABLED', {default: false, type: Type.boolean}),
    },
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

  HEADER: {
    LINK: {
      ROOTLINK: 'https://www.pagopa.it/',
      PRODUCTURL: '/dashboard',
    },
  },
};
