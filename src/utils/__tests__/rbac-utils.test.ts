import { getUserRole } from '../rbac-utils'; // Import your module
import * as utils from '../../pages/components/commonFunctions';
import { ROLE } from '../../model/RolePermission';
import {
  ecAdminSigned,
  ecOperatorUnsigned,
  pspAdminUnsigned,
  pspOperatorSigned,
} from '../../services/__mocks__/partyService';

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
});
