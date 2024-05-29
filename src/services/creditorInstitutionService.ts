import { BackofficeApi } from '../api/BackofficeClient';
import { CreditorInstitutionContactsResource } from '../api/generated/portal/CreditorInstitutionContactsResource';
import { CreditorInstitutionInfoArray } from '../api/generated/portal/CreditorInstitutionInfoArray';
import { CreditorInstitutionsResource } from '../api/generated/portal/CreditorInstitutionsResource';
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

export const getCreditorInstitutions = (
  taxCode: string,
  name: string | undefined,
  page: number,
  limit: number
): Promise<CreditorInstitutionsResource> => {
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    // TODO mock
    return {} as any;
  } else {
    return BackofficeApi.getCreditorInstitutions(taxCode, name, page, limit);
  }
};

export const getAvailableCreditorInstitutionsForStation = (
  stationCode: string,
  brokerId: string
): Promise<CreditorInstitutionInfoArray> => {
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    // TODO mock
    return {} as any;
  } else {
    return BackofficeApi.getAvailableCreditorInstitutionsForStation(stationCode, brokerId);
  }
};
