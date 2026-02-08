import { Redirect } from 'react-router-dom';
import ROUTES from '../../routes';
import { usePermissions } from '../../hooks/usePermissions';
import { PermissionName } from '../../model/RolePermission';
import { useFlagValue } from '../../hooks/useFeatureFlags';
import { OrgInfo, useOrganizationType } from '../../hooks/useOrganizationType';

type ProtectedRouteProps = {
    permission: PermissionName;
    flagValue?: string;
    orgCheckCondition?: (orgInfo: OrgInfo) => boolean;
    children: JSX.Element;
};
export const ProtectedRoute = ({ permission, flagValue = "", orgCheckCondition = (_) => true, children }: ProtectedRouteProps) => {
    const { userHasPermission } = usePermissions();
    if (!userHasPermission(permission)) {
        console.error(
            'Permission error - You do not have permission to perform this action -',
            permission
        );
    }

    const { orgInfo } = useOrganizationType();
    const featureIsEnabled = useFlagValue(flagValue) || flagValue === "";
    const orgCheck = orgCheckCondition(orgInfo);
    return featureIsEnabled && userHasPermission(permission) && orgCheck ? (
        children
    ) : (
        <Redirect to={ROUTES.HOME} />
    );
};
