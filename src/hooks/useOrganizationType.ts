/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable complexity */

import {useAppSelector} from '../redux/hooks';
import {partiesSelectors} from '../redux/slices/partiesSlice';
import {INSTITUTIONS_EC_TYPES, INSTITUTIONS_PSP_TYPES, INSTITUTIONS_PT_TYPES} from "../utils/constants";

export type OrgTypes = {
    isPsp: boolean;
    isPspBroker: boolean;
    isEc: boolean;
    isEcBroker: boolean;
};

export type OrgInfo = {
    types: OrgTypes;
    isSigned: boolean;
};

export const useOrganizationType = () => {
    const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
    const signInData = useAppSelector(partiesSelectors.selectSigninData);

    const orgIsPspAndBroker: boolean =
        (signInData?.brokerPspDetailsResource && Object.keys(signInData?.brokerPspDetailsResource).length > 0) ?? false;

    const orgIsPsp: boolean =
        (signInData?.paymentServiceProviderDetailsResource && Object.keys(signInData?.paymentServiceProviderDetailsResource).length > 0) ?? false;

    const orgIsEcAndBroker: boolean =
        (signInData?.brokerDetailsResource && Object.keys(signInData?.brokerDetailsResource).length > 0) ?? false;

    const orgIsEc: boolean =
        (signInData?.creditorInstitutionDetailsResource && Object.keys(signInData?.creditorInstitutionDetailsResource).length > 0) ?? false;

    const info: OrgInfo = {
        // pagopa types
        types: {
            isPsp: INSTITUTIONS_PSP_TYPES.includes(selectedParty?.institutionType ?? '') || orgIsPsp,
            isPspBroker: INSTITUTIONS_PT_TYPES.includes(selectedParty?.institutionType ?? '') && orgIsPspAndBroker,
            isEc: INSTITUTIONS_EC_TYPES.includes(selectedParty?.institutionType ?? '') || orgIsEc,
            isEcBroker: INSTITUTIONS_PT_TYPES.includes(selectedParty?.institutionType ?? '') && orgIsEcAndBroker,
        },
        // signed on pagopa
        isSigned: orgIsPspAndBroker || orgIsPsp || orgIsEcAndBroker || orgIsEc,
    };
    return {
        orgInfo: info,

        orgIsPspDirect: info.types.isPsp && info.types.isPspBroker,
        orgIsEcDirect: info.types.isEc && info.types.isEcBroker,

        orgIsBroker: INSTITUTIONS_PT_TYPES.includes(selectedParty?.institutionType ?? ''),

        orgIsPspSigned: info.isSigned && info.types.isPsp,
        orgIsPspBrokerSigned: info.isSigned && info.types.isPspBroker,
        orgIsEcSigned: info.isSigned && info.types.isEc,
        orgIsEcBrokerSigned: info.isSigned && info.types.isEcBroker,
    };
};




