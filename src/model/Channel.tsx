import { ChannelDetailsDto, ProtocolEnum } from '../api/generated/portal/ChannelDetailsDto';
import { ENV } from '../utils/env';

export type ChannelStatus = 'ACTIVE' | 'REVISION' | 'NEEDCORRECTION';

export enum FormAction {
  Create = 'create',
  Edit = 'edit',
  Duplicate = 'duplicate',
}

export type ChannelExtraInfo = {
  targetUnion: string;
  newConnection: string;
  proxyUnion: string;
};

export type ChannelOnCreation = ChannelDetailsDto & ChannelExtraInfo;

export type Channel = {
  channel_code: string;
  enabled: boolean;
  status: ChannelStatus;
  broker_description: string;
};

export type Channels = {
  channelsArray: Array<Channel>;
  page_info: {
    items_found?: number | undefined;
    limit?: number | undefined;
    page?: number | undefined;
    total_pages?: number | undefined;
  };
};

export const forwarder01 =
  ENV.ENV === 'PROD'
    ? 'https://api.platform.pagopa.it/pagopa-node-forwarder/api/v1/forward'
    : 'https://api.uat.platform.pagopa.it/pagopa-node-forwarder/api/v1/forward';

export const isNewConnectivity = ({
  protocol,
  ip,
  service,
}: {
  protocol?: ProtocolEnum;
  ip?: string;
  service?: string;
}): boolean =>
  Boolean(
    `${protocol === ProtocolEnum.HTTPS ? 'https://' : 'http://'}${ip}${service}` === forwarder01
  );

/*
export const channelsResource2Channel = (channelsResource: ChannelsResource): Channels => ({
  channelsArray: channelsResource.channels,
  page_info: channelsResource.page_info,
  
    channels: channelsResource.channels.map((channelResource) =>{
        channel_code: channelResource.channel_code ?? '',
        enabled: channelResource.enabled ?? true,
        channelStatus: channelResource.enabled ? 'ACTIVE' : 'REVISION',
        broker_description: channelResource.broker_description ?? '',
      };
    ),
    page_info: channelsResource.page_info,
});
*/
