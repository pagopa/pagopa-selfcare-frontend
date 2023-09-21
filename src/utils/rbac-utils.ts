import { Party } from '../model/Party';
import { ROLE } from '../model/RolePermission';
import { isOperator } from '../pages/components/commonFunctions';

export const getUserRole = (party: Party): ROLE | undefined => {
  const roleKey = party.roles[0].roleKey;

  if (isOperator()) {
    return ROLE.PAGOPA_OPERATOR;
  }

  /*
  if (party.institutionType === 'PT') {
    // TODO: need a function to know if PT is a EC broker or PSP broker or both
    return ROLE.PT_EC_OPERATOR;
    // return ROLE.PT_PSP_OPERATOR;
  }
  */

  if (party.institutionType === 'PSP') {
    // TODO: need a function to check if psp is DIRECT or not
    return roleKey === 'admin' ? ROLE.PSP_ADMIN : ROLE.PSP_OPERATOR;
    // return roleKey === 'admin' ? ROLE.PSP_DIRECT_ADMIN : ROLE.PSP_DIRECT_OPERATOR;
  }

  // TODO: need a function to check if ec is DIRECT or not
  if (roleKey === 'operator') {
    return ROLE.EC_OPERATOR;
  }
  if (roleKey === 'admin') {
    return ROLE.EC_ADMIN;
  }
  return undefined;
};
