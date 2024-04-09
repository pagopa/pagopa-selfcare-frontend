import { BackofficeApi } from '../api/BackofficeClient';
import { CreditorInstitutionContactsResource } from '../api/generated/portal/CreditorInstitutionContactsResource';
import { getCreditorInstitutionContactsMock } from './__mocks__/creditorInsitutionService';

export const getCreditorInstitutionContacts = (
  ciTaxCode: string,
  institutionId: string
): Promise<CreditorInstitutionContactsResource> => {
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return getCreditorInstitutionContactsMock();
  } else {
    return BackofficeApi.getCreditorInstitutionContacts(ciTaxCode, institutionId);
  }
};
