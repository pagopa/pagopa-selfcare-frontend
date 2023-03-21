// import { TOS } from './pages/tos/TOS';
import { ENV } from './utils/env';

export const BASE_ROUTE = ENV.PUBLIC_URL;

const ROUTES = {
  AUTH: `${BASE_ROUTE}/auth`,
  HOME: `${BASE_ROUTE}`,
  NODE_SIGNIN: `${BASE_ROUTE}/node-signin`,
  TOS: `${BASE_ROUTE}/terms-of-service`,
  APIKEYS: `${BASE_ROUTE}/api-keys`,
  APIKEYS_CREATE: `${BASE_ROUTE}/add-apikey`,
  CHANNELS: `${BASE_ROUTE}/channels`,
  CHANNEL_DETAIL: `${BASE_ROUTE}/channels/:channelId`,
  CHANNEL_EDIT: `${BASE_ROUTE}/channels/:channelId/:actionId`,
  CHANNEL_PSP_LIST: `${BASE_ROUTE}/channels/:channelId/psp-list`,
  CHANNEL_ASSOCIATE_PSP: `${BASE_ROUTE}/channels/:channelId/associate-psp`,
  CHANNEL_ADD: `${BASE_ROUTE}/channels/add-channel/`,

  /* TOS: {
    PATH: '/terms-of-service',
    LABEL: { it: 'Termini di servizio', en: 'Terms of service' },
    COMPONENT: TOS,
    PUBLIC: true,
    AUTH_LEVELS: 'any',
  }, */
};

export default ROUTES;
