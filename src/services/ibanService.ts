import { BackofficeApi } from '../api/BackofficeClient';
import {Ibans} from "../api/generated/portal/Ibans";
import {Iban} from "../api/generated/portal/Iban";
import {IbanCreate} from "../api/generated/portal/IbanCreate";
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
): Promise<Ibans> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return getCreditorInstitutionIbansMocked(creditorInstitutionCode, labelName);
  } else {
    return BackofficeApi.getCreditorInstitutionIbans(creditorInstitutionCode, labelName).then(
      (resources) => resources
    );
  }
};

export const createIban = (ciCode: string, iban: IbanCreate): Promise<Iban> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return createIbanMocked(iban);
  } else {
    return BackofficeApi.createIban(ciCode, iban).then((resources) => resources);
  }
};

export const updateIban = (ciCode: string, iban: IbanCreate): Promise<Iban> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return updateIbanMocked(iban);
  } else {
    return BackofficeApi.updateIban(ciCode, iban).then((resources) => resources);
  }
};

export const updateIbanStandIn = (ciCode: string, iban: IbanCreate): Promise<Iban> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return updateIbanStandInMocked(iban);
  } else {
    return BackofficeApi.updateIban(ciCode, iban).then((resources) => resources);
  }
};

export const updateIbanCup = (ciCode: string, iban: IbanCreate): Promise<Iban> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return updateIbanCupMocked(iban);
  } else {
    return BackofficeApi.updateIban(ciCode, iban).then((resources) => resources);
  }
};

export const deleteIban = (ecCode: string, ibanValue: string): Promise<void> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return deleteIbanMocked(ecCode, ibanValue);
  } else {
    return BackofficeApi.deleteIban(ecCode, ibanValue).then((resources) => resources);
  }
};
