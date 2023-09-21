import { getUserRole } from '../rbac-utils'; // Import your module
import * as utils from '../../pages/components/commonFunctions';
import { ROLE } from '../../model/RolePermission';
import {
  ecAdminSigned,
  ecOperatorUnsigned,
  pspAdminUnsigned,
  pspOperatorSigned,
} from '../../services/__mocks__/partyService';
import { Party } from '../../model/Party';

describe('getUserRole function', () => {
  jest.mock('../../pages/components/commonFunctions');

  test('should return ROLE.PAGOPA_OPERATOR when isOperator() is true', () => {
    jest.spyOn(utils, 'isOperator').mockReturnValue(true);

    const result = getUserRole(pspOperatorSigned);
    expect(result).toBe(ROLE.PAGOPA_OPERATOR);
  });

  test('should return ROLE.PSP_OPERATOR when party is a PSP with roleKey "operator"', () => {
    jest.spyOn(utils, 'isOperator').mockReturnValue(false);
    const result = getUserRole(pspOperatorSigned);
    expect(result).toBe(ROLE.PSP_OPERATOR);
  });

  test('should return ROLE.PSP_ADMIN when party is a PSP with roleKey "admin"', () => {
    jest.spyOn(utils, 'isOperator').mockReturnValue(false);
    const result = getUserRole(pspAdminUnsigned);
    expect(result).toBe(ROLE.PSP_ADMIN);
  });

  test('should return ROLE.EC_OPERATOR when party is an EC with roleKey "operator"', () => {
    jest.spyOn(utils, 'isOperator').mockReturnValue(false);
    const result = getUserRole(ecOperatorUnsigned);
    expect(result).toBe(ROLE.EC_OPERATOR);
  });

  test('should return ROLE.EC_ADMIN when party is an EC with roleKey "admin"', () => {
    jest.spyOn(utils, 'isOperator').mockReturnValue(false);
    const result = getUserRole(ecAdminSigned);
    expect(result).toBe(ROLE.EC_ADMIN);
  });

  test('should return undefined if all condition is unmatched', () => {
    jest.spyOn(utils, 'isOperator').mockReturnValue(false);

    const result = getUserRole(partyBroken);
    expect(result).toBe(undefined);
  });
});

export const partyBroken: Party = {
  partyId: 'PartyTest-123',
  externalId: 'PartyTest-123',
  originId: 'PartyTest-123',
  origin: 'SELC',
  description: 'Party test',
  fiscalCode: 'PartyTest-123',
  digitalAddress: 'PartyTest-123@test.dummy',
  status: 'ACTIVE',
  registeredOffice: 'VIA DEI PartyTest-123 20, ROMA',
  roles: [
    {
      partyRole: 'OPERATOR',
      roleKey: 'op', // TODO use real product role
    },
  ],
  institutionType: 'NotFound',
};
