/* eslint-disable sonarjs/cognitive-complexity */
import { SigninData } from '../model/Node';
import { Party } from '../model/Party';
import { ROLE } from '../model/RolePermission';
import { isOperator } from '../pages/components/commonFunctions';
import { getInstitutionApiKeys } from '../services/apiKeyService';

export const isPspBrokerSigned = (signInData: SigninData | null) =>
  signInData?.brokerPspDetailsResource &&
  Object.keys(signInData?.brokerPspDetailsResource).length > 0;

export const isPspSigned = (signInData: SigninData | null) =>
  signInData?.paymentServiceProviderDetailsResource &&
  Object.keys(signInData?.paymentServiceProviderDetailsResource).length > 0;

export const isEcBrokerSigned = (signInData: SigninData | null) =>
  signInData?.brokerDetailsResource && Object.keys(signInData?.brokerDetailsResource).length > 0;

export const isEcSigned = (signInData: SigninData | null) =>
  signInData?.creditorInstitutionDetailsResource &&
  Object.keys(signInData?.creditorInstitutionDetailsResource).length > 0;

export const hasGeneratedApiKey = async (selectedParty: Party | undefined): Promise<boolean> => {
  if (selectedParty) {
    const apiKeys = await getInstitutionApiKeys(selectedParty.partyId);
    return apiKeys && apiKeys.filter(key => key.id.startsWith('nodauth')).length > 0;
  }
  return false;
};

export const isSigned = (signInData: SigninData | null) =>
  isPspBrokerSigned(signInData) ||
  isPspSigned(signInData) ||
  isEcBrokerSigned(signInData) ||
  isEcSigned(signInData);

export const getUserRole = (party: Party, signInData?: SigninData | null): ROLE | undefined => {
  const roleKey = party.roles[0].roleKey;
  const isPSPBroker =
    signInData?.brokerPspDetailsResource &&
    Object.keys(signInData?.brokerPspDetailsResource).length > 0;
  const isECBroker =
    signInData?.brokerDetailsResource && Object.keys(signInData?.brokerDetailsResource).length > 0;

  if (isOperator()) {
    return ROLE.PAGOPA_OPERATOR;
  }

  if (party.institutionType === 'PT') {
    if (isPSPBroker && isECBroker) {
      return ROLE.PT_PSPEC_OPERATOR;
    }
    if (isPSPBroker) {
      return ROLE.PT_PSP_OPERATOR;
    }

    if (isECBroker) {
      return ROLE.PT_EC_OPERATOR;
    }

    return ROLE.PT_UNSIGNED;
  }

  if (party.institutionType === 'PSP') {
    if (isPSPBroker) {
      return roleKey === 'admin' ? ROLE.PSP_DIRECT_ADMIN : ROLE.PSP_DIRECT_OPERATOR;
    }

    return roleKey === 'admin' ? ROLE.PSP_ADMIN : ROLE.PSP_OPERATOR;
  }

  if (isECBroker) {
    return roleKey === 'admin' ? ROLE.EC_DIRECT_ADMIN : ROLE.EC_DIRECT_OPERATOR;
  }

  if (roleKey === 'operator') {
    return ROLE.EC_OPERATOR;
  }
  if (roleKey === 'admin') {
    return ROLE.EC_ADMIN;
  }
  return undefined;
};
