/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable complexity */

import { useAppSelector } from '../redux/hooks';
import { partiesSelectors } from '../redux/slices/partiesSlice';
import { INSTITUTIONS_EC_TYPES, INSTITUTIONS_PSP_TYPES } from "../utils/constants";

export type OrgTypes = {
    isPsp: boolean;
    isPspBroker: boolean;
    isEc: boolean;
    isEcBroker: boolean;
    isEcIPA: boolean;
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
    const isEc = INSTITUTIONS_EC_TYPES.includes(selectedParty?.institutionType ?? '') || orgIsEc;
    const orgIsEcIPA: boolean = (isEc || orgIsEcAndBroker) && selectedParty?.origin === "IPA";
    const info: OrgInfo = {
        // pagopa types
        types: {
            isPsp: INSTITUTIONS_PSP_TYPES.includes(selectedParty?.institutionType ?? '') || orgIsPsp,
            isPspBroker: orgIsPspAndBroker,
            isEc,
            isEcBroker: orgIsEcAndBroker,
            isEcIPA: orgIsEcIPA
        },
        // signed on pagopa
        isSigned: orgIsPspAndBroker || orgIsPsp || orgIsEcAndBroker || orgIsEc,
    };
    console.log("organization types: "+ JSON.stringify(info));
    return {
        orgInfo: info,

        orgIsPspDirect: info.types.isPsp && info.types.isPspBroker,
        orgIsEcDirect: info.types.isEc && info.types.isEcBroker,

        // orgIsBroker: INSTITUTIONS_PT_TYPES.includes(selectedParty?.institutionType ?? ''),

        orgIsBrokerSigned: orgIsPspAndBroker || orgIsEcAndBroker,
        orgIsPspSigned: info.isSigned && info.types.isPsp,
        orgIsPspBrokerSigned: info.isSigned && info.types.isPspBroker,
        orgIsEcSigned: info.isSigned && info.types.isEc,
        orgIsEcBrokerSigned: info.isSigned && info.types.isEcBroker,
    };
};




