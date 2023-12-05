import { ChannelCodeResource } from '../api/generated/portal/ChannelCodeResource';
import { ChannelDetailsDto } from '../api/generated/portal/ChannelDetailsDto';
import { ChannelDetailsResource } from '../api/generated/portal/ChannelDetailsResource';
import { ChannelPspListResource } from '../api/generated/portal/ChannelPspListResource';
import { ChannelsResource } from '../api/generated/portal/ChannelsResource';
import { PspChannelPaymentTypes } from '../api/generated/portal/PspChannelPaymentTypes';
import { PspChannelPaymentTypesResource } from '../api/generated/portal/PspChannelPaymentTypesResource';
import { PspChannelsResource } from '../api/generated/portal/PspChannelsResource';
import { WrapperChannelsResource } from '../api/generated/portal/WrapperChannelsResource';
import { WrapperChannelDetailsDto } from '../api/generated/portal/WrapperChannelDetailsDto';
import { WrapperEntitiesOperations } from '../api/generated/portal/WrapperEntitiesOperations';
import { BackofficeApi } from '../api/BackofficeClient';
import { WfespPluginConfs } from '../api/generated/portal/WfespPluginConfs';
import { ChannelOnCreation } from '../model/Channel';
import {PaymentTypes} from "../api/generated/portal/PaymentTypes";
import {Delegation} from "../api/generated/portal/Delegation";
import {
  getChannels as getChannelsMocked,
  getChannelsMerged as getChannelsMergedMocked,
  getPSPChannels as getPSPChannelsMocked,
  createChannel as createChannelMocked,
  updateChannel as updateChannelMocked,
  getPaymentTypes as getPaymentTypesMocked,
  getChannelDetail as getChannelDetailMocked,
  getDelegatedPSPbyBroker as getDelegatedPSPbyBrokerMocked,
  getChannelPSPs as getChannelPSPsMocked,
  getChannelCode as getChannelCodeMocked,
  associatePSPtoChannel as associatePSPtoChannelMocked,
  dissociatePSPfromChannel as dissociatePSPfromChannelMocked,
  getWrapperChannel,
  createWrapperChannel,
  updateWrapperChannel,
  getWfespPlugins as mockedGetWfespPlugins,
} from './__mocks__/channelService';

export const getChannels = (page: number): Promise<ChannelsResource> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return getChannelsMocked(page);
  } else {
    return BackofficeApi.getChannels(page).then((resources) => resources);
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
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return getChannelsMergedMocked(page, brokerCode, channelcodefilter, limit, sorting);
  } else {
    return BackofficeApi.getChannelsMerged(page, brokerCode, channelcodefilter, limit, sorting).then(
      (resources) => resources
    );
  }
};

export const getChannelDetail = (channelcode: string): Promise<ChannelDetailsResource> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return getChannelDetailMocked(channelcode);
  } else {
    return BackofficeApi.getChannelDetail(channelcode).then((resources) => resources);
  }
};

export const getPSPChannels = (pspCode: string): Promise<PspChannelsResource> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return getPSPChannelsMocked(pspCode);
  } else {
    return BackofficeApi.getPSPChannels(pspCode).then((resources) => resources);
  }
};

export const getWfespPlugins = (): Promise<WfespPluginConfs> => {
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return mockedGetWfespPlugins();
  } else {
    return BackofficeApi.getWfespPlugins().then((resources) => resources);
  }
};

export const createChannel = (channel: ChannelOnCreation): Promise<ChannelDetailsResource> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return createChannelMocked(channel);
  } else {
    return BackofficeApi.createChannel(channel).then((resources) => resources);
  }
};

export const updateChannel = (
  code: string,
  channel: ChannelOnCreation
): Promise<ChannelDetailsResource> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return updateChannelMocked(code, channel);
  } else {
    return BackofficeApi.updateChannel(code, channel).then((resources) => resources);
  }
};

export const getPaymentTypes = (): Promise<PaymentTypes> => {
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return getPaymentTypesMocked();
  } else {
    return BackofficeApi.getPaymentTypes().then((resources) => resources);
  }
};

export const getChannelCode = (pspCode: string): Promise<ChannelCodeResource> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return getChannelCodeMocked(pspCode);
  } else {
    return BackofficeApi.getChannelCode(pspCode).then((resources) => resources);
  }
};

export const getChannelPSPs = (
  channelcode: string,
  page: number,
  limit?: number
): Promise<ChannelPspListResource> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return getChannelPSPsMocked(page);
  } else {
    return BackofficeApi.getChannelPSPs(channelcode, page, limit).then((resources) => resources);
  }
};

export const getDelegatedPSPbyBroker = (brokerId: string): Promise<Array<Delegation>> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return getDelegatedPSPbyBrokerMocked();
  } else {
    return BackofficeApi.getDelegatedPSPbyBroker(brokerId).then((resources) => resources);
  }
};

export const associatePSPtoChannel = (
  channelcode: string,
  pspcode: string,
  payment_type: PspChannelPaymentTypes
): Promise<PspChannelPaymentTypesResource> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return associatePSPtoChannelMocked(channelcode, pspcode, payment_type);
  } else {
    return BackofficeApi.associatePSPtoChannel(channelcode, pspcode, payment_type).then(
      (resources) => resources
    );
  }
};

export const dissociatePSPfromChannel = (channelcode: string, pspcode: string): Promise<void> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return dissociatePSPfromChannelMocked(channelcode, pspcode);
  } else {
    return BackofficeApi.dissociatePSPfromChannel(channelcode, pspcode).then((resources) => resources);
  }
};

export const getWrapperEntities = (pspCode: string): Promise<WrapperEntitiesOperations> => {
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return getWrapperChannel(pspCode);
  } else {
    return BackofficeApi.getWrapperEntities(pspCode).then((resources) => resources);
  }
};

export const createWrapperChannelDetails = (
  channel: WrapperChannelDetailsDto,
  validationUrl: string
): Promise<WrapperEntitiesOperations> => {
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return createWrapperChannel(channel, validationUrl);
  } else {
    return BackofficeApi.createWrapperChannelDetails(channel, validationUrl).then(
      (resources) => resources
    );
  }
};

export const updateWrapperChannelDetailsToCheck = (
  channel: ChannelDetailsDto,
  validationUrl: string
): Promise<WrapperEntitiesOperations> => {
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return updateWrapperChannel(channel, validationUrl);
  } else {
    return BackofficeApi.updateWrapperChannelDetailsToCheck(channel, validationUrl).then(
      (resources) => resources
    );
  }
};

export const updateWrapperChannelDetailsToCheckUpdate = (
  channel: ChannelDetailsDto,
  validationUrl: string
): Promise<WrapperEntitiesOperations> => {
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return updateWrapperChannel(channel, validationUrl);
  } else {
    return BackofficeApi.updateWrapperChannelDetailsToCheckUpdate(channel, validationUrl).then(
      (resources) => resources
    );
  }
};

export const updateWrapperChannelDetailsByOpt = (
  channel: ChannelDetailsDto,
  validationUrl: string
): Promise<WrapperEntitiesOperations> => {
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return updateWrapperChannel(channel, validationUrl);
  } else {
    return BackofficeApi.updateWrapperChannelDetailsByOpt(channel, validationUrl).then(
      (resources) => resources
    );
  }
};
