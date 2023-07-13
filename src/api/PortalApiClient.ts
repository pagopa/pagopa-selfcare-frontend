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
import { PaymentServiceProviderDetailsResource } from './generated/portal/PaymentServiceProviderDetailsResource';
import { ChannelCodeResource } from './generated/portal/ChannelCodeResource';
import { ChannelPspListResource } from './generated/portal/ChannelPspListResource';
import { CreditorInstitutionDto } from './generated/portal/CreditorInstitutionDto';
import { CreditorInstitutionDetailsResource } from './generated/portal/CreditorInstitutionDetailsResource';
import { WrapperStationsResource } from './generated/portal/WrapperStationsResource';
import { CreditorInstitutionsResource } from './generated/portal/CreditorInstitutionsResource';
import { WrapperStationDetailsDto } from './generated/portal/WrapperStationDetailsDto';
import { StationDetailsDto, StatusEnum } from './generated/portal/StationDetailsDto';
import { WrapperEntitiesOperations } from './generated/portal/WrapperEntitiesOperations';
import { ChannelDetailsDto } from './generated/portal/ChannelDetailsDto';
import { UpdateCreditorInstitutionDto } from './generated/portal/UpdateCreditorInstitutionDto';
import { WrapperChannelDetailsDto } from './generated/portal/WrapperChannelDetailsDto';
import { WfespPluginConfs } from './generated/portal/WfespPluginConfs';
import { WrapperChannelsResource } from './generated/portal/WrapperChannelsResource';
import { WrapperChannelDetailsResource } from './generated/portal/WrapperChannelDetailsResource';
import { IbansResource } from './generated/portal/IbansResource';
import { IbanCreateRequestDto } from './generated/portal/IbanCreateRequestDto';
import { IbanResource } from './generated/portal/IbanResource';

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

const apiConfigClient = createClient({
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

  getPSPDetails: async (pspcode: string): Promise<PaymentServiceProviderDetailsResource> => {
    const result = await apiConfigClient.getPSPDetailsUsingGET({ pspcode });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  createPSPDirect: async (psp: NodeOnSignInPSP): Promise<PSPDirectDTO> => {
    const result = await apiConfigClient.createPSPDirectUsingPOST({
      body: {
        abi: psp.abiCode,
        agid_psp: true,
        bic: psp.bicCode,
        business_name: psp.businessName,
        enabled: true,
        my_bank_code: '',
        psp_code: psp.pspCode,
        stamp: true,
        tax_code: psp.fiscalCode,
        vat_number: psp.fiscalCode,
      },
    });
    return extractResponse(result, 204, onRedirectToLogin);
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
    const result = await apiConfigClient.createChannelUsingPOST({
      body: {
        agid: true,
        broker_description: channel.broker_description,
        broker_psp_code: channel.broker_psp_code,
        card_chart: channel.card_chart,
        channel_code: channel.channel_code,
        digital_stamp_brand: channel.digital_stamp_brand,
        enabled: true,
        flag_io: channel.flag_io,
        flagPspCp: channel.flagPspCp,
        ip: channel.ip,
        new_password: channel.new_password,
        nmp_service: channel.nmp_service,
        on_us: channel.on_us,
        password: channel.password,
        payment_model: channel.payment_model,
        payment_types: channel.payment_types,
        port: channel.port,
        primitive_version: channel.primitive_version,
        protocol: channel.protocol,
        proxy_host: channel.proxy_host,
        proxy_port: channel.proxy_port,
        recovery: channel.recovery,
        redirect_ip: channel.redirect_ip,
        redirect_path: channel.redirect_path,
        redirect_port: channel.redirect_port,
        redirect_protocol: channel.redirect_protocol,
        redirect_query_string: channel.redirect_query_string,
        rt_push: channel.rt_push,
        serv_plugin: channel.serv_plugin,
        service: channel.service,
        status: StatusEnum.APPROVED,
        target_host: channel.target_host,
        target_path: channel.target_path,
        target_port: channel.target_port,
        thread_number: channel.thread_number,
        timeout_a: channel.timeout_a,
        timeout_b: channel.timeout_b,
        timeout_c: channel.timeout_c,
      },
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
        redirect_protocol: channel.redirect_protocol,
        redirect_port: channel.redirect_port,
        redirect_ip: channel.redirect_ip,
        redirect_path: channel.redirect_path,
        redirect_query_string: channel.redirect_query_string,
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
    const result = await apiConfigClient.updateChannelUsingPUT({
      channelcode: code,
      body: {
        agid: true,
        broker_description: channel.broker_description,
        broker_psp_code: channel.broker_psp_code,
        card_chart: channel.card_chart,
        channel_code: channel.channel_code,
        digital_stamp_brand: channel.digital_stamp_brand,
        enabled: true,
        flag_io: channel.flag_io,
        flagPspCp: channel.flagPspCp,
        ip: channel.ip,
        new_password: channel.new_password,
        nmp_service: channel.nmp_service,
        on_us: channel.on_us,
        password: channel.password,
        payment_model: channel.payment_model,
        payment_types: channel.payment_types,
        port: channel.port,
        primitive_version: channel.primitive_version,
        protocol: channel.protocol,
        proxy_host: channel.proxy_host,
        proxy_port: channel.proxy_port,
        recovery: channel.recovery,
        redirect_ip: channel.redirect_ip,
        redirect_path: channel.redirect_path,
        redirect_port: channel.redirect_port,
        redirect_protocol: channel.redirect_protocol,
        redirect_query_string: channel.redirect_query_string,
        rt_push: channel.rt_push,
        serv_plugin: channel.serv_plugin,
        service: channel.service,
        status: StatusEnum.APPROVED,
        target_host: channel.target_host,
        target_path: channel.target_path,
        target_port: channel.target_port,
        thread_number: channel.thread_number,
        timeout_a: channel.timeout_a,
        timeout_b: channel.timeout_b,
        timeout_c: channel.timeout_c,
      },
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  updateWrapperChannelDetailsToCheck: async (
    channel: ChannelDetailsDto,
    validationUrl: string
  ): Promise<WrapperEntitiesOperations> => {
    const result = await apiConfigClient.updateWrapperChannelDetailsUsingPUT({
      body: {
        agid: true,
        broker_description: channel.broker_description,
        broker_psp_code: channel.broker_psp_code,
        card_chart: channel.card_chart,
        channel_code: channel.channel_code,
        digital_stamp_brand: channel.digital_stamp_brand,
        enabled: true,
        flag_io: channel.flag_io,
        flagPspCp: channel.flagPspCp,
        ip: channel.ip,
        new_password: channel.new_password,
        nmp_service: channel.nmp_service,
        on_us: channel.on_us,
        password: channel.password,
        payment_model: channel.payment_model,
        payment_types: channel.payment_types,
        port: channel.port,
        primitive_version: channel.primitive_version,
        protocol: channel.protocol,
        proxy_host: channel.proxy_host,
        proxy_port: channel.proxy_port,
        recovery: channel.recovery,
        redirect_ip: channel.redirect_ip,
        redirect_path: channel.redirect_path,
        redirect_port: channel.redirect_port,
        redirect_protocol: channel.redirect_protocol,
        redirect_query_string: channel.redirect_query_string,
        rt_push: channel.rt_push,
        serv_plugin: channel.serv_plugin,
        service: channel.service,
        status: StatusEnum.TO_CHECK,
        target_host: channel.target_host,
        target_path: channel.target_path,
        target_port: channel.target_port,
        thread_number: channel.thread_number,
        timeout_a: channel.timeout_a,
        timeout_b: channel.timeout_b,
        timeout_c: channel.timeout_c,
        validationUrl,
      },
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  updateWrapperChannelDetailsToCheckUpdate: async (
    channel: ChannelDetailsDto,
    validationUrl: string
  ): Promise<WrapperEntitiesOperations> => {
    const result = await apiConfigClient.updateWrapperChannelDetailsUsingPUT({
      body: {
        agid: true,
        broker_description: channel.broker_description,
        broker_psp_code: channel.broker_psp_code,
        card_chart: channel.card_chart,
        channel_code: channel.channel_code,
        digital_stamp_brand: channel.digital_stamp_brand,
        enabled: true,
        flag_io: channel.flag_io,
        flagPspCp: channel.flagPspCp,
        ip: channel.ip,
        new_password: channel.new_password,
        nmp_service: channel.nmp_service,
        on_us: channel.on_us,
        password: channel.password,
        payment_model: channel.payment_model,
        payment_types: channel.payment_types,
        port: channel.port,
        primitive_version: channel.primitive_version,
        protocol: channel.protocol,
        proxy_host: channel.proxy_host,
        proxy_port: channel.proxy_port,
        recovery: channel.recovery,
        redirect_ip: channel.redirect_ip,
        redirect_path: channel.redirect_path,
        redirect_port: channel.redirect_port,
        redirect_protocol: channel.redirect_protocol,
        redirect_query_string: channel.redirect_query_string,
        rt_push: channel.rt_push,
        serv_plugin: channel.serv_plugin,
        service: channel.service,
        status: StatusEnum.TO_CHECK_UPDATE,
        target_host: channel.target_host,
        target_path: channel.target_path,
        target_port: channel.target_port,
        thread_number: channel.thread_number,
        timeout_a: channel.timeout_a,
        timeout_b: channel.timeout_b,
        timeout_c: channel.timeout_c,
        validationUrl,
      },
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  updateWrapperChannelDetailsByOpt: async (
    channel: ChannelDetailsDto,
    validationUrl: string
  ): Promise<WrapperEntitiesOperations> => {
    const result = await apiConfigClient.updateWrapperChannelDetailsByOptUsingPUT({
      body: {
        agid: true,
        broker_description: channel.broker_description,
        broker_psp_code: channel.broker_psp_code,
        card_chart: channel.card_chart,
        channel_code: channel.channel_code,
        digital_stamp_brand: channel.digital_stamp_brand,
        enabled: true,
        flag_io: channel.flag_io,
        flagPspCp: channel.flagPspCp,
        ip: channel.ip,
        new_password: channel.new_password,
        nmp_service: channel.nmp_service,
        on_us: channel.on_us,
        password: channel.password,
        payment_model: channel.payment_model,
        payment_types: channel.payment_types,
        port: channel.port,
        primitive_version: channel.primitive_version,
        protocol: channel.protocol,
        proxy_host: channel.proxy_host,
        proxy_port: channel.proxy_port,
        recovery: channel.recovery,
        redirect_ip: channel.redirect_ip,
        redirect_path: channel.redirect_path,
        redirect_port: channel.redirect_port,
        redirect_protocol: channel.redirect_protocol,
        redirect_query_string: channel.redirect_query_string,
        rt_push: channel.rt_push,
        serv_plugin: channel.serv_plugin,
        service: channel.service,
        status: StatusEnum.TO_CHECK_UPDATE,
        target_host: channel.target_host,
        target_path: channel.target_path,
        target_port: channel.target_port,
        thread_number: channel.thread_number,
        timeout_a: channel.timeout_a,
        timeout_b: channel.timeout_b,
        timeout_c: channel.timeout_c,
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
        brokerCode: station.brokerCode,
        stationCode: station.stationCode,
        primitiveVersion: station.primitiveVersion,
        redirectProtocol: station.redirectProtocol,
        redirectPort: station.redirectPort,
        redirectIp: station.redirectIp,
        redirectPath: station.redirectPath,
        redirectQueryString: station.redirectQueryString,
        targetHost: station.targetHost ?? undefined,
        targetPort: station.targetPort ?? undefined,
        targetPath: station.targetPath ?? undefined,
        targetHostPof: station.targetHostPof ?? undefined,
        targetPortPof: station.targetPortPof ?? undefined,
        targetPathPof: station.targetPathPof ?? undefined,
        version: station.version,
        threadNumber: station.threadNumber,
        enabled: true,
        password: station.password,
        newPassword: station.newPassword ?? undefined,
        protocol: station.protocol,
        port: station.port,
        ip: station.ip,
        service: station.service,
        pofService: station.pofService,
        protocol4Mod: station.protocol4Mod ?? undefined,
        ip4Mod: station.ip4Mod ?? undefined,
        port4Mod: station.port4Mod ?? undefined,
        service4Mod: station.service4Mod ?? undefined,
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

  createECDirect: async (
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

  getCreditorInstitutionDetails: async (
    ecCode: string
  ): Promise<CreditorInstitutionDetailsResource> => {
    const result = await apiConfigClient.getCreditorInstitutionDetailsUsingGET({ ecCode });
    return extractResponse(result, 200, onRedirectToLogin);
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
        targetHostPof: station.targetHostPof ? station.targetHostPof : undefined,
        targetPortPof: station.targetPortPof ? station.targetPortPof : undefined,
        targetPathPof: station.targetPathPof ? station.targetPathPof : undefined,
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
        brokerDescription: station.brokerDescription,
        brokerCode: station.brokerCode,
        enabled: station.enabled,
        stationCode: station.stationCode,
        primitiveVersion: station.primitiveVersion,
        redirectProtocol: station.redirectProtocol,
        redirectPort: station.redirectPort,
        redirectIp: station.redirectIp,
        redirectPath: station.redirectPath,
        redirectQueryString: station.redirectQueryString,
        targetHost: station.targetHost,
        targetPath: station.targetPath,
        targetPort: station.targetPort,
        targetHostPof: station.targetHostPof ?? undefined,
        targetPortPof: station.targetPortPof ?? undefined,
        targetPathPof: station.targetPathPof ?? undefined,
        version: station.version,
        threadNumber: station.threadNumber,
        password: station.password,
        newPassword: station.newPassword ?? undefined,
        protocol: station.protocol,
        port: station.port,
        ip: station.ip,
        service: station.service,
        pofService: station.pofService,
        protocol4Mod: station.protocol4Mod ?? undefined,
        ip4Mod: station.ip4Mod ?? undefined,
        port4Mod: station.port4Mod ?? undefined,
        service4Mod: station.service4Mod ?? undefined,
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
        brokerDescription: station.brokerDescription,
        brokerCode: station.brokerCode,
        enabled: station.enabled,
        stationCode: station.stationCode,
        primitiveVersion: station.primitiveVersion,
        redirectProtocol: station.redirectProtocol,
        redirectPort: station.redirectPort,
        redirectIp: station.redirectIp,
        redirectPath: station.redirectPath,
        redirectQueryString: station.redirectQueryString,
        targetHost: station.targetHost,
        targetPath: station.targetPath,
        targetPort: station.targetPort,
        targetHostPof: station.targetHostPof ?? undefined,
        targetPortPof: station.targetPortPof ?? undefined,
        targetPathPof: station.targetPathPof ?? undefined,
        version: station.version,
        threadNumber: station.threadNumber,
        password: station.password,
        newPassword: station.newPassword ?? undefined,
        protocol: station.protocol,
        port: station.port,
        ip: station.ip,
        service: station.service,
        pofService: station.pofService,
        protocol4Mod: station.protocol4Mod ?? undefined,
        ip4Mod: station.ip4Mod ?? undefined,
        port4Mod: station.port4Mod ?? undefined,
        service4Mod: station.service4Mod ?? undefined,
        status: StatusEnum.TO_CHECK_UPDATE,
        validationUrl,
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
        brokerDescription: station.brokerDescription,
        brokerCode: station.brokerCode,
        enabled: station.enabled,
        stationCode: station.stationCode,
        primitiveVersion: station.primitiveVersion,
        redirectProtocol: station.redirectProtocol,
        redirectPort: station.redirectPort,
        redirectIp: station.redirectIp,
        redirectPath: station.redirectPath,
        redirectQueryString: station.redirectQueryString,
        targetHost: station.targetHost,
        targetPath: station.targetPath,
        targetPort: station.targetPort,
        targetHostPof: station.targetHostPof ? station.targetHostPof : undefined,
        targetPortPof: station.targetPortPof ? station.targetPortPof : undefined,
        targetPathPof: station.targetPathPof ? station.targetPathPof : undefined,
        version: station.version,
        threadNumber: station.threadNumber,
        password: station.password,
        newPassword: station.newPassword ?? undefined,
        protocol: station.protocol,
        port: station.port,
        ip: station.ip,
        service: station.service,
        pofService: station.pofService,
        protocol4Mod: station.protocol4Mod ?? undefined,
        ip4Mod: station.ip4Mod ?? undefined,
        port4Mod: station.port4Mod ?? undefined,
        service4Mod: station.service4Mod ?? undefined,
        status: StatusEnum.TO_CHECK_UPDATE,
        validationUrl,
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
        brokerDescription: station.brokerDescription,
        brokerCode: station.brokerCode,
        enabled: station.enabled,
        stationCode: station.stationCode,
        primitiveVersion: station.primitiveVersion,
        redirectProtocol: station.redirectProtocol,
        redirectPort: station.redirectPort,
        redirectIp: station.redirectIp,
        redirectPath: station.redirectPath,
        redirectQueryString: station.redirectQueryString,
        targetHost: station.targetHost,
        targetPath: station.targetPath,
        targetPort: station.targetPort,
        targetHostPof: station.targetHostPof ?? undefined,
        targetPortPof: station.targetPortPof ?? undefined,
        targetPathPof: station.targetPathPof ?? undefined,
        version: station.version,
        threadNumber: station.threadNumber,
        password: station.password,
        newPassword: station.newPassword ?? undefined,
        protocol: station.protocol,
        port: station.port,
        ip: station.ip,
        service: station.service,
        pofService: station.pofService,
        protocol4Mod: station.protocol4Mod ?? undefined,
        ip4Mod: station.ip4Mod ?? undefined,
        port4Mod: station.port4Mod ?? undefined,
        service4Mod: station.service4Mod ?? undefined,
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

  getCreditorInstitutionIbans: async (creditorInstitutionCode: string): Promise<IbansResource> => {
    const result = await apiConfigClient.getCreditorInstitutionIbansUsingPOST({
      body: { creditorInstitutionCode },
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
        labels: ibanBody.labels,
      },
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  updateIban: async (ibanBody: IbanCreateRequestDto): Promise<IbanResource> => {
    const result = await apiConfigClient.putCreditorInstitutionIbansUsingPUT({
      body: {
        iban: ibanBody.iban,
        description: ibanBody.description,
        validityDate: ibanBody.validityDate,
        dueDate: ibanBody.dueDate,
        creditorInstitutionCode: ibanBody.creditorInstitutionCode,
        labels: ibanBody.labels,
      },
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },
};
