import { BackofficeApi } from '../api/BackofficeClient';
import { InstitutionApiKeysResource } from '../api/generated/portal/InstitutionApiKeysResource';
import {
    createInstitutionApiKeys as createInstitutionApiKeysMocked,
    getInstitutionApiKeys as getInstitutionApiKeysMocked,
    regeneratePrimaryKey as regeneratePrimaryKeyMocked,
    regenerateSecondaryKey as regenerateSecondaryKeyMocked,
} from './__mocks__/apiKeyService';

export const getInstitutionApiKeys = (
  institutionId: string
): Promise<InstitutionApiKeysResource> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return getInstitutionApiKeysMocked(institutionId);
  } else {
    return BackofficeApi.getInstitutionApiKeys(institutionId).then((resources) => resources);
  }
};

export const createInstitutionApiKeys = (
  institutionId: string,
  subscriptionCode: string
): Promise<InstitutionApiKeysResource> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return createInstitutionApiKeysMocked(institutionId, subscriptionCode);
  } else {
    return BackofficeApi.createInstitutionApiKeys(institutionId, subscriptionCode).then(
      (resources) => resources
    );
  }
};

export const regeneratePrimaryKey = (
  institutionId: string,
  subscriptionId: string
): Promise<string> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return regeneratePrimaryKeyMocked(institutionId, subscriptionId);
  } else {
    return BackofficeApi.regeneratePrimaryKey(institutionId, subscriptionId).then(
      (resource) => resource
    );
  }
};

export const regenerateSecondaryKey = (
  institutionId: string,
  subscriptionId: string
): Promise<string> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return regenerateSecondaryKeyMocked(institutionId, subscriptionId);
  } else {
    return BackofficeApi.regenerateSecondaryKey(institutionId, subscriptionId).then(
      (resources) => resources
    );
  }
};
