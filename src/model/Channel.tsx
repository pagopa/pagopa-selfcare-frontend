import { Redirect_protocolEnum } from '../api/generated/portal/ChannelDetailsDto';

export type ChannelStatus = 'ACTIVE' | 'REVISION' | 'NEEDCORRECTION';

export enum FormAction {
  Create = 'create',
  Edit = 'edit',
  Duplicate = 'duplicate',
}

export type ChannelOnCreation = {
  pspBrokerCode: string;
  businessName: string;
  idChannel: string;
  redirectProtocol: Redirect_protocolEnum | undefined;
  redirectPort?: number | undefined;
  redirectIp: string;
  redirectService: string;
  redirectParameters: string;
  targetAddress: string;
  targetService: string;
  targetPort: number | undefined;
  paymentType: string;
};

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
