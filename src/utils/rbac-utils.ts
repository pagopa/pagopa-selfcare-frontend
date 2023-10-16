/* eslint-disable sonarjs/cognitive-complexity */
import { BrokerOrPspDetailsResource } from '../api/generated/portal/BrokerOrPspDetailsResource';
import { SigninData } from '../model/Node';
import { Party } from '../model/Party';
import { ROLE } from '../model/RolePermission';
import { isOperator } from '../pages/components/commonFunctions';

export const getUserRole = (party: Party, signInData?: SigninData): ROLE | undefined => {
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
