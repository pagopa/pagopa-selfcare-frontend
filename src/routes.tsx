// import { TOS } from './pages/tos/TOS';
import { ENV } from './utils/env';

export const BASE_ROUTE = ENV.PUBLIC_URL;

const ROUTES = {
  AUTH: `${BASE_ROUTE}/auth`,
  HOME: `${BASE_ROUTE}`,
  WIZARD: `${BASE_ROUTE}/wizard`,
  TOS: `${BASE_ROUTE}/terms-of-service`,
  CREATE_APIKEY: `${BASE_ROUTE}/add-apikey`,
  CHANNELS: `${BASE_ROUTE}/channels`,
  CHANNEL_DETAIL: `${BASE_ROUTE}/channels/:channelId`,
  CREATE_CHANNEL: `${BASE_ROUTE}/channels/add-channel`,

  /* TOS: {
    PATH: '/terms-of-service',
    LABEL: { it: 'Termini di servizio', en: 'Terms of service' },
    COMPONENT: TOS,
    PUBLIC: true,
    AUTH_LEVELS: 'any',
  }, */
};

export default ROUTES;
