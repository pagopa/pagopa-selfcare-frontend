import { ChannelDetailsResource } from '../api/generated/portal/ChannelDetailsResource';
import { ChannelsResource } from '../api/generated/portal/ChannelsResource';
import { PspChannelsResource } from '../api/generated/portal/PspChannelsResource';
import { PortalApi } from '../api/PortalApiClient';
import { ChannelOnCreation } from '../model/Channel';

import {
  getChannels as getChannelsMocked,
  getPSPChannels as getPSPChannelsMocked,
  createChannel as createChannelMocked,
} from './__mocks__/channelService';

export const getChannels = (page: number): Promise<ChannelsResource> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return getChannelsMocked(page);
  } else {
    return PortalApi.getChannels(page).then((resources) => resources);
  }
};

export const getChannelsByPspCode = (pspCode: string): Promise<PspChannelsResource> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return getPSPChannelsMocked(pspCode);
  } else {
    return PortalApi.getPSPChannels(pspCode).then((resources) => resources);
  }
};

export const createChannel = (channel: ChannelOnCreation): Promise<ChannelDetailsResource> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return createChannelMocked(channel);
  } else {
    return PortalApi.createChannel(channel).then((resources) => resources);
  }
};
