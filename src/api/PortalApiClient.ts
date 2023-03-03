import { ReactNode } from 'react';
import { storageTokenOps } from '@pagopa/selfcare-common-frontend/utils/storage';
import { appStateActions } from '@pagopa/selfcare-common-frontend/redux/slices/appStateSlice';
import { buildFetchApi, extractResponse } from '@pagopa/selfcare-common-frontend/utils/api-utils';
import i18n from '@pagopa/selfcare-common-frontend/locale/locale-utils';
import { store } from '../redux/store';
import { ENV } from '../utils/env';
import { ProductKeys } from '../model/ApiKey';
import { ChannelOnCreation } from '../model/Channel';
import { InstitutionResource } from './generated/portal/InstitutionResource';
import { InstitutionDetailResource } from './generated/portal/InstitutionDetailResource';
import { ProductsResource } from './generated/portal/ProductsResource';
import { ChannelsResource } from './generated/portal/ChannelsResource';
import { createClient, WithDefaultsT } from './generated/portal/client';
import { PspChannelsResource } from './generated/portal/PspChannelsResource';
import { ChannelDetailsResource } from './generated/portal/ChannelDetailsResource';
import { PaymentTypesResource } from './generated/portal/PaymentTypesResource';
import { StationsResource } from './generated/portal/StationsResource';

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

  getChannels: async (page: number): Promise<ChannelsResource> => {
    const result = await apiConfigClient.getChannelsUsingGET({ page });
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
      },
    });
    return extractResponse(result, 201, onRedirectToLogin);
  },

  getPaymentTypes: async (): Promise<PaymentTypesResource> => {
    const result = await apiConfigClient.getPaymentTypesUsingGET({});
    return extractResponse(result, 200, onRedirectToLogin);
  },

  // eslint-disable-next-line arrow-body-style
  getChannelPSPs: async (_page: number): Promise<ChannelsResource> => {
    /* TODO: change when GET will be available */
    // const result = await apiConfigClient.getChannelPSPsUsingGET({ page });

    // return extractResponse(result, 200, onRedirectToLogin);
    return {
      channels: [],
      page_info: {
        items_found: 0,
        limit: 0,
        page: 0,
        total_pages: 0,
      },
    };
  },

  getStations: async (page: number): Promise<StationsResource> => {
    const result = await apiConfigClient.getStationsUsingGET({ page });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  dissociatePSPfromChannel: async (channelcode: string, pspcode: string): Promise<void> => {
    const result = await apiConfigClient.deletePaymentServiceProvidersChannelsUsingDELETE({
      channelcode,
      pspcode,
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },
};
