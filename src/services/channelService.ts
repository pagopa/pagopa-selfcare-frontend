import { ChannelDetailsResource } from '../api/generated/portal/ChannelDetailsResource';
import { ChannelsResource } from '../api/generated/portal/ChannelsResource';
import { PaymentTypesResource } from '../api/generated/portal/PaymentTypesResource';
import { PspChannelsResource } from '../api/generated/portal/PspChannelsResource';
import { PortalApi } from '../api/PortalApiClient';
import { ChannelOnCreation } from '../model/Channel';

import {
  getChannels as getChannelsMocked,
  getPSPChannels as getPSPChannelsMocked,
  createChannel as createChannelMocked,
  getPaymentTypes as getPaymentTypesMocked,
  getChannelDetail as getChannelDetailMocked,
  getChannelPSPsMocked,
} from './__mocks__/channelService';

export const getChannels = (page: number): Promise<ChannelsResource> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return getChannelsMocked(page);
  } else {
    return PortalApi.getChannels(page).then((resources) => resources);
  }
};

export const getChannelDetail = (channelcode: string): Promise<ChannelDetailsResource> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return getChannelDetailMocked(channelcode);
  } else {
    return PortalApi.getChannelDetail(channelcode).then((resources) => resources);
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

export const getPaymentTypes = (): Promise<PaymentTypesResource> => {
  if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return getPaymentTypesMocked();
  } else {
    return PortalApi.getPaymentTypes().then((resources) => resources);
  }
};

export const getChannelPSPs = (page: number): Promise<ChannelsResource> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return getChannelPSPsMocked(page);
  } else {
    return PortalApi.getChannelPSPs(page).then((resources) => resources);
  }
};
