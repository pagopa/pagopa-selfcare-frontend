import { ReactNode } from 'react';
import { storageTokenOps } from '@pagopa/selfcare-common-frontend/utils/storage';
import { appStateActions } from '@pagopa/selfcare-common-frontend/redux/slices/appStateSlice';
import { buildFetchApi, extractResponse } from '@pagopa/selfcare-common-frontend/utils/api-utils';
import i18n from '@pagopa/selfcare-common-frontend/locale/locale-utils';
import { store } from '../redux/store';
import { ENV } from '../utils/env';
import { ProductKeys } from '../model/ApiKey';
import { createClient, WithDefaultsT } from './generated/portal/client';

import { InstitutionResource } from './generated/portal/InstitutionResource';
import { InstitutionDetailResource } from './generated/portal/InstitutionDetailResource';
import { ProductsResource } from './generated/portal/ProductsResource';

const withBearerAndPartyId: WithDefaultsT<'bearerAuth'> = (wrappedOperation) => (params: any) => {
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
  withDefaults: withBearerAndPartyId,
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
};
