import { PortalApi } from '../api/PortalApiClient';
import { apiKeysResource2ProductKeys, ProductKeys } from '../model/Token';
import {
  getInstitutionApiKeys as getInstitutionApiKeysMocked,
  createInstitutionApiKeys as createInstitutionApiKeysMocked,
  regeneratePrimaryKey as regeneratePrimaryKeyMocked,
  regenerateSecondaryKey as regenerateSecondaryKeyMocked,
} from './__mocks__/apiKeyService';

export const getInstitutionApiKeys = (institutionId: string): Promise<ProductKeys> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return getInstitutionApiKeysMocked(institutionId);
  } else {
    return PortalApi.getInstitutionApiKeys(institutionId).then(
      (resources) => resources && apiKeysResource2ProductKeys(resources)
    );
  }
};

export const createInstitutionApiKeys = (institutionId: string): Promise<ProductKeys> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return createInstitutionApiKeysMocked(institutionId);
  } else {
    return PortalApi.createInstitutionApiKeys(institutionId).then(
      (resources) => resources && apiKeysResource2ProductKeys(resources)
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
