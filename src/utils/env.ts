import * as env from 'env-var';
import { getConfig, Type } from "./config";

export const ENV = {
    ENV: env.get('REACT_APP_ENV').required().default('dev').asString(),
    PUBLIC_URL: getConfig('REACT_APP_PUBLIC_URL', { default: 'ui' }),

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
        BACKOFFICE: getConfig('REACT_APP_URL_BACKOFFICE', { required: true }),
        REACT_APP_URL_BETA: getConfig('REACT_APP_URL_BETA', { default: false, type: Type.boolean }),
    },

    MOCK: {
        TOKEN: getConfig('REACT_APP_API_MOCK_TOKEN', { required: true, type: Type.boolean }),
        BACKOFFICE: getConfig('REACT_APP_API_MOCK_BACKOFFICE', { required: true, type: Type.boolean }),
        SELFCARE: getConfig('REACT_APP_API_MOCK_BACKOFFICE', { required: true, type: Type.boolean }),
    },

    API_TIMEOUT_MS: {
        BACKOFFICE: env.get('REACT_APP_API_BACKOFFICE_TIMEOUT_MS').required().asInt(),
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
        API_HOST: env.get('REACT_APP_MIXPANEL_API_HOST').default('https://api-eu.mixpanel.com').asString(),
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
                SERVICE_STARTING_DATE: new Date(env.get('SETTINGS_SERVICES_RTP_START_DATE').default("2026-03-01T00:00:00.000+01:00").asString())
            },
            SANP_URL: env.get('SETTINGS_SERVICES_SANP_URL').default("https://developer.pagopa.it/pago-pa/guides/sanp/3.10.0/ente-creditore/sepa-rtp-request-to-pay").asString(),
            RTP_OVERVIEW_URL: env.get('SETTINGS_SERVICES_RTP_OVERVIEW_URL').default("https://developer.pagopa.it/srtp/overview").asString()
        }
    }
};

