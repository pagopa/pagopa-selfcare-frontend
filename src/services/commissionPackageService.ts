import { PortalApi } from '../api/PortalApiClient';
import { getChannelsMerged as getChannelsMergedMocked } from '../services/__mocks__/channelService';

// FIXME: use the get that returns the channels associated to PSP
export const getChannelsIdAssociatedToPSP = (
  page: number,
  brokerCode: string,
  channelcodefilter?: string,
  limit?: number,
  sorting?: string
): Promise<Array<string>> => {
  if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return getChannelsMergedMocked(page, brokerCode, channelcodefilter, limit, sorting).then(
      (resources) =>
        resources.channels.map((e) => (e.channel_code !== undefined ? e.channel_code : ''))
    );
  } else {
    return PortalApi.getChannelsMerged(page, brokerCode, channelcodefilter, limit, sorting).then(
      (resources) =>
        resources.channels.map((e) => (e.channel_code !== undefined ? e.channel_code : ''))
    );
  }
};
