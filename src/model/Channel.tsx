import {
    ChannelDetailsDto,
    Payment_modelEnum,
    ProtocolEnum,
    Redirect_protocolEnum,
} from '../api/generated/portal/ChannelDetailsDto';
import {StatusEnum} from '../api/generated/portal/WrapperChannelDetailsDto';

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
