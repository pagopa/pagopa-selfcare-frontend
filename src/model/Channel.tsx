import {
  Payment_modelEnum,
  ProtocolEnum,
  Redirect_protocolEnum,
} from '../api/generated/portal/ChannelDetailsDto';

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
  paymentType: Array<string>;
  primitiveVersion: string;
  password: string;
  new_password: string;
  protocol: ProtocolEnum | undefined;
  ip: string;
  port: number | undefined;
  service: string;
  npm_service: string;
  proxy_host: string;
  proxy_port: number | undefined;
  payment_model: Payment_modelEnum | undefined;
  serv_plugin: string;
  thread_number: number | undefined;
  timeout_a: number | undefined;
  timeout_b: number | undefined;
  timeout_c: number | undefined;
  psp_notify_payment: boolean;
  rt_push: boolean;
  rpt_carousel: boolean;
  recovery: boolean;
  digital_stamp_brand: boolean;
  on_us: boolean;
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
