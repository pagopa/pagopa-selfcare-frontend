import {
  Payment_modelEnum,
  ProtocolEnum,
  Redirect_protocolEnum,
} from '../../api/generated/portal/ChannelDetailsDto';
import { ChannelDetailsResource } from '../../api/generated/portal/ChannelDetailsResource';
import { ChannelsResource } from '../../api/generated/portal/ChannelsResource';
import { PaymentTypesResource } from '../../api/generated/portal/PaymentTypesResource';
import { PspChannelsResource } from '../../api/generated/portal/PspChannelsResource';
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
      enabled: true,
      broker_description: 'Intermediario per test WFESP',
    },
    {
      channel_code: 'WFESP_07_ila',
      enabled: true,
      broker_description: 'Intermediario per test WFESP',
    },
    {
      channel_code: 'WFESP_06_tot',
      enabled: true,
      broker_description: 'Intermediario per test WFESP',
    },
    {
      channel_code: 'WFESP_06_salvo',
      enabled: true,
      broker_description: 'Intermediario per test WFESP',
    },
    {
      channel_code: 'WFESP_06_ila',
      enabled: true,
      broker_description: 'Intermediario per test WFESP',
    },
    {
      channel_code: 'WFESP_05_tot',
      enabled: true,
      broker_description: 'Intermediario per test WFESP',
    },
    {
      channel_code: 'WFESP_05_salvo',
      enabled: true,
      broker_description: 'Intermediario per test WFESP',
    },
    {
      channel_code: 'WFESP_05_ila',
      enabled: true,
      broker_description: 'Intermediario per test WFESP',
    },
    {
      channel_code: 'WFESP_02_tot',
      enabled: true,
      broker_description: 'Intermediario per test WFESP',
    },
    {
      channel_code: 'WFESP_02_salvo',
      enabled: true,
      broker_description: 'Intermediario per test WFESP',
    },
    {
      channel_code: 'WFESP_02_ila',
      enabled: true,
      broker_description: 'Intermediario per test WFESP',
    },
    {
      channel_code: 'WFESP_01_tot',
      enabled: true,
      broker_description: 'Intermediario per test WFESP',
    },
    {
      channel_code: 'WFESP_01_salvo',
      enabled: true,
      broker_description: 'Intermediario per test WFESP',
    },
    {
      channel_code: 'WFESP_01_LS',
      enabled: true,
      broker_description: 'Intermediario per test WFESP',
    },
    {
      channel_code: 'WFESP_01_ila',
      enabled: true,
      broker_description: 'Intermediario per test WFESP',
    },
    {
      channel_code: 'WFESP_01_gabri',
      enabled: true,
      broker_description: 'Intermediario per test WFESP',
    },
    {
      channel_code: 'VicBKFMozo9q5Oml0FboMmRVWRajpRVdT6D',
      enabled: true,
      broker_description: 'Postecom',
    },
    {
      channel_code: 'UNC13',
      enabled: true,
      broker_description: 'unicredito',
    },
    {
      channel_code: 'UNC12',
      enabled: true,
      broker_description: 'unicredito',
    },
    {
      channel_code: 'TotHttps',
      enabled: true,
      broker_description: 'Intermediario per tutti',
    },
    {
      channel_code: 'sypifKyvhiIm8VLG6zMnvGehH3u0YOtlSjm',
      enabled: true,
      broker_description: 'Postecom',
    },
    {
      channel_code: 'STRESS_CARTE',
      enabled: true,
      broker_description: 'STRESS',
    },
    {
      channel_code: 'STRESS',
      enabled: true,
      broker_description: 'STRESS',
    },
    {
      channel_code: 'qqq',
      enabled: true,
      broker_description: 'Intermediario per tutti',
    },
    {
      channel_code: 'PSOTE2',
      enabled: true,
      broker_description: 'Poste',
    },
    {
      channel_code: 'provaCanale',
      enabled: true,
      broker_description: 'Intermediario per SAlvo ',
    },
    {
      channel_code: 'prova_canale',
      enabled: true,
      broker_description: 'unicredito',
    },
    {
      channel_code: 'prova Mari',
      enabled: false,
      broker_description: 'INT_NOT_ENABLED',
    },
    {
      channel_code: 'POSTE3',
      enabled: true,
      broker_description: 'Poste',
    },
    {
      channel_code: 'POSTE1_ONUS',
      enabled: true,
      broker_description: 'Poste',
    },
    {
      channel_code: 'POSTE1',
      enabled: true,
      broker_description: 'Poste',
    },
    {
      channel_code: 'playground',
      enabled: true,
      broker_description: 'playground',
    },
    {
      channel_code: 'noServizio',
      enabled: true,
      broker_description: 'noServizio',
    },
    {
      channel_code: 'mybankSvil',
      enabled: true,
      broker_description: 'Intermediario per mybankSvil',
    },
    {
      channel_code: 'Lr4EZ8SUcl1ojsfHphUuzncqnznTABOaBUE',
      enabled: true,
      broker_description: 'Postecom',
    },
    {
      channel_code: 'KSd4Y5KDSDrgoX8rzw515aPInbDddLOnqOt',
      enabled: false,
      broker_description: 'Postecom',
    },
    {
      channel_code: 'JiffyRED',
      enabled: true,
      broker_description: 'idIntermediario2',
    },
    {
      channel_code: 'irraggiungibile3',
      enabled: true,
      broker_description: 'irraggiungibile',
    },
    {
      channel_code: 'irraggiungibile2',
      enabled: true,
      broker_description: 'irraggiungibile',
    },
    {
      channel_code: 'irraggiungibile',
      enabled: true,
      broker_description: 'irraggiungibile',
    },
    {
      channel_code: 'idCanale21',
      enabled: true,
      broker_description: 'idIntermediario2',
    },
    {
      channel_code: 'DINERS_ONUS',
      enabled: true,
      broker_description: 'DINERS',
    },
    {
      channel_code: 'DINERS',
      enabled: true,
      broker_description: 'DINERS',
    },
    {
      channel_code: 'CRPTSEM_23_24',
      enabled: true,
      broker_description: 'Intermediario per tutti',
    },
    {
      channel_code: 'CAtestUNR',
      enabled: true,
      broker_description: 'Intermediario PSP di Test - Donato - 1',
    },
    {
      channel_code: 'CAtestOFF',
      enabled: false,
      broker_description: 'Intermediario PSP di Test - Donato - 2',
    },
    {
      channel_code: 'CAtestD',
      enabled: true,
      broker_description: 'Intermediario PSP di Test - Donato - 2',
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

const mockedPaymentTypes: PaymentTypesResource = {
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

const mockedChannelDetail = (channel_code: string): ChannelDetailsResource => ({
  agid: true,
  broker_description: 'broker_description',
  broker_psp_code: 'broker_psp_code',
  card_chart: true,
  channel_code,
  digital_stamp_brand: true,
  enabled: true,
  flag_io: true,
  ip: 'ip',
  new_fault_code: true,
  new_password: 'new_password',
  npm_service: 'npm_service',
  on_us: true,
  password: 'password',
  payment_model: Payment_modelEnum.ACTIVATED_AT_PSP,
  payment_types: ['Bancomat PAY'],
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

export const mockedChannelPSPs: ChannelsResource = {
  channels: [
    {
      channel_code: 'Intesa Sanpaolo S.P.A.',
      enabled: true,
      broker_description: 'Nome Cognome',
    },
  ],
  page_info: {
    page: 0,
    limit: 50,
    items_found: 50,
    total_pages: 8,
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

export const getChannels = (_page: number): Promise<ChannelsResource> =>
  new Promise((resolve) => resolve(mockedChannels));

export const getChannelDetail = (channelcode: string): Promise<ChannelDetailsResource> =>
  new Promise((resolve) => resolve(mockedChannelDetail(channelcode)));

export const getPSPChannels = (_pspCode: string): Promise<PspChannelsResource> =>
  new Promise((resolve) => resolve(mockedPSPChannels));

export const createChannel = (_channel: ChannelOnCreation): Promise<ChannelDetailsResource> =>
  new Promise((resolve) => resolve(mockedPSPChannels));

export const getPaymentTypes = (): Promise<PaymentTypesResource> =>
  new Promise((resolve) => resolve(mockedPaymentTypes));

export const getChannelPSPsMocked = (_page: number): Promise<ChannelsResource> =>
  new Promise((resolve) => resolve(mockedChannelPSPs));

export const getChannelAvailablePSP = (): Promise<Array<PSP>> =>
  new Promise((resolve) => resolve(mockedChannelAvailablePSP));
