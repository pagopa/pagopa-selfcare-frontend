import { PortalApi } from '../api/PortalApiClient';
import { IbanCreateRequestDto } from '../api/generated/portal/IbanCreateRequestDto';
import { IbansResource } from '../api/generated/portal/IbansResource';
import { IbanOnCreation } from '../model/Iban';
import {
  getCreditorInstitutionIbans as getCreditorInstitutionIbansMocked,
  createIban as createIbanMocked,
} from './__mocks__/ibanService';

export const getIbanList = (creditorInstitutionCode: string): Promise<IbansResource> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return getCreditorInstitutionIbansMocked(creditorInstitutionCode);
  } else {
    return PortalApi.getCreditorInstitutionIbans(creditorInstitutionCode).then(
      (resources) => resources
    );
  }
};

export const createIban = (iban: IbanCreateRequestDto): Promise<any> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return createIbanMocked(iban);
  } else {
    return PortalApi.createIban(iban).then((resources) => resources);
  }
};
