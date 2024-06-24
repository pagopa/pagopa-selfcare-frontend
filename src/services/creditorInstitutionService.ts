import {BackofficeApi} from '../api/BackofficeClient';
import {CreditorInstitutionContactsResource} from '../api/generated/portal/CreditorInstitutionContactsResource';
import {CreditorInstitutionInfoResource} from '../api/generated/portal/CreditorInstitutionInfoResource';
import {CreditorInstitutionsResource} from '../api/generated/portal/CreditorInstitutionsResource';
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
        return BackofficeApi.getCreditorInstitutionContacts(ciTaxCode, institutionId);
    }
};

<<<<<<< HEAD
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
    return BackofficeApi.getCreditorInstitutions({
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
    return BackofficeApi.getAvailableCreditorInstitutionsForStation({
      stationCode,
      brokerId,
      ciName,
    });
  }
=======
export const getCreditorInstitutions = (
    taxCode: string,
    name: string | undefined,
    page: number,
    limit: number
): Promise<CreditorInstitutionsResource> => {
    if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
        return getCreditorInstitutionssMock();
    } else {
        return BackofficeApi.getCreditorInstitutions(taxCode, name, page, limit);
    }
};

export const getAvailableCreditorInstitutionsForStation = (
    stationCode: string,
    brokerId: string
): Promise<CreditorInstitutionInfoResource> => {
    if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
        return getAvailableCreditorInstitutionsForStationMock();
    } else {
        return BackofficeApi.getAvailableCreditorInstitutionsForStation(stationCode, brokerId);
    }
>>>>>>> 3f32cfc3 (Formatting (#542))
};
