import { Redirect_protocolEnum } from '../api/generated/portal/ChannelDetailsDto';

export type ChannelOnCreation = {
  pspBrokerCode: string;
  businessName: string;
  idChannel: string;
  redirectProtocol: Redirect_protocolEnum | undefined;
  redirectPort: number | undefined;
  redirectIp: string;
  redirectService: string;
  redirectParameters: string;
  targetAddress: string;
  targetService: string;
  targetPort: number | undefined;
  paymentType: string;
};
