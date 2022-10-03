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
    'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Imp3dF9kZjplNjoxOTplYToxZTpjZTplNjo3Yjo3MDo0MjoyYzphMjpjZDo4Yjo1MjowYiJ9.eyJlbWFpbCI6Implc3VzLm1hcnRpbi5uYXZhcnJvLm9ydGl6NjhAZ21haWwuY29tIiwiZmFtaWx5X25hbWUiOiJOYXZhcnJvIE9ydGl6IiwiZmlzY2FsX251bWJlciI6Ik5aS0pITTc1VDE3TDQzNFAiLCJuYW1lIjoiSmVzdXMgTWFydGluIiwiZnJvbV9hYSI6ZmFsc2UsInVpZCI6ImI4YjZjOWE3LTJiZWMtNGVmYi1hYWZmLTU2ODdmZTY1OTVjYyIsImxldmVsIjoiTDIiLCJpYXQiOjE2NjQ3OTU0MTksImV4cCI6MTY2NDgyNzgxOSwiYXVkIjoiYXBpLmRldi5zZWxmY2FyZS5wYWdvcGEuaXQiLCJpc3MiOiJTUElEIiwianRpIjoiMDFHRUVSTThaMFc2RVAxVFk4WVlUQ0RaOTEifQ.bKs45saXs9Px0RfmLVRWK9ZaO7ejxJ6Hd1kRrCl6DdPElhCX79Kx5ZCpW_d0-CaDFiogfmpz8IUooPM6JKz9Fcp0KMeAyg-FnLn_iM51XX2mWYzctDEKUqBAtSbhHWeBU88eNbir8CMURnQyuZ_1OQhJA0Uv1xop_K9qq-6My8zBEC8rXcNQMn9Mrlu1dWOalrqsuj3nuqR2eZ0wvBKOm4KAZljIMgE1s19Vgq4dTFD0M-Fb-VMMzwlUlFL01EUGnm7AxYQ8qFLWcL4t2gDDMpGRHXJaFD1juFnuGy11HgOjhG8EoLlppcOOAyj-L48rhcqk6Q8KjraTGRh2h1O2gg';
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
