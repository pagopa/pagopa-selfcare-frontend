import { ReactNode } from 'react';
import { storageTokenOps } from '@pagopa/selfcare-common-frontend/utils/storage';
import { appStateActions } from '@pagopa/selfcare-common-frontend/redux/slices/appStateSlice';
import { buildFetchApi, extractResponse } from '@pagopa/selfcare-common-frontend/utils/api-utils';
import i18n from '@pagopa/selfcare-common-frontend/locale/locale-utils';
import { store } from '../redux/store';
import { ENV } from '../utils/env';
import { ProductKeys } from '../model/ApiKey';
import { ChannelOnCreation } from '../model/Channel';
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
// import { StationDetailsDto } from './generated/portal/StationDetailsDto';
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
import { WrapperChannelsResource } from './generated/portal/WrapperChannelsResource';
import { WrapperEntitiesOperations } from './generated/portal/WrapperEntitiesOperations';
import { WrapperChannelDetailsDto } from './generated/portal/WrapperChannelDetailsDto';
import { ChannelDetailsDto } from './generated/portal/ChannelDetailsDto';

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
        transfer: true,
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
    _brokerCode: string,
    channelcodefilter?: string,
    limit?: number,
    sorting?: string
  ): Promise<WrapperChannelsResource> => {
    const result = await apiConfigClient.getAllChannelsMergedUsingGET({
      limit,
      channelcodefilter,
      page,
      sorting,
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  getChannelDetail: async (channelcode: string): Promise<ChannelDetailsResource> => {
    const result = await apiConfigClient.getChannelDetailsUsingGET({ channelcode });
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

  createChannel: async (channel: ChannelOnCreation): Promise<ChannelDetailsResource> => {
    const result = await apiConfigClient.createChannelUsingPOST({
      body: {
        broker_psp_code: channel.pspBrokerCode,
        broker_description: channel.businessName,
        channel_code: channel.idChannel,
        redirect_protocol: channel.redirectProtocol,
        redirect_port: channel.redirectPort,
        redirect_ip: channel.redirectIp,
        redirect_path: channel.redirectService,
        redirect_query_string: channel.redirectParameters,
        target_host: channel.targetAddress,
        target_path: channel.targetService,
        target_port: channel.targetPort,
        payment_types: channel.paymentType,
      },
    });
    return extractResponse(result, 201, onRedirectToLogin);
  },

  updateChannel: async (channel: ChannelOnCreation): Promise<ChannelDetailsResource> => {
    const result = await apiConfigClient.updateChannelUsingPUT({
      channelcode: channel.idChannel,
      body: {
        broker_psp_code: channel.pspBrokerCode,
        broker_description: channel.businessName,
        channel_code: channel.idChannel,
        redirect_protocol: channel.redirectProtocol,
        redirect_port: channel.redirectPort,
        redirect_ip: channel.redirectIp,
        redirect_path: channel.redirectService,
        redirect_query_string: channel.redirectParameters,
        target_host: channel.targetAddress,
        target_path: channel.targetService,
        target_port: channel.targetPort,
        payment_types: channel.paymentType,
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
    const result = await apiConfigClient.updatePaymentServiceProvidersChannelsUsingPUT({
      channelcode,
      pspcode,
      body: payment_types,
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
      body: { auxDigit: 0, segregationCode: 0, stationCode: station.stationCode },
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

  getWrapperEntities: async (code: string): Promise<WrapperEntitiesOperations> => {
    const result = await apiConfigClient.getWrapperEntitiesUsingGET({ code });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  createWrapperChannelDetails: async (
    channel: WrapperChannelDetailsDto
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
      },
    });
    return extractResponse(result, 201, onRedirectToLogin);
  },

  updateWrapperChannelDetails: async (
    channel: ChannelDetailsDto
  ): Promise<WrapperEntitiesOperations> => {
    const result = await apiConfigClient.updateWrapperChannelDetailsUsingPUT({
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
      },
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  createWrapperStation: async (
    station: WrapperStationDetailsDto
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
      },
    });
    return extractResponse(result, 201, onRedirectToLogin);
  },

  updateWrapperStationToCheck: async (
    station: StationDetailsDto
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
      },
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  updateWrapperStationToCheckUpdate: async (
    station: StationDetailsDto
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
      },
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  updateWrapperStationByOpt: async (
    station: StationDetailsDto
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
};
