import {Party} from '../model/Party';
import {Delegation} from '../api/generated/portal/Delegation';
import {INSTITUTIONS_PSP_TYPES} from './constants';
import {checkInstitutionTypes} from './institution-types-utils';

export const addCurrentPSP = (availablePSP: Array<Delegation>, selectedParty: Party) => {
  const value = {
    institution_name: selectedParty?.description ?? '',
    institution_id: selectedParty.partyId,
    tax_code: selectedParty.fiscalCode,
    broker_id: selectedParty.fiscalCode
  };

  if (checkInstitutionTypes(selectedParty?.institutionType as string, INSTITUTIONS_PSP_TYPES)) {
    // eslint-disable-next-line functional/immutable-data
    availablePSP.push(value);
  }

  return availablePSP;
};
