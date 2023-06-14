import { ChannelCodeResource } from '../api/generated/portal/ChannelCodeResource';
import { ChannelDetailsResource } from '../api/generated/portal/ChannelDetailsResource';
import { ChannelPspListResource } from '../api/generated/portal/ChannelPspListResource';
import { ChannelsResource } from '../api/generated/portal/ChannelsResource';
import { PaymentTypesResource } from '../api/generated/portal/PaymentTypesResource';
import { PspChannelPaymentTypes } from '../api/generated/portal/PspChannelPaymentTypes';
import { PspChannelPaymentTypesResource } from '../api/generated/portal/PspChannelPaymentTypesResource';
import { PspChannelsResource } from '../api/generated/portal/PspChannelsResource';
import { WrapperChannelsResource } from '../api/generated/portal/WrapperChannelsResource';
import { PortalApi } from '../api/PortalApiClient';
import { ChannelOnCreation } from '../model/Channel';
import { PSP } from '../model/PSP';

import {
  getChannels as getChannelsMocked,
  getChannelsMerged as getChannelsMergedMocked,
  getPSPChannels as getPSPChannelsMocked,
  createChannel as createChannelMocked,
  updateChannel as updateChannelMocked,
  getPaymentTypes as getPaymentTypesMocked,
  getChannelDetail as getChannelDetailMocked,
  getChannelAvailablePSP as getChannelAvailablePSPMocked,
  getChannelPSPs as getChannelPSPsMocked,
  getChannelCode as getChannelCodeMocked,
  associatePSPtoChannel as associatePSPtoChannelMocked,
  dissociatePSPfromChannel as dissociatePSPfromChannelMocked,
} from './__mocks__/channelService';

export const getChannels = (page: number): Promise<ChannelsResource> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return getChannelsMocked(page);
  } else {
    return PortalApi.getChannels(page).then((resources) => resources);
  }
};

export const getChannelsMerged = (
  page: number,
  brokerCode: string,
  channelcodefilter?: string,
  limit?: number,
  sorting?: string
): Promise<WrapperChannelsResource> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return getChannelsMergedMocked(page, brokerCode, channelcodefilter, limit, sorting);
  } else {
    return PortalApi.getChannelsMerged(page, brokerCode, channelcodefilter, limit, sorting).then(
      (resources) => resources
    );
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

export const getPSPChannels = (pspCode: string): Promise<PspChannelsResource> => {
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

export const updateChannel = (channel: ChannelOnCreation): Promise<ChannelDetailsResource> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return updateChannelMocked(channel);
  } else {
    return PortalApi.updateChannel(channel).then((resources) => resources);
  }
};

export const getPaymentTypes = (): Promise<PaymentTypesResource> => {
  if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return getPaymentTypesMocked();
  } else {
    return PortalApi.getPaymentTypes().then((resources) => resources);
  }
};

export const getChannelCode = (pspCode: string): Promise<ChannelCodeResource> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return getChannelCodeMocked(pspCode);
  } else {
    return PortalApi.getChannelCode(pspCode).then((resources) => resources);
  }
};

export const getChannelPSPs = (
  channelcode: string,
  page: number,
  limit?: number
): Promise<ChannelPspListResource> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return getChannelPSPsMocked(page);
  } else {
    return PortalApi.getChannelPSPs(channelcode, page, limit).then((resources) => resources);
  }
};

export const getChannelAvailablePSP = (): Promise<Array<PSP>> =>
  /* istanbul ignore if */
  /* if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return getChannelAvailablePSPMocked(page);
  } else {
    return PortalApi.getChannelAvailablePSP(page).then((resources) => resources);
  } */
  getChannelAvailablePSPMocked();

export const associatePSPtoChannel = (
  channelcode: string,
  pspcode: string,
  payment_type: PspChannelPaymentTypes
): Promise<PspChannelPaymentTypesResource> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return associatePSPtoChannelMocked(channelcode, pspcode, payment_type);
  } else {
    return PortalApi.associatePSPtoChannel(channelcode, pspcode, payment_type).then(
      (resources) => resources
    );
  }
};

export const dissociatePSPfromChannel = (channelcode: string, pspcode: string): Promise<void> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return dissociatePSPfromChannelMocked(channelcode, pspcode);
  } else {
    return PortalApi.dissociatePSPfromChannel(channelcode, pspcode).then((resources) => resources);
  }
};
