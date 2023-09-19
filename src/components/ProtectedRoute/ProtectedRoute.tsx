import { ElementType, ReactChildren } from 'react';
import { Redirect } from 'react-router-dom';
import ROUTES from '../../routes';
import { usePermissions } from '../../hooks/usePermissions';
import { PermissionName } from '../../model/RolePermission';

type ProtectedRouteProps = {
  permission: PermissionName;
  children: JSX.Element;
};
export const ProtectedRoute = ({ permission, children }: ProtectedRouteProps) => {
  const { hasPermission } = usePermissions();
  if (hasPermission(permission) === false) {
    console.error(
      'Permission error - You do not have permission to perform this action -',
      permission
    );
  }
  return hasPermission(permission) ? children : <Redirect to={ROUTES.HOME} />;
};
