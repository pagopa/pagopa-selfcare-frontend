import { BackofficeApi } from '../api/BackofficeClient';
import { CreditorInstitutionContactsResource } from '../api/generated/portal/CreditorInstitutionContactsResource';
import { CreditorInstitutionInfoResource } from '../api/generated/portal/CreditorInstitutionInfoResource';
import { CreditorInstitutionsResource } from '../api/generated/portal/CreditorInstitutionsResource';
import {
  getAvailableCreditorInstitutionsForStationMock,
  getCreditorInstitutionContactsMock,
  getCreditorInstitutionssMock,
} from './__mocks__/creditorInstitutionService';

export const getCreditorInstitutionContacts = (
  ciTaxCode: string,
  institutionId: string
): Promise<CreditorInstitutionContactsResource> => {
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return getCreditorInstitutionContactsMock();
  } else {
    return BackofficeApi.creditorInstitutions.getCreditorInstitutionContacts(ciTaxCode, institutionId);
  }
};

export const getCreditorInstitutions = ({
  ciTaxCode,
  ciName,
  page,
  limit,
}: {
  ciTaxCode?: string;
  ciName?: string;
  page: number;
  limit: number;
}): Promise<CreditorInstitutionsResource> => {
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return getCreditorInstitutionssMock();
  } else {
    return BackofficeApi.creditorInstitutions.getCreditorInstitutions({
      ciTaxCode,
      ciName,
      page,
      limit,
    });
  }
};

export const getAvailableCreditorInstitutionsForStation = ({
  stationCode,
  brokerId,
  ciName,
}: {
  stationCode: string;
  brokerId: string;
  ciName?: string;
}): Promise<CreditorInstitutionInfoResource> => {
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return getAvailableCreditorInstitutionsForStationMock();
  } else {
    return BackofficeApi.creditorInstitutions.getAvailableCreditorInstitutionsForStation({
      stationCode,
      brokerId,
      ciName,
    });
  }
};
