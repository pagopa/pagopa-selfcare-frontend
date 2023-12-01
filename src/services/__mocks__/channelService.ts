import { ChannelCodeResource } from '../../api/generated/portal/ChannelCodeResource';
import { ChannelDetailsDto, ProtocolEnum } from '../../api/generated/portal/ChannelDetailsDto';
import { ChannelDetailsResource } from '../../api/generated/portal/ChannelDetailsResource';
import { ChannelPspListResource } from '../../api/generated/portal/ChannelPspListResource';
import { ChannelsResource } from '../../api/generated/portal/ChannelsResource';
import { PspChannelPaymentTypes } from '../../api/generated/portal/PspChannelPaymentTypes';
import { PspChannelPaymentTypesResource } from '../../api/generated/portal/PspChannelPaymentTypesResource';
import { PspChannelsResource } from '../../api/generated/portal/PspChannelsResource';
import { WrapperStatusEnum } from '../../api/generated/portal/WrapperChannelResource';
import { WrapperChannelsResource } from '../../api/generated/portal/WrapperChannelsResource';
import {
  StatusEnum,
  WrapperChannelDetailsDto,
} from '../../api/generated/portal/WrapperChannelDetailsDto';
import {
  TypeEnum,
  WrapperEntitiesOperations,
} from '../../api/generated/portal/WrapperEntitiesOperations';
import { ChannelOnCreation } from '../../model/Channel';
import { PSP } from '../../model/PSP';
import { WfespPluginConfs } from '../../api/generated/portal/WfespPluginConfs';
import {PaymentTypes} from "../../api/generated/portal/PaymentTypes";
import {Delegation} from "../../api/generated/portal/Delegation";

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
      channel_code: '97735020584_01',
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

const channelEnabled = (channel: PspChannelsResource) => {
  const newList: PspChannelsResource = {
    channels: channel.channels.filter((e) => e.enabled === false),
  };
  return newList;
};

export const mockedPaymentTypes: PaymentTypes = {
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

export const mockedWfespPlugIn: WfespPluginConfs = {
  wfesp_plugin_confs: [
    {
      pag_const_string_profile: '',
      pag_soap_rule_profile: '',
      pag_rpt_xpath_profile: '',
      id_bean: 'defaultForwardProcessor',
      id_serv_plugin: 'test2',
    },
    {
      pag_const_string_profile: '',
      pag_soap_rule_profile: '',
      pag_rpt_xpath_profile: '',
      id_bean: 'defaultForwardProcessor',
      id_serv_plugin: 'wpl02',
    },
    {
      pag_const_string_profile: '',
      pag_soap_rule_profile:
        'profilo=$identificativoIntermediarioPA$~$identificativoStazioneIntermediarioPA$',
      pag_rpt_xpath_profile: '',
      id_bean: 'defaultForwardProcessor',
      id_serv_plugin: 'idPsp1',
    },
    {
      pag_const_string_profile: '',
      pag_soap_rule_profile: '',
      pag_rpt_xpath_profile: '',
      id_bean: 'myBankForwardProcessor',
      id_serv_plugin: 'wpl04',
    },
    {
      pag_const_string_profile: '',
      pag_soap_rule_profile: '',
      pag_rpt_xpath_profile: '',
      id_bean: 'defaultForwardProcessor',
      id_serv_plugin: 'wpl06',
    },
    {
      pag_const_string_profile: '',
      pag_soap_rule_profile: '',
      pag_rpt_xpath_profile: '',
      id_bean: 'defaultForwardProcessor',
      id_serv_plugin: 'wpl05',
    },
    {
      pag_const_string_profile: '',
      pag_soap_rule_profile: '',
      pag_rpt_xpath_profile: '',
      id_bean: 'defaultForwardProcessor',
      id_serv_plugin: 'wpl03',
    },
    {
      pag_const_string_profile: '',
      pag_soap_rule_profile: 'IDVS=$buyerBank$',
      pag_rpt_xpath_profile: '',
      id_bean: 'defaultForwardProcessor',
      id_serv_plugin: 'wpl07',
    },
  ],
};

// @ts-ignore
export const mockedChannel: ChannelDetailsDto = {
  agid: false,
  broker_description: 'string',
  broker_psp_code: 'string',
  card_chart: false,
  channel_code: 'string',
  digital_stamp_brand: false,
  enabled: true,
  flag_io: false,
  ip: 'string',
  new_fault_code: false,
  new_password: 'string',
  note: 'string',
  nmp_service: 'string',
  on_us: false,
  password: 'string',
  payment_model: undefined,
  payment_types: mockedPaymentTypes.payment_types!.map((e) => e.payment_type) as any,
  port: 0,
  primitive_version: 1,
  protocol: ProtocolEnum.HTTPS,
  proxy_enabled: false,
  proxy_host: 'string',
  proxy_password: 'string',
  proxy_port: 0,
  proxy_username: 'string',
  recovery: false,
  rt_push: false,
  serv_plugin: 'string',
  service: 'string',
  status: StatusEnum.APPROVED,
  target_host: 'string',
  target_path: 'string',
  target_port: 3000,
  thread_number: 3,
  timeout_a: 1000,
  timeout_b: 2000,
  timeout_c: 3000,
};

// @ts-ignore
export const mockedWrapperChannel: WrapperChannelDetailsDto = {
  broker_psp_code: 'broker_psp_code',
  broker_description: 'broker_description',
  channel_code: 'id_channel',
  target_path: 'target_path',
  target_port: 8081,
  target_host: 'target_host',
  payment_types: mockedPaymentTypes.payment_types!.map(
    (e, _i) => `${e.description} - ${e.payment_type}`
  ),
  status: StatusEnum.TO_CHECK,
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
      modifiedAt: new Date(),
    },
    {
      channel_code: '97735020584_02',
      createdAt: new Date('2023-05-04T17:52:33.993Z'),
      wrapperStatus: WrapperStatusEnum.TO_CHECK,
      modifiedAt: new Date(),
    },
    {
      channel_code: '97735020584_03',
      createdAt: new Date('2023-05-04T17:52:33.993Z'),
      wrapperStatus: WrapperStatusEnum.TO_CHECK_UPDATE,
      modifiedAt: new Date(),
    },
    {
      channel_code: '97735020584_04',
      createdAt: new Date('2023-05-04T17:52:33.993Z'),
      wrapperStatus: WrapperStatusEnum.TO_FIX,
      modifiedAt: new Date(),
    },
    {
      channel_code: '97735020584_05',
      createdAt: new Date('2023-05-04T17:52:33.993Z'),
      wrapperStatus: WrapperStatusEnum.TO_FIX_UPDATE,
      modifiedAt: new Date(),
    },
  ],
};

export const mockedChannelDetail = (channelId: string): ChannelDetailsResource => ({
  agid: true,
  broker_description: 'broker_description',
  broker_psp_code: 'broker_psp_code',
  card_chart: true,
  channel_code: channelId,
  digital_stamp_brand: true,
  enabled: false,
  flag_io: true,
  ip: 'ip',
  new_fault_code: true,
  new_password: 'new_password',
  nmp_service: 'npm_service',
  on_us: true,
  password: 'password',
  payment_model: undefined,
  payment_types: mockedPaymentTypes.payment_types!.map((e: any, _i: any) => e.payment_type),
  port: 8080,
  primitive_version: 1,
  protocol: ProtocolEnum.HTTPS,
  proxy_enabled: true,
  proxy_host: 'proxy_host',
  proxy_password: 'proxy_password',
  proxy_port: 8080,
  proxy_username: 'proxy_username',
  recovery: true,
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

export const mockedDelegatedPSP: Array<Delegation> = [
  {
    broker_id: '12345',
    institution_id: '0000001',
    broker_name: 'PSP1',
  },
  {
    institution_id: '0000002',
    broker_name: 'PSP2',
  },
  {
    institution_id: '0000003',
    broker_name: 'PSP3',
  },
  {
    institution_id: '0000004',
    broker_name: 'PSP4',
  },
  {
    institution_id: '0000005',
    broker_name: 'PSP5',
  },
  {
    institution_id: '0000006',
    broker_name: 'PSP6',
  },
];

export const channelCode: ChannelCodeResource = {
  channel_code: '1231231231',
};

export const channelWrapperMockedGet = (code: string): WrapperEntitiesOperations => ({
  brokerCode: 'string',
  createdAt: new Date(),
  createdBy: 'PSP S.p.A',
  id: 'string',
  modifiedAt: new Date(),
  modifiedBy: 'string',
  modifiedByOpt: 'string',
  note: 'string',
  status: StatusEnum.APPROVED,
  type: TypeEnum.CHANNEL,
  wrapperEntityOperationsSortedList: [
    {
      createdAt: new Date(),
      entity: {
        broker_psp_code: '97735020584',
        broker_description: 'AgID - Agenzia per l’Italia Digitale',
        channel_code: code,
        target_path: ' /govpay/api/pagopa/PagamentiTelematiciCCPservice',
        target_port: 8081,
        target_host: ' lab.link.it',
        payment_types: mockedPaymentTypes.payment_types!.map((e: any) => e.payment_type),
        status: StatusEnum.TO_CHECK,
      },
      id: 'string',
      modifiedAt: new Date(),
      modifiedBy: 'string',
      modifiedByOpt: 'Operatore PSP',
      note: 'string',
      status: StatusEnum.TO_CHECK,
      type: TypeEnum.CHANNEL,
    },
  ],
});

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
  new Promise((resolve) => resolve(channelEnabled(mockedPSPChannels)));

export const createChannel = (_channel: ChannelOnCreation): Promise<ChannelDetailsResource> =>
  new Promise((resolve) => {
    // @ts-ignore
    resolve(mockedChannel);
  });

export const updateChannel = (
  _code: string,
  _channel: ChannelOnCreation
): Promise<ChannelDetailsResource> => new Promise((resolve) => {
  // @ts-ignore
  resolve(mockedChannel);
});

export const getPaymentTypes = (): Promise<PaymentTypes> =>
  new Promise((resolve) => resolve(mockedPaymentTypes));

export const getChannelPSPs = (page: number): Promise<ChannelPspListResource> =>
  new Promise((resolve) => resolve(page === 0 ? mockedChannelPSPs : mockedChannelPSPsPage2));

export const getDelegatedPSPbyBroker = (): Promise<Array<Delegation>> =>
  new Promise((resolve) => resolve(mockedDelegatedPSP));

export const associatePSPtoChannel = (
  _channelcode: string,
  _pspcode: string,
  _payment_type: PspChannelPaymentTypes
): Promise<PspChannelPaymentTypesResource> =>
  new Promise((resolve) => resolve({ payment_types: ['ptype_test'] }));

export const dissociatePSPfromChannel = (_channelcode: string, _pspcode: string): Promise<void> =>
  new Promise((resolve) => resolve());

export const createWrapperChannel = (
  _channel: WrapperChannelDetailsDto,
  _validationUrl: string
): Promise<WrapperEntitiesOperations> => new Promise((resolve) => resolve(mockedWrapperChannel));

export const updateWrapperChannel = (
  _channel: ChannelDetailsDto,
  _validationUrl: string
): Promise<WrapperEntitiesOperations> => new Promise((resolve) => resolve(mockedWrapperChannel));

export const getWrapperChannel = (pspCode: string): Promise<WrapperEntitiesOperations> =>
  new Promise((resolve) => resolve(channelWrapperMockedGet(pspCode)));

export const getWfespPlugins = (): Promise<WfespPluginConfs> =>
  new Promise((resolve) => resolve(mockedWfespPlugIn));
