import { ChannelCodeResource } from '../../api/generated/portal/ChannelCodeResource';
import {
  Payment_modelEnum,
  ProtocolEnum,
  Redirect_protocolEnum,
} from '../../api/generated/portal/ChannelDetailsDto';
import { ChannelDetailsResource } from '../../api/generated/portal/ChannelDetailsResource';
import { ChannelPspListResource } from '../../api/generated/portal/ChannelPspListResource';
import { ChannelsResource } from '../../api/generated/portal/ChannelsResource';
import { PaymentTypesResource } from '../../api/generated/portal/PaymentTypesResource';
import { PspChannelPaymentTypes } from '../../api/generated/portal/PspChannelPaymentTypes';
import { PspChannelPaymentTypesResource } from '../../api/generated/portal/PspChannelPaymentTypesResource';
import { PspChannelsResource } from '../../api/generated/portal/PspChannelsResource';
import { WrapperStatusEnum } from '../../api/generated/portal/WrapperChannelResource';
import { WrapperChannelsResource } from '../../api/generated/portal/WrapperChannelsResource';
import { ChannelOnCreation } from '../../model/Channel';
import { PSP } from '../../model/PSP';

export const mockedChannels: ChannelsResource = {
  channels: [
    {
      channel_code: 'XPAY_03_ONUS',
      enabled: true,
      broker_description: 'Intermediario XPAY',
    },
    {
      channel_code: 'XPAY_03',
      enabled: true,
      broker_description: 'Intermediario XPAY',
    },
    {
      channel_code: 'WFESP_07_tot',
      enabled: true,
      broker_description: 'Intermediario per test WFESP',
    },
    {
      channel_code: 'WFESP_07_salvo',
      enabled: false,
      broker_description: 'Intermediario per test WFESP',
    },
    {
      channel_code: 'WFESP_07_ila',
      enabled: true,
      broker_description: 'Intermediario per test WFESP',
    },
  ],
  page_info: {
    page: 0,
    limit: 50,
    items_found: 50,
    total_pages: 8,
  },
};

export const mockedPSPChannels: PspChannelsResource = {
  channels: [
    {
      channel_code: 'XPAY_03_ONUS',
      enabled: true,
      payment_types: [],
    },
    {
      channel_code: 'XPAY_03',
      enabled: false,
      payment_types: [],
    },
    {
      channel_code: 'WFESP_07_tot',
      enabled: true,
      payment_types: [],
    },
  ],
};

export const mockedPaymentTypes: PaymentTypesResource = {
  payment_types: [
    {
      description: 'PostePay',
      payment_type: 'PPAY',
    },
    {
      description: 'Bonifico',
      payment_type: 'SEPA',
    },
  ],
};

export const mockedChannel: ChannelOnCreation = {
  pspBrokerCode: 'broker_psp_code',
  businessName: 'business_name',
  idChannel: 'id_channel',
  redirectProtocol: Redirect_protocolEnum.HTTPS,
  redirectParameters: 'reirect_parameters',
  redirectIp: 'redirect_ip',
  redirectService: 'redirect_service',
  redirectPort: 8080,
  targetAddress: 'target_addres',
  targetPort: 8081,
  targetService: 'target_service',
  paymentType: mockedPaymentTypes.payment_types[0].description,
  primitiveVersion: '01',
  password: 'password',
  new_password: 'new_password',
  protocol: ProtocolEnum.HTTPS,
  ip: 'ip',
  port: 3000,
  service: 'service',
  npm_service: 'npm_service',
  proxy_host: 'proxy_host',
  proxy_port: 3001,
  payment_model: Payment_modelEnum.ACTIVATED_AT_PSP,
  thread_number: 3,
  timeout_a: 1000,
  timeout_b: 2000,
  timeout_c: 3000,
  psp_notify_payment: false,
  rt_push: false,
  rpt_carousel: false,
  recovery: false,
  digital_stamp_brand: false,
  on_us: false,
};
export const mockedStationsMerged: WrapperChannelsResource = {
  page_info: {
    page: 0,
    limit: 10,
    items_found: 5,
    total_pages: 1,
  },
  channels: [
    {
      channel_code: '97735020584_01',
      createdAt: new Date('2023-05-04T17:52:33.993Z'),
      wrapperStatus: WrapperStatusEnum.APPROVED,
      broker_description: 'ICONTO S.R.L.',
    },
    {
      channel_code: '97735020584_02',
      createdAt: new Date('2023-05-04T17:52:33.993Z'),
      wrapperStatus: WrapperStatusEnum.TO_CHECK,
      broker_description: 'ICONTO S.R.L.',
    },
    {
      channel_code: '97735020584_03',
      createdAt: new Date('2023-05-04T17:52:33.993Z'),
      wrapperStatus: WrapperStatusEnum.TO_CHECK_UPDATE,
      broker_description: 'ICONTO S.R.L.',
    },
    {
      channel_code: '97735020584_04',
      createdAt: new Date('2023-05-04T17:52:33.993Z'),
      wrapperStatus: WrapperStatusEnum.TO_FIX,
      broker_description: 'ICONTO S.R.L.',
    },
    {
      channel_code: '97735020584_05',
      createdAt: new Date('2023-05-04T17:52:33.993Z'),
      wrapperStatus: WrapperStatusEnum.TO_FIX_UPDATE,
      broker_description: 'ICONTO S.R.L.',
    },
  ],
};

export const mockedChannelDetail = (channel_code: string): ChannelDetailsResource => ({
  agid: true,
  broker_description: 'broker_description',
  broker_psp_code: 'broker_psp_code',
  card_chart: true,
  channel_code,
  digital_stamp_brand: true,
  enabled: false,
  flag_io: true,
  ip: 'ip',
  new_fault_code: true,
  new_password: 'new_password',
  nmp_service: 'nmp_service',
  on_us: true,
  password: 'password',
  payment_model: Payment_modelEnum.ACTIVATED_AT_PSP,
  payment_types: ['PPAY'],
  port: 8080,
  primitive_version: 'primitive_version',
  protocol: ProtocolEnum.HTTPS,
  proxy_enabled: true,
  proxy_host: 'proxy_host',
  proxy_password: 'proxy_password',
  proxy_port: 8080,
  proxy_username: 'proxy_username',
  recovery: true,
  redirect_ip: 'redirect_ip',
  redirect_path: 'redirect_path',
  redirect_port: 8080,
  redirect_protocol: Redirect_protocolEnum.HTTPS,
  redirect_query_string: 'redirect_query_string',
  rt_push: true,
  serv_plugin: 'serv_plugin',
  service: 'service',
  target_host: 'target_host',
  target_path: 'target_path',
  target_port: 8080,
  thread_number: 1,
  timeout_a: 1000,
  timeout_b: 2000,
  timeout_c: 3000,
});

export const mockedChannelPSPs: ChannelPspListResource = {
  payment_service_providers: [
    {
      psp_code: '14847241001',
      business_name: 'PSP S.p.A.',
      enabled: true,
      payment_types: ['MYBK'],
    },
    {
      psp_code: '14847241002',
      business_name: 'PSP2 S.p.A.',
      enabled: true,
      payment_types: ['PPAY'],
    },
    {
      psp_code: '14847241003',
      business_name: 'PSP3 S.p.A.',
      enabled: false,
      payment_types: ['STP'],
    },
    {
      psp_code: '14847241004',
      business_name: 'PSP4 S.p.A.',
      enabled: false,
      payment_types: ['STP'],
    },
    {
      psp_code: '14847241005',
      business_name: 'PSP5 S.p.A.',
      enabled: true,
      payment_types: ['STP'],
    },
  ],
  page_info: {
    page: 0,
    limit: 5,
    items_found: 8,
    total_pages: 2,
  },
};
export const mockedChannelPSPsPage2: ChannelPspListResource = {
  payment_service_providers: [
    {
      psp_code: '14847241006',
      business_name: 'PSP6 S.p.A.',
      enabled: true,
      payment_types: ['MYBK'],
    },
    {
      psp_code: '14847241007',
      business_name: 'PSP7 S.p.A.',
      enabled: true,
      payment_types: ['PPAY'],
    },
    {
      psp_code: '14847241008',
      business_name: 'PSP8 S.p.A.',
      enabled: true,
      payment_types: ['STP'],
    },
  ],
  page_info: {
    page: 1,
    limit: 5,
    items_found: 8,
    total_pages: 2,
  },
};

export const mockedChannelAvailablePSP: Array<PSP> = [
  {
    broker_psp_code: '0000001',
    description: 'Intesa San Paolo S.P.A',
    enabled: true,
    extended_fault_bean: true,
  },
  {
    broker_psp_code: '0000002',
    description: 'Sogei',
    enabled: true,
    extended_fault_bean: true,
  },
  {
    broker_psp_code: '0000003',
    description: 'BNP',
    enabled: true,
    extended_fault_bean: true,
  },
  {
    broker_psp_code: '0000004',
    description: 'Banca Nazionale',
    enabled: true,
    extended_fault_bean: true,
  },
  {
    broker_psp_code: '0000005',
    description: 'Banca Regionale',
    enabled: true,
    extended_fault_bean: true,
  },
  {
    broker_psp_code: '0000006',
    description: 'Banca Estera',
    enabled: true,
    extended_fault_bean: true,
  },
];

const channelCode: ChannelCodeResource = {
  channel_code: '1231231231',
};

export const getChannels = (_page: number): Promise<ChannelsResource> =>
  new Promise((resolve) => resolve(mockedChannels));

export const getChannelsMerged = (
  _page: number,
  _brokerCode: string,
  _stationcode?: string,
  _limit?: number,
  _sorting?: string
): Promise<WrapperChannelsResource> => new Promise((resolve) => resolve(mockedStationsMerged));

export const getChannelCode = (_pspCode: string): Promise<ChannelCodeResource> =>
  new Promise((resolve) => resolve(channelCode));

export const getChannelDetail = (channelcode: string): Promise<ChannelDetailsResource> =>
  new Promise((resolve) => resolve(mockedChannelDetail(channelcode)));

export const getPSPChannels = (_pspCode: string): Promise<PspChannelsResource> =>
  new Promise((resolve) => resolve(mockedPSPChannels));

export const createChannel = (_channel: ChannelOnCreation): Promise<ChannelDetailsResource> =>
  new Promise((resolve) => resolve(mockedChannel));

export const updateChannel = (_channel: ChannelOnCreation): Promise<ChannelDetailsResource> =>
  new Promise((resolve) => resolve(mockedChannel));

export const getPaymentTypes = (): Promise<PaymentTypesResource> =>
  new Promise((resolve) => resolve(mockedPaymentTypes));

export const getChannelPSPs = (page: number): Promise<ChannelPspListResource> =>
  new Promise((resolve) => resolve(page === 0 ? mockedChannelPSPs : mockedChannelPSPsPage2));

export const getChannelAvailablePSP = (): Promise<Array<PSP>> =>
  new Promise((resolve) => resolve(mockedChannelAvailablePSP));

export const associatePSPtoChannel = (
  _channelcode: string,
  _pspcode: string,
  _payment_type: PspChannelPaymentTypes
): Promise<PspChannelPaymentTypesResource> =>
  new Promise((resolve) => resolve({ payment_types: ['ptype_test'] }));

export const dissociatePSPfromChannel = (_channelcode: string, _pspcode: string): Promise<void> =>
  new Promise((resolve) => resolve());
