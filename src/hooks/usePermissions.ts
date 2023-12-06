import { PermissionName, ROLE, permissions } from '../model/RolePermission';
import { useAppSelector } from '../redux/hooks';
import { partiesSelectors } from '../redux/slices/partiesSlice';
import { contextSelectors } from '../redux/slices/contextSlice';
import { getUserRole } from '../utils/rbac-utils';

export const usePermissions = () => {
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const actorDetails = useAppSelector(contextSelectors.selectDetails);

  const userRole: ROLE | undefined = selectedParty
    ? getUserRole(selectedParty, actorDetails)
    : undefined;
  const hasPermission = (permissionName: PermissionName) =>
    userRole ? permissions[permissionName].includes(userRole) : false;
  return { hasPermission };
};
