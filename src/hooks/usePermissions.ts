import {PermissionName, permissions} from '../model/RolePermission';
import {useUserRole} from "./useUserRole";

export const usePermissions = () => {
    const {userRole} = useUserRole();

    const userHasPermission = (permissionName: PermissionName) => userRole ? permissions[permissionName].includes(userRole) : false;

    return {userHasPermission,};
};
