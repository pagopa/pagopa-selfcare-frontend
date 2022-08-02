import { ENV } from './utils/env';

export const BASE_ROUTE = ENV.PUBLIC_URL;

const ROUTES = {
  AUTH: `${BASE_ROUTE}/auth`,
  HOME: `${BASE_ROUTE}`,
  WIZARD: `${BASE_ROUTE}/wizard`,
};

export default ROUTES;
