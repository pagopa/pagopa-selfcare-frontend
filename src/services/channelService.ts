import { ChannelsResource } from '../api/generated/portal/ChannelsResource';
import { PortalApi } from '../api/PortalApiClient';

import { getChannels as getChannelsMocked } from './__mocks__/channelService';

export const getChannels = (page: number): Promise<ChannelsResource> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return getChannelsMocked(page);
  } else {
    return PortalApi.getChannels(page).then((resources) => resources);
  }
};
