import {ROLE} from '../model/RolePermission';
import {useAppSelector} from '../redux/hooks';
import {partiesSelectors} from '../redux/slices/partiesSlice';
import {Party} from "../model/Party";
import {useOrganizationType} from "./useOrganizationType";
import {useFlagValue} from "./useFeatureFlags";


export const useUserRole = () => {
    const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
    const {orgInfo} = useOrganizationType();

    const userRole: ROLE = selectedParty ? mapUserRole(selectedParty, orgInfo) : ROLE.UNKNOWN;

    const userIsPspAdmin = userRole === ROLE.PSP_ADMIN || userRole === ROLE.PSP_DIRECT_ADMIN;
    const userIsPspDirectAdmin = userRole === ROLE.PSP_DIRECT_ADMIN;
    const userIsEcAdmin = userRole === ROLE.EC_ADMIN || userRole === ROLE.EC_DIRECT_ADMIN;
    const isOperator = userIsOperator();
    const userIsAdmin = userIsPspAdmin || userIsEcAdmin || isOperator;

    return {
        userRole,
        userIsPspAdmin,
        userIsEcAdmin,
        userIsPspDirectAdmin,
        userIsAdmin: userIsAdmin,
        userIsOperator: isOperator,
    };
};

export const userIsOperator = (): boolean =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useFlagValue('isOperator');

const mapUserRole = (party: Party, orgInfo: any): ROLE => {
    const roleKey = party.roles[0].roleKey;

    // eslint-disable-next-line
    let role = ROLE.UNKNOWN;
    if (userIsOperator()) {
        role = ROLE.PAGOPA_OPERATOR;
    } else if (party.institutionType === 'PT') {
        role = mapPtRoles(orgInfo.types.isPspBroker, orgInfo.types.isEcBroker);
    } else if (party.institutionType === 'PSP') {
        role = mapPspRoles(orgInfo.types.isPspBroker, roleKey);
    } else {
        role = mapEcRoles(orgInfo.types.isEcBroker, roleKey);
    }
    return role;
};

function mapPtRoles(isPSPBroker: boolean, isECBroker: boolean) {
    if (isPSPBroker && isECBroker) {
        return ROLE.PT_PSPEC_OPERATOR;
    }
    if (isPSPBroker) {
        return ROLE.PT_PSP_OPERATOR;
    }

    if (isECBroker) {
        return ROLE.PT_EC_OPERATOR;
    }

    return ROLE.PT_UNSIGNED;
}

function mapPspRoles(isPSPBroker: boolean, roleKey: string) {
    if (isPSPBroker) {
        return roleKey === 'admin' ? ROLE.PSP_DIRECT_ADMIN : ROLE.PSP_DIRECT_OPERATOR;
    }

    return roleKey === 'admin' ? ROLE.PSP_ADMIN : ROLE.PSP_OPERATOR;
}

function mapEcRoles(isECBroker: boolean, roleKey: string) {
    if (isECBroker) {
        return roleKey === 'admin' ? ROLE.EC_DIRECT_ADMIN : ROLE.EC_DIRECT_OPERATOR;
    }

    if (roleKey === 'operator') {
        return ROLE.EC_OPERATOR;
    }
    if (roleKey === 'admin') {
        return ROLE.EC_ADMIN;
    }
    return ROLE.UNKNOWN;
}


