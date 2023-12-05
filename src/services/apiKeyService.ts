import { BackofficeApi } from '../api/BackofficeClient';
import { ProductKeys } from '../model/ApiKey';
import {ENV} from "../utils/env";
import {
  getInstitutionApiKeys as getInstitutionApiKeysMocked,
  createInstitutionApiKeys as createInstitutionApiKeysMocked,
  regeneratePrimaryKey as regeneratePrimaryKeyMocked,
  regenerateSecondaryKey as regenerateSecondaryKeyMocked,
} from './__mocks__/apiKeyService';

export const getInstitutionApiKeys = (institutionId: string): Promise<Array<ProductKeys>> => {
  /* istanbul ignore if */
  if (ENV.MOCK.TOKEN) {
    return getInstitutionApiKeysMocked(institutionId);
  } else {
    return BackofficeApi.getInstitutionApiKeys(institutionId).then((resources) => resources);
  }
};

export const createInstitutionApiKeys = (
  institutionId: string,
  subscriptionCode: string
): Promise<Array<ProductKeys>> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return createInstitutionApiKeysMocked(institutionId, subscriptionCode);
  } else {
    return BackofficeApi.createInstitutionApiKeys(institutionId, subscriptionCode).then(
      (resources) => resources
    );
  }
};

export const regeneratePrimaryKey = (institutionId: string): Promise<string> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return regeneratePrimaryKeyMocked(institutionId);
  } else {
    return BackofficeApi.regeneratePrimaryKey(institutionId).then((resource) => resource);
  }
};

export const regenerateSecondaryKey = (institutionId: string): Promise<string> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return regenerateSecondaryKeyMocked(institutionId);
  } else {
    return BackofficeApi.regenerateSecondaryKey(institutionId).then((resources) => resources);
  }
};
