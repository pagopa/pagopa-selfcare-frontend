import { PortalApi } from '../api/PortalApiClient';
import { IbanCreateRequestDto } from '../api/generated/portal/IbanCreateRequestDto';
import { IbanResource } from '../api/generated/portal/IbanResource';
import { IbansResource } from '../api/generated/portal/IbansResource';
import { IbanOnCreation } from '../model/Iban';
import { emptyIban } from '../pages/iban/IbanPage';
import {
  getCreditorInstitutionIbans as getCreditorInstitutionIbansMocked,
  createIban as createIbanMocked,
  updateIban as updateIbanMocked,
  updateIbanStandIn as updateIbanStandInMocked,
  updateIbanCup as updateIbanCupMocked,
  deleteIban as deleteIbanMocked,
} from './__mocks__/ibanService';

export const getIbanList = (
  creditorInstitutionCode: string,
  labelName?: string
): Promise<IbansResource> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return getCreditorInstitutionIbansMocked(creditorInstitutionCode, labelName);
  } else {
    return PortalApi.getCreditorInstitutionIbans(creditorInstitutionCode, labelName).then(
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

export const updateIban = (iban: IbanCreateRequestDto): Promise<any> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return updateIbanMocked(iban);
  } else {
    return PortalApi.updateIban(iban).then((resources) => resources);
  }
};

export const updateIbanStandIn = (iban: IbanCreateRequestDto): Promise<any> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return updateIbanStandInMocked(iban);
  } else {
    return PortalApi.updateIban(iban).then((resources) => resources);
  }
};

export const updateIbanCup = (iban: IbanCreateRequestDto): Promise<any> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return updateIbanCupMocked(iban);
  } else {
    return PortalApi.updateIban(iban).then((resources) => resources);
  }
};

export const deleteIban = (ecCode: string, ibanValue: string): Promise<void> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return deleteIbanMocked(ecCode, ibanValue);
  } else {
    return PortalApi.deleteIban(ecCode, ibanValue).then((resources) => resources);
  }
};
