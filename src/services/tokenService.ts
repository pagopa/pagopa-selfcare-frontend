import { PortalApi } from '../api/PortalApiClient';
import { apiKeysResource2ProductKeys, ProductKeys } from '../model/Token';
import {
  getInstitutionApiKeys as getInstitutionApiKeysMocked,
  createInstitutionApiKeys as createInstitutionApiKeysMocked,
  regeneratePrimaryKey as regeneratePrimaryKeyMocked,
  regenerateSecondaryKey as regenerateSecondaryKeyMocked,
} from './__mocks__/tokenService';

export const getInstitutionApiKeys = (institutionId: string): Promise<ProductKeys> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_TOKEN === 'true') {
    return getInstitutionApiKeysMocked(institutionId);
  } else {
    return PortalApi.getInstitutionApiKeys(institutionId).then(
      (resources) => resources && apiKeysResource2ProductKeys(resources)
    );
  }
};

export const createInstitutionApiKeys = (institutionId: string): Promise<ProductKeys> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_TOKEN === 'true') {
    return createInstitutionApiKeysMocked(institutionId);
  } else {
    return PortalApi.createInstitutionApiKeys(institutionId).then(
      (resources) => resources && apiKeysResource2ProductKeys(resources)
    );
  }
};

export const regeneratePrimaryKey = (institutionId: string): Promise<string> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_TOKEN === 'true') {
    return regeneratePrimaryKeyMocked(institutionId);
    // getInstitutionApiKeysMocked(institutionId);
  } else {
    return PortalApi.regeneratePrimaryKey(institutionId).then((resource) => resource);
  }
};

export const regenerateSecondaryKey = (institutionId: string): Promise<string> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_TOKEN === 'true') {
    return regenerateSecondaryKeyMocked(institutionId);
    // getInstitutionApiKeysMocked(institutionId);
  } else {
    return PortalApi.regenerateSecondaryKey(institutionId).then((resources) => resources);
  }
};
