import { PortalApi } from '../api/PortalApiClient';
import { ProductKeys } from '../model/ApiKey';
import {
  getInstitutionApiKeys as getInstitutionApiKeysMocked,
  createInstitutionApiKeys as createInstitutionApiKeysMocked,
  regeneratePrimaryKey as regeneratePrimaryKeyMocked,
  regenerateSecondaryKey as regenerateSecondaryKeyMocked,
} from './__mocks__/apiKeyService';

export const getInstitutionApiKeys = (institutionId: string): Promise<Array<ProductKeys>> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return getInstitutionApiKeysMocked(institutionId);
  } else {
    return PortalApi.getInstitutionApiKeys(institutionId).then((resources) => resources);
  }
};

export const createInstitutionApiKeys = (
  institutionId: string,
  subscriptionCode: string
): Promise<Array<ProductKeys>> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return createInstitutionApiKeysMocked(institutionId, subscriptionCode);
  } else {
    return PortalApi.createInstitutionApiKeys(institutionId, subscriptionCode).then(
      (resources) => resources
    );
  }
};

export const regeneratePrimaryKey = (institutionId: string): Promise<string> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return regeneratePrimaryKeyMocked(institutionId);
  } else {
    return PortalApi.regeneratePrimaryKey(institutionId).then((resource) => resource);
  }
};

export const regenerateSecondaryKey = (institutionId: string): Promise<string> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return regenerateSecondaryKeyMocked(institutionId);
  } else {
    return PortalApi.regenerateSecondaryKey(institutionId).then((resources) => resources);
  }
};
