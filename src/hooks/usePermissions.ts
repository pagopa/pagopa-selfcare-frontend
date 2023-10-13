import { PermissionName, ROLE, permissions } from '../model/RolePermission';
import { useAppSelector } from '../redux/hooks';
import { partiesSelectors } from '../redux/slices/partiesSlice';
import { getUserRole } from '../utils/rbac-utils';

export const usePermissions = () => {
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const signInData = useAppSelector(partiesSelectors.selectSigninData);

  const userRole: ROLE | undefined = selectedParty
    ? getUserRole(selectedParty, signInData)
    : undefined;
  const hasPermission = (permissionName: PermissionName) =>
    userRole ? permissions[permissionName].includes(userRole) : false;
  return { hasPermission };
};
