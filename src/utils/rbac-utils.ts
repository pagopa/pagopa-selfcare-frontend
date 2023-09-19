import { Party } from '../model/Party';
import { ROLE } from '../model/RolePermission';
import { isOperator } from '../pages/components/commonFunctions';

export const getUserRole = (party: Party): ROLE | undefined => {
  const roleKey = party.roles[0].roleKey;

  if (isOperator()) {
    return ROLE.PAGOPA_OPERATOR;
  }
  if (party.institutionType === 'PSP' && roleKey === 'operator') {
    return ROLE.PSP_OPERATOR;
  }
  if (party.institutionType === 'PSP' && roleKey === 'admin') {
    return ROLE.PSP_ADMIN;
  }
  if (party.institutionType === 'PT' && roleKey === 'operator') {
    return ROLE.PT_OPERATOR;
  }
  if (party.institutionType === 'PT' && roleKey === 'admin') {
    return ROLE.PT_ADMIN;
  }
  if (roleKey === 'operator') {
    return ROLE.EC_OPERATOR;
  }
  if (roleKey === 'admin') {
    return ROLE.EC_ADMIN;
  }
  return undefined;
};
