import { ReactNode } from 'react';
import { storageTokenOps } from '@pagopa/selfcare-common-frontend/utils/storage';
import { appStateActions } from '@pagopa/selfcare-common-frontend/redux/slices/appStateSlice';
import { buildFetchApi, extractResponse } from '@pagopa/selfcare-common-frontend/utils/api-utils';
import i18n from '@pagopa/selfcare-common-frontend/locale/locale-utils';
import { store } from '../redux/store';
import { ENV } from '../utils/env';
// import { ProductKeys } from '../model/Token';
import { createClient, WithDefaultsT } from './generated/portal/client';

import { InstitutionResource } from './generated/portal/InstitutionResource';
import { InstitutionDetailResource } from './generated/portal/InstitutionDetailResource';
import { ProductsResource } from './generated/portal/ProductsResource';

const withBearerAndPartyId: WithDefaultsT<'bearerAuth'> = (wrappedOperation) => (params: any) => {
  const token = storageTokenOps.read();
  const token2 =
    'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Imp3dF9kZjplNjoxOTplYToxZTpjZTplNjo3Yjo3MDo0MjoyYzphMjpjZDo4Yjo1MjowYiJ9.eyJlbWFpbCI6Implc3VzLm1hcnRpbi5uYXZhcnJvLm9ydGl6NjhAZ21haWwuY29tIiwiZmFtaWx5X25hbWUiOiJOYXZhcnJvIE9ydGl6IiwiZmlzY2FsX251bWJlciI6Ik5aS0pITTc1VDE3TDQzNFAiLCJuYW1lIjoiSmVzdXMgTWFydGluIiwiZnJvbV9hYSI6ZmFsc2UsInVpZCI6ImI4YjZjOWE3LTJiZWMtNGVmYi1hYWZmLTU2ODdmZTY1OTVjYyIsImxldmVsIjoiTDIiLCJpYXQiOjE2NjQ4NzQ3NjgsImV4cCI6MTY2NDkwNzE2OCwiYXVkIjoiYXBpLmRldi5zZWxmY2FyZS5wYWdvcGEuaXQiLCJpc3MiOiJTUElEIiwianRpIjoiMDFHRUg0OVNSQUFCVlk5VFAwRkZQOUFRRDEifQ.RdlNzAJSJ8vxE6PjEc3eh1ZsTEaZCBdcCqdCB8xMSz9-AsPosVh5qGfD2JDOD3rNBkVtNChS2LNd3LSr5uFrAzZwLCctavmDSi4SVfyLkMIr0ClTF2137gcJDMTbBhFyijKwTTdaT0RPpVvLgj897TREDjD-fJwMkpmpVeMXJkeETbz_K4YDG4cO6Ukw-9_exu0yXCjQoG-tdCfx6hrMdUqCW86gTnfsu42tJEIYzJWuIS2xCAZl45VlUpNbANwdm3xaAeFKuVjsb4YWXV74Vlhqjgf8psQ_0RSyKtVnGUZYPVAnPZCEjSlD-wKZrdEbJuKCfSwERaiK3-KeArwUAQ';
  console.log(token);
  return wrappedOperation({
    ...params,
    bearerAuth: `Bearer ${token2}`,
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

  /*
  getTokenExchange: async (
    institutionId: string,
    productId: string
  ): Promise<IdentityTokenResource> => {
    const result = await apiClient.exchangeUsingGET({
      productId,
      institutionId,
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },
*/
  /*
  getProductRoles: async (productId: string): Promise<Array<ProductRoleMappingsResource>> => {
    const result = await apiClient.getProductRolesUsingGET({
      productId,
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },
*/

  // TODO: implement with SELC-1538
  // getInstitutionApiKeys: async (institutionId: string): Promise<ProductKeys> => {
  //   const result = await apiClient.getInstitutionApiKeysUsingGET({ institutionId });
  //   return extractResponse(result, 200, onRedirectToLogin);
  // },
  // createInstitutionApiKeys: async (institutionId: string): Promise<ProductKeys> => {
  //   const result = await apiClient.createInstitutionApiKeysUsingPOST({ institutionId });
  //   return extractResponse(result, 201, onRedirectToLogin);
  // },
  // regeneratePrimaryKey: async (institutionId: string): Promise<string> => {
  //   const result = await apiClient.regeneratePrimaryKeyUsingPOST({ institutionId });
  //   return extractResponse(result, 204, onRedirectToLogin);
  // },

  // regenerateSecondaryKey: async (institutionId: string): Promise<string> => {
  //   const result = await apiClient.regenerateSecondaryKeyUsingPOST({ institutionId });
  //   return extractResponse(result, 201, onRedirectToLogin);
  // },
};
