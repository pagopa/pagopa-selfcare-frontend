import { ReactNode } from 'react';
import { storageTokenOps } from '@pagopa/selfcare-common-frontend/utils/storage';
import { appStateActions } from '@pagopa/selfcare-common-frontend/redux/slices/appStateSlice';
import { buildFetchApi, extractResponse } from '@pagopa/selfcare-common-frontend/utils/api-utils';
import i18n from '@pagopa/selfcare-common-frontend/locale/locale-utils';
import { store } from '../redux/store';
import { ENV } from '../utils/env';
import { ProductKeys } from '../model/ApiKey';
import { NodeOnSignInPSP } from '../model/Node';
import { PSPDirectDTO } from '../model/PSP';
import { StationOnCreation } from '../model/Station';
import { InstitutionResource } from './generated/portal/InstitutionResource';
import { InstitutionDetailResource } from './generated/portal/InstitutionDetailResource';
import { ProductsResource } from './generated/portal/ProductsResource';
import { ChannelsResource } from './generated/portal/ChannelsResource';
import { createClient, WithDefaultsT } from './generated/portal/client';
import { PspChannelsResource } from './generated/portal/PspChannelsResource';
import { ChannelDetailsResource } from './generated/portal/ChannelDetailsResource';
import { PaymentTypesResource } from './generated/portal/PaymentTypesResource';
import { PspChannelPaymentTypes } from './generated/portal/PspChannelPaymentTypes';
import { StationsResource } from './generated/portal/StationsResource';
import { PspChannelPaymentTypesResource } from './generated/portal/PspChannelPaymentTypesResource';
import { StationCodeResource } from './generated/portal/StationCodeResource';
import { CreditorInstitutionStationDto } from './generated/portal/CreditorInstitutionStationDto';
import { StationDetailResource } from './generated/portal/StationDetailResource';
import { CreditorInstitutionStationEditResource } from './generated/portal/CreditorInstitutionStationEditResource';
import { ChannelCodeResource } from './generated/portal/ChannelCodeResource';
import { ChannelPspListResource } from './generated/portal/ChannelPspListResource';
import { CreditorInstitutionDto } from './generated/portal/CreditorInstitutionDto';
import { CreditorInstitutionDetailsResource } from './generated/portal/CreditorInstitutionDetailsResource';
import { WrapperStationsResource } from './generated/portal/WrapperStationsResource';
import { CreditorInstitutionsResource } from './generated/portal/CreditorInstitutionsResource';
import { WrapperStationDetailsDto } from './generated/portal/WrapperStationDetailsDto';
import { StationDetailsDto, StatusEnum } from './generated/portal/StationDetailsDto';
import { WrapperEntitiesOperations } from './generated/portal/WrapperEntitiesOperations';
import {
  ChannelDetailsDto,
  Payment_modelEnum,
  ProtocolEnum,
} from './generated/portal/ChannelDetailsDto';
import { UpdateCreditorInstitutionDto } from './generated/portal/UpdateCreditorInstitutionDto';
import {
  Redirect_protocolEnum,
  WrapperChannelDetailsDto,
} from './generated/portal/WrapperChannelDetailsDto';
import { WfespPluginConfs } from './generated/portal/WfespPluginConfs';
import { WrapperChannelsResource } from './generated/portal/WrapperChannelsResource';
import { WrapperChannelDetailsResource } from './generated/portal/WrapperChannelDetailsResource';
import { IbansResource } from './generated/portal/IbansResource';
import { IbanCreateRequestDto } from './generated/portal/IbanCreateRequestDto';
import { IbanResource } from './generated/portal/IbanResource';
import { CreditorInstitutionAssociatedCodeList } from './generated/portal/CreditorInstitutionAssociatedCodeList';
import { DelegationResource } from './generated/portal/DelegationResource';
import { BrokerOrPspDetailsResource } from './generated/portal/BrokerOrPspDetailsResource';
import { BrokerAndEcDetailsResource } from './generated/portal/BrokerAndEcDetailsResource';
import { PaymentServiceProviderDetailsDto } from './generated/portal/PaymentServiceProviderDetailsDto';
import { BrokerPspDetailsResource } from './generated/portal/BrokerPspDetailsResource';
import { BrokerDto } from './generated/portal/BrokerDto';
import { BrokerPspDetailsDto } from './generated/portal/BrokerPspDetailsDto';
import { BrokerResource } from './generated/portal/BrokerResource';
import { PaymentServiceProviderDetailsResource } from './generated/portal/PaymentServiceProviderDetailsResource';
import { PaymentServiceProvidersResource } from './generated/portal/PaymentServiceProvidersResource';
import { TavoloOpDto } from './generated/portal/TavoloOpDto';
import { TavoloOpOperations } from './generated/portal/TavoloOpOperations';
import { TavoloOpResource } from './generated/portal/TavoloOpResource';
import { TavoloOpResourceList } from './generated/portal/TavoloOpResourceList';

const withBearer: WithDefaultsT<'bearerAuth'> = (wrappedOperation) => (params: any) => {
  const token = storageTokenOps.read();
  return wrappedOperation({
    ...params,
    bearerAuth: `Bearer ${token}`,
  });
};

const apiClient = createClient({
  baseUrl: ENV.URL_API.PORTAL,
  basePath: '',
  fetchApi: buildFetchApi(ENV.API_TIMEOUT_MS.PORTAL),
  withDefaults: withBearer,
});

export const apiConfigClient = createClient({
  baseUrl: ENV.URL_API.APICONFIG,
  basePath: '',
  fetchApi: buildFetchApi(ENV.API_TIMEOUT_MS.PORTAL),
  withDefaults: withBearer,
});

const onRedirectToLogin = () =>
  store.dispatch(
    appStateActions.addError({
      id: 'tokenNotValid',
      error: new Error(),
      techDescription: 'token expired or not valid',
      toNotify: false,
      blocking: false,
      displayableTitle: i18n.t('session.expired.title'),
      displayableDescription: i18n.t('session.expired.message') as ReactNode,
    })
  );

const channelBody = (channel: ChannelDetailsDto) => ({
  agid: false,
  broker_description: channel.broker_description,
  broker_psp_code: channel.broker_psp_code,
  card_chart: false,
  channel_code: channel.channel_code,
  digital_stamp_brand: channel.digital_stamp_brand,
  enabled: true,
  flag_io: channel.flag_io,
  flagPspCp: false,
  ip: channel.ip,
  new_password: '',
  nmp_service: channel.nmp_service,
  on_us: false,
  password: channel.password,
  payment_model: Payment_modelEnum.IMMEDIATE,
  payment_types: channel.payment_types,
  port: channel.port,
  primitive_version: channel.primitive_version,
  protocol: ProtocolEnum.HTTPS,
  proxy_host: channel.proxy_host,
  proxy_port: channel.proxy_port,
  proxy_enabled: channel.proxy_enabled,
  recovery: false,
  redirect_protocol: Redirect_protocolEnum.HTTPS,
  redirect_port: undefined,
  redirect_ip: '',
  redirect_path: '',
  redirect_query_string: '',
  rt_push: false,
  serv_plugin: undefined,
  service: channel.service,
  status: StatusEnum.TO_CHECK_UPDATE,
  target_host: channel.target_host,
  target_path: channel.target_path,
  target_port: channel.target_port,
  thread_number: 1,
  timeout_a: channel.timeout_a,
  timeout_b: channel.timeout_b,
  timeout_c: channel.timeout_c,
});

export const PortalApi = {
  getInstitutions: async (productId: string): Promise<Array<InstitutionResource>> => {
    const result = await apiClient.getInstitutionsUsingGET({
      productId,
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  getInstitution: async (institutionId: string): Promise<InstitutionDetailResource> => {
    const result = await apiClient.getInstitutionUsingGET({
      institutionId,
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  getProducts: async (institutionId: string): Promise<Array<ProductsResource>> => {
    const result = await apiClient.getInstitutionProductsUsingGET({ institutionId });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  getInstitutionApiKeys: async (institutionId: string): Promise<Array<ProductKeys>> => {
    const result = await apiClient.getInstitutionApiKeysUsingGET({ institutionId });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  createInstitutionApiKeys: async (
    institutionId: string,
    subscriptionCode: string
  ): Promise<Array<ProductKeys>> => {
    const result = await apiClient.createInstitutionApiKeysUsingPOST({
      institutionId,
      subscriptionCode,
    });
    return extractResponse(result, 201, onRedirectToLogin);
  },

  regeneratePrimaryKey: async (subscriptionid: string): Promise<string> => {
    const result = await apiClient.regeneratePrimaryKeyUsingPOST({ subscriptionid });
    return extractResponse(result, 204, onRedirectToLogin);
  },

  regenerateSecondaryKey: async (subscriptionid: string): Promise<string> => {
    const result = await apiClient.regenerateSecondaryKeyUsingPOST({ subscriptionid });
    return extractResponse(result, 204, onRedirectToLogin);
  },

  getBrokerAndPspDetails: async (code: string): Promise<BrokerOrPspDetailsResource> => {
    const result = await apiConfigClient.getBrokerAndPspDetailsUsingGET({ code });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  getPSPBrokerDetails: async (brokerpspcode: string): Promise<BrokerPspDetailsResource> => {
    const result = await apiConfigClient.getBrokerPspUsingGET({ brokerpspcode });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  getPSPDetails: async (pspcode: string): Promise<PaymentServiceProviderDetailsResource> => {
    const result = await apiConfigClient.getPSPDetailsUsingGET({ pspcode });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  getPaymentServiceProviders: async (
    page: number,
    name?: string,
    limit?: number,
    pspCode?: string,
    taxCode?: string
  ): Promise<PaymentServiceProvidersResource> => {
    const result = await apiConfigClient.getPaymentServiceProvidersUsingGET({
      page,
      name,
      limit,
      pspCode,
      taxCode,
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  getBrokerAndEcDetails: async (code: string): Promise<BrokerAndEcDetailsResource> => {
    const result = await apiConfigClient.getBrokerAndEcDetailsUsingGET({ code });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  createPSPDirect: async (psp: NodeOnSignInPSP): Promise<PSPDirectDTO> => {
    const result = await apiConfigClient.createPSPDirectUsingPOST({
      body: {
        abi: psp.abiCode,
        agid_psp: false,
        bic: psp.bicCode,
        business_name: psp.businessName,
        enabled: true,
        my_bank_code: '',
        psp_code: psp.pspCode,
        stamp: psp.digitalStamp,
        tax_code: psp.fiscalCode,
        vat_number: psp.fiscalCode,
      },
    });
    return extractResponse(result, 201, onRedirectToLogin);
  },

  createPspBroker: async (broker: BrokerPspDetailsDto): Promise<BrokerPspDetailsResource> => {
    const result = await apiConfigClient.createBrokerPspUsingPOST({
      body: {
        broker_psp_code: broker.broker_psp_code,
        description: broker.description,
        enabled: broker.enabled,
        extended_fault_bean: broker.extended_fault_bean,
      },
    });
    return extractResponse(result, 201, onRedirectToLogin);
  },

  createPSPIndirect: async (
    psp: NodeOnSignInPSP
  ): Promise<PaymentServiceProviderDetailsResource> => {
    const result = await apiConfigClient.createPaymentServiceProviderUsingPOST({
      body: {
        abi: psp.abiCode,
        agid_psp: false,
        bic: psp.bicCode,
        business_name: psp.businessName,
        enabled: true,
        my_bank_code: '',
        psp_code: psp.pspCode,
        stamp: psp.digitalStamp,
        tax_code: psp.fiscalCode,
        vat_number: psp.fiscalCode,
      },
    });
    return extractResponse(result, 201, onRedirectToLogin);
  },

  updatePaymentServiceProvider: async (
    pspcode: string,
    psp: NodeOnSignInPSP
  ): Promise<PaymentServiceProviderDetailsResource> => {
    const result = await apiConfigClient.updatePSPUsingPUT({
      pspcode,
      body: {
        business_name: psp.businessName,
        enabled: true,
        psp_code: psp.pspCode,
        agid_psp: false,
        bic: psp.bicCode,
        my_bank_code: '',
        stamp: psp.digitalStamp,
        tax_code: psp.fiscalCode,
        vat_number: psp.fiscalCode,
      },
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  getChannels: async (page: number): Promise<ChannelsResource> => {
    const result = await apiConfigClient.getChannelsUsingGET({ page });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  getChannelsMerged: async (
    page: number,
    brokerCode: string,
    channelcodefilter?: string,
    limit?: number,
    sorting?: string
  ): Promise<WrapperChannelsResource> => {
    const result = await apiConfigClient.getAllChannelsMergedUsingGET({
      limit,
      channelcodefilter,
      brokerCode,
      page,
      sorting,
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  // retrive of channel detail before on db and then on the node
  getChannelDetail: async (channelcode: string): Promise<ChannelDetailsResource> => {
    const result = await apiConfigClient.getChannelDetailUsingGET({ channelcode });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  getPSPChannels: async (pspcode: string): Promise<PspChannelsResource> => {
    const result = await apiConfigClient.getPspChannelsUsingGET({ pspcode });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  getChannelPSPs: async (
    channelcode: string,
    page: number,
    limit?: number
  ): Promise<ChannelPspListResource> => {
    // return all PSP associated to the channel
    const result = await apiConfigClient.getChannelPaymentServiceProvidersUsingGET({
      page,
      channelcode,
      limit,
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  getWfespPlugins: async (): Promise<WfespPluginConfs> => {
    const result = await apiConfigClient.getWfespPluginsUsingGET({});
    return extractResponse(result, 200, onRedirectToLogin);
  },

  createChannel: async (channel: ChannelDetailsDto): Promise<WrapperChannelDetailsResource> => {
    const channelBody2Send = channelBody(channel);
    const result = await apiConfigClient.createChannelUsingPOST({
      body: { ...channelBody2Send, status: StatusEnum.APPROVED },
    });
    return extractResponse(result, 201, onRedirectToLogin);
  },

  createWrapperChannelDetails: async (
    channel: WrapperChannelDetailsDto,
    validationUrl: string
  ): Promise<WrapperEntitiesOperations> => {
    const result = await apiConfigClient.createWrapperChannelDetailsUsingPOST({
      body: {
        broker_psp_code: channel.broker_psp_code,
        broker_description: channel.broker_description,
        channel_code: channel.channel_code,
        redirect_protocol: Redirect_protocolEnum.HTTPS,
        redirect_port: undefined,
        redirect_ip: '',
        redirect_path: '',
        redirect_query_string: '',
        target_host: channel.target_host,
        target_path: channel.target_path,
        target_port: channel.target_port,
        payment_types: channel.payment_types,
        validationUrl,
        status: StatusEnum.TO_CHECK,
      },
    });
    return extractResponse(result, 201, onRedirectToLogin);
  },

  updateChannel: async (
    code: string,
    channel: ChannelDetailsDto
  ): Promise<ChannelDetailsResource> => {
    const channelBody2Send = channelBody(channel);
    const result = await apiConfigClient.updateChannelUsingPUT({
      channelcode: code,
      body: { ...channelBody2Send, status: StatusEnum.APPROVED },
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  updateWrapperChannelDetailsToCheck: async (
    channel: ChannelDetailsDto,
    validationUrl: string
  ): Promise<WrapperEntitiesOperations> => {
    const channelBody2Send = channelBody(channel);
    const result = await apiConfigClient.updateWrapperChannelDetailsUsingPUT({
      body: {
        ...channelBody2Send,
        status: StatusEnum.APPROVED,
        validationUrl,
      },
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  updateWrapperChannelDetailsToCheckUpdate: async (
    channel: ChannelDetailsDto,
    validationUrl: string
  ): Promise<WrapperEntitiesOperations> => {
    const channelBody2Send = channelBody(channel);
    const result = await apiConfigClient.updateWrapperChannelDetailsUsingPUT({
      body: {
        ...channelBody2Send,
        validationUrl,
      },
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  updateWrapperChannelDetailsByOpt: async (
    channel: ChannelDetailsDto,
    validationUrl: string
  ): Promise<WrapperEntitiesOperations> => {
    const channelBody2Send = channelBody(channel);
    const result = await apiConfigClient.updateWrapperChannelDetailsByOptUsingPUT({
      body: {
        ...channelBody2Send,
        status: StatusEnum.APPROVED,
        validationUrl,
      },
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  getPaymentTypes: async (): Promise<PaymentTypesResource> => {
    const result = await apiConfigClient.getPaymentTypesUsingGET({});
    return extractResponse(result, 200, onRedirectToLogin);
  },

  getChannelCode: async (pspcode: string): Promise<ChannelCodeResource> => {
    const result = await apiConfigClient.getChannelCodeUsingGET({ pspcode });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  getDelegatedPSPbyBroker: async (brokerId: string): Promise<Array<DelegationResource>> => {
    const institutionId = undefined;
    const result = await apiClient.getBrokerDelegationUsingGET({ institutionId, brokerId });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  associatePSPtoChannel: async (
    channelcode: string,
    pspcode: string,
    payment_types: PspChannelPaymentTypes
  ): Promise<PspChannelPaymentTypesResource> => {
    const payment_types_array = payment_types as ReadonlyArray<string>;
    const result = await apiConfigClient.updatePaymentServiceProvidersChannelsUsingPUT({
      channelcode,
      pspcode,
      body: { payment_types: payment_types_array },
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  dissociatePSPfromChannel: async (channelcode: string, pspcode: string): Promise<void> => {
    const result = await apiConfigClient.deletePaymentServiceProvidersChannelsUsingDELETE({
      channelcode,
      pspcode,
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  createStation: async (station: StationOnCreation): Promise<StationDetailResource> => {
    const result = await apiConfigClient.createStationUsingPOST({
      body: {
        ...station,
      },
    });
    return extractResponse(result, 201, onRedirectToLogin);
  },

  getStations: async (
    page: number,
    creditorInstitutionCode?: string,
    stationCode?: string,
    limit?: number,
    ordering?: string
  ): Promise<StationsResource> => {
    const result = await apiConfigClient.getStationsUsingGET({
      page,
      creditorInstitutionCode,
      stationCode,
      limit,
      ordering,
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  getStationsMerged: async (
    page: number,
    brokerCode: string,
    stationcodefilter?: string,
    limit?: number,
    sorting?: string
  ): Promise<WrapperStationsResource> => {
    const result = await apiConfigClient.getAllStationsMergedUsingGET({
      limit,
      stationcodefilter,
      brokerCode,
      page,
      sorting,
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  getStationCode: async (ecCode: string): Promise<StationCodeResource> => {
    const result = await apiConfigClient.getStationCodeUsingGET({ ecCode });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  associateEcToStation: async (
    ecCode: string,
    station: CreditorInstitutionStationDto
  ): Promise<CreditorInstitutionStationEditResource> => {
    const result = await apiConfigClient.associateStationToCreditorInstitutionUsingPOST({
      ecCode,
      body: {
        auxDigit: station.auxDigit,
        segregationCode: station.segregationCode,
        stationCode: station.stationCode,
        broadcast: station.broadcast,
      },
    });
    return extractResponse(result, 201, onRedirectToLogin);
  },

  dissociateECfromStation: async (ecCode: string, stationcode: string): Promise<void> => {
    const result = await apiConfigClient.deleteCreditorInstitutionStationRelationshipUsingDELETE({
      ecCode,
      stationcode,
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  getECListByStationCode: async (
    stationcode: string,
    page: number,
    limit?: number
  ): Promise<CreditorInstitutionsResource> => {
    const result = await apiConfigClient.getCreditorInstitutionsByStationCodeUsingGET({
      stationcode,
      limit,
      page,
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  createECAndBroker: async (
    ec: CreditorInstitutionDto
  ): Promise<CreditorInstitutionDetailsResource> => {
    const result = await apiConfigClient.createCreditorInstitutionAndBrokerUsingPOST({
      body: {
        brokerDto: {
          broker_code: ec.creditorInstitutionCode,
          description: ec.businessName,
        },
        creditorInstitutionDto: {
          address: ec.address,
          businessName: ec.businessName,
          creditorInstitutionCode: ec.creditorInstitutionCode,
          enabled: ec.enabled,
          pspPayment: ec.pspPayment,
          reportingFtp: ec.reportingFtp,
          reportingZip: ec.reportingZip,
        },
      },
    });

    return extractResponse(result, 201, onRedirectToLogin);
  },

  createEcBroker: async (broker: BrokerDto): Promise<BrokerResource> => {
    const result = await apiConfigClient.createBrokerUsingPOST({
      body: {
        broker_code: broker.broker_code,
        description: broker.description,
      },
    });
    return extractResponse(result, 201, onRedirectToLogin);
  },

  createECIndirect: async (
    ec: CreditorInstitutionDto
  ): Promise<CreditorInstitutionDetailsResource> => {
    const result = await apiConfigClient.createCreditorInstitutionUsingPOST({
      body: {
        address: ec.address,
        businessName: ec.businessName,
        creditorInstitutionCode: ec.creditorInstitutionCode,
        enabled: ec.enabled,
        pspPayment: ec.pspPayment,
        reportingFtp: ec.reportingFtp,
        reportingZip: ec.reportingZip,
      },
    });

    return extractResponse(result, 201, onRedirectToLogin);
  },

  updateCreditorInstitution: async (
    ecCode: string,
    ec: UpdateCreditorInstitutionDto
  ): Promise<CreditorInstitutionDetailsResource> => {
    const result = await apiConfigClient.updateCreditorInstitutionDetailsUsingPUT({
      ecCode,
      body: {
        address: ec.address,
        businessName: ec.businessName,
        creditorInstitutionCode: ec.creditorInstitutionCode,
        enabled: ec.enabled,
        pspPayment: ec.pspPayment,
        reportingFtp: ec.reportingFtp,
        reportingZip: ec.reportingZip,
      },
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  getWrapperEntities: async (code: string): Promise<WrapperEntitiesOperations> => {
    const result = await apiConfigClient.getWrapperEntitiesUsingGET({ code });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  createWrapperStation: async (
    station: WrapperStationDetailsDto,
    validationUrl: string
  ): Promise<WrapperEntitiesOperations> => {
    const result = await apiConfigClient.createWrapperStationDetailsUsingPOST({
      body: {
        brokerCode: station.brokerCode,
        broker_description: station.broker_description,
        version: 1,
        enabled: station.enabled,
        stationCode: station.stationCode,
        primitiveVersion: station.primitiveVersion,
        redirectProtocol: station.redirectProtocol,
        redirectPort: station.redirectPort,
        redirectIp: station.redirectIp,
        redirectPath: station.redirectPath,
        redirectQueryString: station.redirectQueryString,
        targetHost: station.targetHost ? station.targetHost : undefined,
        targetPath: station.targetPath ? station.targetPath : undefined,
        targetPort: station.targetPort ? station.targetPort : undefined,
        validationUrl,
      },
    });
    return extractResponse(result, 201, onRedirectToLogin);
  },

  updateWrapperStationToCheck: async (
    station: StationDetailsDto,
    validationUrl: string
  ): Promise<WrapperEntitiesOperations> => {
    const result = await apiConfigClient.updateWrapperStationDetailsUsingPUT({
      body: {
        ...station,
        status: StatusEnum.TO_CHECK,
        validationUrl,
      },
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  updateWrapperStationToCheckUpdate: async (
    station: StationDetailsDto,
    validationUrl: string
  ): Promise<WrapperEntitiesOperations> => {
    const result = await apiConfigClient.updateWrapperStationDetailsUsingPUT({
      body: {
        ...station,
        status: StatusEnum.TO_CHECK_UPDATE,
      },
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  updateWrapperStationByOpt: async (
    station: StationDetailsDto,
    validationUrl: string
  ): Promise<WrapperEntitiesOperations> => {
    const result = await apiConfigClient.updateWrapperStationDetailsByOptUsingPUT({
      body: {
        ...station,
        status: StatusEnum.TO_CHECK_UPDATE,
      },
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  updateStation: async (
    station: StationDetailsDto,
    stationcode: string
  ): Promise<StationDetailResource> => {
    const result = await apiConfigClient.updateStationUsingPUT({
      body: {
        ...station,
        status: StatusEnum.APPROVED,
      },
      stationcode,
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  getWrapperEntitiesStation: async (code: string): Promise<WrapperEntitiesOperations> => {
    const result = await apiConfigClient.getWrapperEntitiesStationUsingGET({ code });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  // before tries to get the detail from the DB, if doesn't finds anything, will try to get the detail form apim
  getStationDetail: async (stationId: string): Promise<StationDetailResource> => {
    const result = await apiConfigClient.getStationDetailUsingGET({ stationId });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  // get the detail directly from apim
  getStation: async (stationId: string): Promise<StationDetailResource> => {
    const result = await apiConfigClient.getStationUsingGET({ stationId });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  getCreditorInstitutionIbans: async (
    creditorinstitutioncode: string,
    labelName?: string
  ): Promise<IbansResource> => {
    const result = await apiConfigClient.getCreditorInstitutionIbansUsingGET({
      creditorinstitutioncode,
      labelName,
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  createIban: async (ibanBody: IbanCreateRequestDto): Promise<IbanResource> => {
    const result = await apiConfigClient.createCreditorInstitutionIbansUsingPOST({
      body: {
        iban: ibanBody.iban,
        description: ibanBody.description,
        validityDate: ibanBody.validityDate,
        dueDate: ibanBody.dueDate,
        creditorInstitutionCode: ibanBody.creditorInstitutionCode,
        active: ibanBody.active,
      },
    });
    return extractResponse(result, 201, onRedirectToLogin);
  },

  updateIban: async (ibanBody: IbanCreateRequestDto): Promise<IbanResource> => {
    const result = await apiConfigClient.updateCreditorInstitutionIbansUsingPUT({
      body: {
        iban: ibanBody.iban,
        description: ibanBody.description,
        validityDate: ibanBody.validityDate,
        dueDate: ibanBody.dueDate,
        creditorInstitutionCode: ibanBody.creditorInstitutionCode,
        labels: ibanBody.labels?.length === 0 ? undefined : ibanBody.labels,
        active: ibanBody.active,
      },
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  deleteIban: async (creditorinstitutioncode: string, ibanValue: string): Promise<void> => {
    const result = await apiConfigClient.deleteCreditorInstitutionIbansUsingDELETE({
      creditorinstitutioncode,
      ibanValue,
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  getCreditorInstitutionSegregationcodes: async (
    ecCode: string
  ): Promise<CreditorInstitutionAssociatedCodeList> => {
    const result = await apiConfigClient.getCreditorInstitutionSegregationcodesUsingGET({
      ecCode,
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  getStationAvailableEc: async (
    institutionId?: string,
    brokerId?: string
  ): Promise<DelegationResource> => {
    const result = await apiClient.getBrokerDelegationUsingGET({ institutionId, brokerId });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  getOperationTableList: async (): Promise<TavoloOpResourceList> => {
    const result = await apiConfigClient.getAllTavoloOpDetailsUsingGET({});
    return extractResponse(result, 200, onRedirectToLogin);
  },

  createOperationTable: async (operationTableDto: TavoloOpDto): Promise<TavoloOpOperations> => {
    const result = await apiConfigClient.insertUsingPOST({ body: operationTableDto });
    return extractResponse(result, 201, onRedirectToLogin);
  },

  updateOperationTable: async (operationTableDto: TavoloOpDto): Promise<TavoloOpOperations> => {
    const result = await apiConfigClient.updateUsingPUT({ body: operationTableDto });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  getOperationTableDetails: async (ecCode: string): Promise<TavoloOpResource> => {
    const result = await apiConfigClient.getTavoloOpDetailsUsingGET({ ecCode });
    return extractResponse(result, 200, onRedirectToLogin);
  },
};
