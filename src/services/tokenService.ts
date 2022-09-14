import { PortalApi } from '../api/PortalApiClient';
import { apiKeysResource2ProductKeys, ProductKeys } from '../model/Token';
import { getInstitutionApiKeys as getInstitutionApiKeysMocked } from './__mocks__/tokenService';

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

export const regeneratePrimaryKey = (institutionId: string): Promise<string> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_TOKEN === 'true') {
    return;
    // getInstitutionApiKeysMocked(institutionId); // nel caso di
  } else {
    return PortalApi.regeneratePrimaryKey(institutionId).then((resources) => resources);
  }
};
