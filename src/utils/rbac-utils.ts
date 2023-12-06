/* eslint-disable sonarjs/cognitive-complexity */
import { Actor } from '../api/generated/portal/Actor';
import { Party } from '../model/Party';
import { ROLE } from '../model/RolePermission';
import { isOperator } from '../pages/components/commonFunctions';
import { getInstitutionApiKeys } from '../services/apiKeyService';

export const isPspBrokerSigned = (actor: Actor | null) =>
  actor?.broker_psp &&
  Object.keys(actor?.broker_psp).length > 0;

export const isPspSigned = (actor: Actor | null) =>
  actor?.psp &&
  Object.keys(actor?.psp).length > 0;

export const isEcBrokerSigned = (actor: Actor | null) =>
  actor?.broker_ci && Object.keys(actor?.broker_ci).length > 0;

export const isEcSigned = (actor: Actor | null) =>
  actor?.ci &&
  Object.keys(actor?.ci).length > 0;

export const hasGeneratedApiKey = async (selectedParty: Party | undefined): Promise<boolean> => {
  if (selectedParty) {
    const apiKeys = await getInstitutionApiKeys(selectedParty.partyId);
    return apiKeys && apiKeys.filter(key => key.id.startsWith('nodauth')).length > 0;
  }
  return false;
};

export const isSigned = (actor: Actor | null) =>
  isPspBrokerSigned(actor) ||
  isPspSigned(actor) ||
  isEcBrokerSigned(actor) ||
  isEcSigned(actor);

export const getUserRole = (party: Party, actor?: Actor | null): ROLE | undefined => {
  const roleKey = party.roles[0].roleKey;
  const isPSPBroker =
    actor?.broker_psp &&
    Object.keys(actor?.broker_psp).length > 0;
  const isECBroker =
    actor?.broker_ci && Object.keys(actor?.broker_ci).length > 0;

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
