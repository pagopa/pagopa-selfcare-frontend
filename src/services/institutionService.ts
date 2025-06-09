import {BackofficeApi} from '../api/BackofficeClient';
import {DelegationResource} from '../api/generated/portal/DelegationResource';
import { InstitutionBaseResources } from '../api/generated/portal/InstitutionBaseResources';
import { InstitutionDetail } from '../api/generated/portal/InstitutionDetail';
import {getBrokerDelegationMock, getInstitutionDetailMock, getInstitutionsMock} from './__mocks__/institutionsService';

export const getBrokerDelegation = (
    institutionId?: string | undefined,
    brokerId?: string | undefined,
    roles?: Array<string>
): Promise<DelegationResource> => {
    /* istanbul ignore if */
    if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
        return getBrokerDelegationMock();
    } else {
        return BackofficeApi.institutions.getBrokerDelegation(institutionId, brokerId, roles).then(
            (resources) => resources
        );
    }
};

export const getInstitutions = (
    taxCode: string | undefined
): Promise<InstitutionBaseResources> => {
    /* istanbul ignore if */
    if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
        return getInstitutionsMock();
    } else {
        return BackofficeApi.institutions.getInstitutions(taxCode).then((resources) => resources);
    }
};

export const getInstitutionFullDetail = (
    institution_id: string
): Promise<InstitutionDetail> => {
    /* istanbul ignore if */
    if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
        return getInstitutionDetailMock();
    } else {
        return BackofficeApi.institutions.getInstitutionFullDetail(institution_id).then((resources) => resources);
    }
};
