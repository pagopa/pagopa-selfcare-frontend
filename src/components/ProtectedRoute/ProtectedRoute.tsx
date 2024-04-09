import { ElementType, ReactChildren } from 'react';
import { Redirect } from 'react-router-dom';
import ROUTES from '../../routes';
import { usePermissions } from '../../hooks/usePermissions';
import { PermissionName } from '../../model/RolePermission';
import { useFlagValue } from '../../hooks/useFeatureFlags';

type ProtectedRouteProps = {
  permission: PermissionName;
  flagValue?: string;
  children: JSX.Element;
};
export const ProtectedRoute = ({ permission, flagValue = "", children }: ProtectedRouteProps) => {
  const { hasPermission } = usePermissions();
  if (hasPermission(permission) === false) {
    console.error(
      'Permission error - You do not have permission to perform this action -',
      permission
    );
  }
  return useFlagValue(flagValue) !== false && hasPermission(permission) ? (
    children
  ) : (
    <Redirect to={ROUTES.HOME} />
  );
};
