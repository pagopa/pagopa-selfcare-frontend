import { BackofficeApi } from '../api/BackofficeClient';
import { ChannelCodeResource } from '../api/generated/portal/ChannelCodeResource';
import { ChannelDetailsDto } from '../api/generated/portal/ChannelDetailsDto';
import { ChannelDetailsResource } from '../api/generated/portal/ChannelDetailsResource';
import { ChannelPspListResource } from '../api/generated/portal/ChannelPspListResource';
import { PspChannelPaymentTypes } from '../api/generated/portal/PspChannelPaymentTypes';
import { PspChannelPaymentTypesResource } from '../api/generated/portal/PspChannelPaymentTypesResource';
import { PspChannelsResource } from '../api/generated/portal/PspChannelsResource';
import { WfespPluginConfs } from '../api/generated/portal/WfespPluginConfs';
import { WrapperChannelDetailsDto } from '../api/generated/portal/WrapperChannelDetailsDto';
import { WrapperChannelsResource } from '../api/generated/portal/WrapperChannelsResource';
import { WrapperEntities } from '../api/generated/portal/WrapperEntities';
import { ChannelOnCreation } from '../model/Channel';

import { ConfigurationStatus } from '../model/Station';
import {
  associatePSPtoChannel as associatePSPtoChannelMocked,
  createChannel as createChannelMocked,
  createWrapperChannel,
  dissociatePSPfromChannel as dissociatePSPfromChannelMocked,
  getChannelCode as getChannelCodeMocked,
  getChannelDetail as getChannelDetailMocked,
  getChannelPSPs as getChannelPSPsMocked,
  getChannels as getChannelsMocked,
  getPSPChannels as getPSPChannelsMocked,
  getWfespPlugins as mockedGetWfespPlugins,
  updateChannel as updateChannelMocked,
  updateWrapperChannel,
  updateWrapperChannelWithOperatorReview as updateWrapperChannelWithOperatorReviewMocked,
} from './__mocks__/channelService';

// /channels endpoint

export const getChannels = ({
  status,
  channelCode,
  brokerCode,
  limit,
  page,
}: {
  status: ConfigurationStatus;
  channelCode?: string;
  brokerCode: string;
  limit?: number;
  page?: number;
}): Promise<WrapperChannelsResource> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return getChannelsMocked(page ?? 0);
  } else {
    return BackofficeApi.getChannels({ status, brokerCode, channelCode, limit, page }).then(
      (resources) => resources
    );
  }
};

export const getChannelDetail = ({
  channelCode,
  status,
}: {
  channelCode: string;
  status: ConfigurationStatus;
}): Promise<ChannelDetailsResource> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return getChannelDetailMocked(channelCode);
  } else {
    return BackofficeApi.getChannelDetail({ channelCode, status }).then((resources) => resources);
  }
};

export const getPSPChannels = (taxCode: string): Promise<PspChannelsResource> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return getPSPChannelsMocked(taxCode);
  } else {
    return BackofficeApi.getPSPChannels(taxCode).then((resources) => resources);
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

export const getChannelCode = (taxCode: string): Promise<ChannelCodeResource> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return getChannelCodeMocked(taxCode);
  } else {
    return BackofficeApi.getChannelCode(taxCode).then((resources) => resources);
  }
};

export const getChannelPSPs = (
  channelcode: string,
  pspName: string,
  page: number,
  limit?: number
): Promise<ChannelPspListResource> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return getChannelPSPsMocked(page);
  } else {
    return BackofficeApi.getChannelPSPs(channelcode, pspName, page, limit).then(
      (resources) => resources
    );
  }
};

export const associatePSPtoChannel = (
  channelcode: string,
  taxcode: string,
  payment_type: PspChannelPaymentTypes
): Promise<PspChannelPaymentTypesResource> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return associatePSPtoChannelMocked(channelcode, taxcode, payment_type);
  } else {
    return BackofficeApi.associatePSPtoChannel(channelcode, taxcode, payment_type).then(
      (resources) => resources
    );
  }
};

export const dissociatePSPfromChannel = (
  channelcode: string,
  pspTaxCode: string
): Promise<void> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return dissociatePSPfromChannelMocked(channelcode, pspTaxCode);
  } else {
    return BackofficeApi.dissociatePSPfromChannel(channelcode, pspTaxCode).then(
      (resources) => resources
    );
  }
};

export const createWrapperChannelDetails = (
  channel: WrapperChannelDetailsDto,
  validationUrl: string
): Promise<WrapperEntities> => {
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return createWrapperChannel(channel, validationUrl);
  } else {
    return BackofficeApi.createWrapperChannelDetails(channel, validationUrl).then(
      (resources) => resources
    );
  }
};

export const updateWrapperChannelDetails = ({
  channelCode,
  channel,
  validationUrl,
}: {
  channelCode: string;
  channel: ChannelDetailsDto;
  validationUrl: string;
}): Promise<WrapperEntities> => {
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return updateWrapperChannel(channel, validationUrl);
  } else {
    return BackofficeApi.updateWrapperChannelDetails({ channelCode, channel, validationUrl }).then(
      (resources) => resources
    );
  }
};

export const updateWrapperChannelWithOperatorReview = ({
  channelCode,
  brokerPspCode,
  note,
}: {
  channelCode: string;
  brokerPspCode: string;
  note: string;
}): Promise<ChannelDetailsResource> => {
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return updateWrapperChannelWithOperatorReviewMocked(channelCode, note);
  } else {
    return BackofficeApi.updateWrapperChannelWithOperatorReview({
      channelCode,
      brokerPspCode,
      note,
    }).then((resources) => resources);
  }
};
