import { getConfig, Type } from './config';

export const ENV = {
  ENV: getConfig('REACT_APP_ENV', { default: 'dev' }),
  PUBLIC_URL: getConfig('REACT_APP_PUBLIC_URL', { default: 'ui' }),

  ASSISTANCE: {
    EMAIL: getConfig('REACT_APP_PAGOPA_HELP_EMAIL', { required: true }),
  },

  URL_FE: {
    LOGIN: getConfig('REACT_APP_URL_FE_LOGIN', { required: true }),
    LOGOUT: getConfig('REACT_APP_URL_FE_LOGOUT', { required: true }),
    LANDING: getConfig('REACT_APP_URL_FE_LANDING', { required: true }),
    ASSISTANCE: getConfig('REACT_APP_URL_FE_ASSISTANCE', { required: true }),
    SELFCARE: getConfig('REACT_APP_URL_FE_SELFCARE', { required: true }),
    TOKEN_EXCHANGE: getConfig('REACT_APP_URL_FE_TOKEN_EXCHANGE', { required: true }),
  },

  URL_API: {
    TOKEN: getConfig('REACT_APP_URL_API_TOKEN', { required: true }),
    BACKOFFICE: getConfig('REACT_APP_URL_BACKOFFICE', { required: true }),
    REACT_APP_URL_BETA: getConfig('REACT_APP_URL_BETA', { default: false, type: Type.boolean }),
  },

  MOCK: {
    TOKEN: getConfig('REACT_APP_API_MOCK_TOKEN', { required: true, type: Type.boolean }),
    BACKOFFICE: getConfig('REACT_APP_API_MOCK_BACKOFFICE', { required: true, type: Type.boolean }),
    SELFCARE: getConfig('REACT_APP_API_MOCK_BACKOFFICE', { required: true, type: Type.boolean }),
  },

  API_TIMEOUT_MS: {
    BACKOFFICE: getConfig('REACT_APP_API_BACKOFFICE_TIMEOUT_MS', {
      required: true,
      type: Type.int,
    }),
  },

  URL_INSTITUTION_LOGO: {
    PREFIX: getConfig('REACT_APP_URL_INSTITUTION_LOGO_PREFIX', { required: true }),
    SUFFIX: getConfig('REACT_APP_URL_INSTITUTION_LOGO_SUFFIX', { required: true }),
  },

  ANALYTCS: {
    ENABLE: getConfig('REACT_APP_ANALYTICS_ENABLE', {
      default: false,
      type: Type.boolean,
    }),
    MOCK: getConfig('REACT_APP_ANALYTICS_MOCK', {
      default: false,
      type: Type.boolean,
    }),
    DEBUG: getConfig('REACT_APP_ANALYTICS_DEBUG', {
      default: false,
      type: Type.boolean,
    }),
    TOKEN: getConfig('REACT_APP_MIXPANEL_TOKEN', { required: true }),
    API_HOST: getConfig('REACT_APP_MIXPANEL_API_HOST', {
      default: 'https://api-eu.mixpanel.com',
    }),
  },

  HEADER: {
    LINK: {
      ROOTLINK: 'https://www.pagopa.it/',
      PRODUCTURL: '/dashboard',
    },
  },
  SETTINGS: {
    SERVICES: {
      RTP: {
        SERVICE_STARTING_DATE: new Date(
          getConfig('SETTINGS_SERVICES_RTP_START_DATE', {
            default: '2026-03-01T00:00:00.000+01:00',
          })
        ),
      },
      SANP_URL: getConfig('SETTINGS_SERVICES_SANP_URL', {
        default:
          'https://developer.pagopa.it/pago-pa/guides/sanp/3.10.0/ente-creditore/sepa-rtp-request-to-pay',
      }),
      RTP_OVERVIEW_URL: getConfig('SETTINGS_SERVICES_RTP_OVERVIEW_URL', {
        default: 'https://developer.pagopa.it/srtp/overview',
      }),
    },
  },
};
