import { ReactNode } from 'react';
import { storageTokenOps } from '@pagopa/selfcare-common-frontend/utils/storage';
import { appStateActions } from '@pagopa/selfcare-common-frontend/redux/slices/appStateSlice';
import { buildFetchApi, extractResponse } from '@pagopa/selfcare-common-frontend/utils/api-utils';
import i18n from '@pagopa/selfcare-common-frontend/locale/locale-utils';
import { store } from '../redux/store';
import { ENV } from '../utils/env';
import { ProductKeys } from '../model/Token';
import { createClient, WithDefaultsT } from './generated/portal/client';
import { InstitutionResource } from './generated/portal/InstitutionResource';
import { ProductsResource } from './generated/portal/ProductsResource';
// import { IdentityTokenResource } from './generated/portal/IdentityTokenResource';
// import { ProductRoleMappingsResource } from './generated/portal/ProductRoleMappingsResource';

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
  getInstitutions: async (): Promise<Array<InstitutionResource>> => {
    const result = await apiClient.getInstitutionsUsingGET({});
    return extractResponse(result, 200, onRedirectToLogin);
  },

  getInstitution: async (institutionId: string): Promise<InstitutionResource> => {
    const result = await apiClient.getInstitutionUsingGET({
      institutionId,
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  getProducts: async (institutionId: string): Promise<Array<ProductsResource>> => {
    const result = await apiClient.getInstitutionProductsUsingGET({ institutionId });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  getInstitutionApiKeys: async (institutionId: string): Promise<ProductKeys> => {
    const result = await apiClient.getInstitutionApiKeysUsingGET({ institutionId });
    return extractResponse(result, 200, onRedirectToLogin);
  },
  createInstitutionApiKeys: async (institutionId: string): Promise<ProductKeys> => {
    const result = await apiClient.createInstitutionApiKeysUsingPOST({ institutionId });
    return extractResponse(result, 201, onRedirectToLogin);
  },
  regeneratePrimaryKey: async (institutionId: string): Promise<string> => {
    const result = await apiClient.regeneratePrimaryKeyUsingPOST({ institutionId });
    return extractResponse(result, 204, onRedirectToLogin);
  },

  regenerateSecondaryKey: async (institutionId: string): Promise<string> => {
    const result = await apiClient.regenerateSecondaryKeyUsingPOST({ institutionId });
    return extractResponse(result, 201, onRedirectToLogin);
  },
};
