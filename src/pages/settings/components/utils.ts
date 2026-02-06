import { ENV } from "../../../utils/env";

export const rtpServiceStartingTimestamp = (): number =>  ENV.SETTINGS.SERVICES.RTP.SERVICE_STARTING_DATE.getTime();
export const URLS = {
  SANP_URL: ENV.SETTINGS.SERVICES.SANP_URL,
  RTP_OVERVIEW_URL: ENV.SETTINGS.SERVICES.RTP_OVERVIEW_URL,
};