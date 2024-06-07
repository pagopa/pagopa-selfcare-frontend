import {BackofficeApi} from '../api/BackofficeClient';
import {DelegationResource} from '../api/generated/portal/DelegationResource';
import {InstitutionDetailResource} from '../api/generated/portal/InstitutionDetailResource';
import {getBrokerDelegationMock, getInstitutionsMock} from './__mocks__/institutionsService';

export const getBrokerDelegation = (
    institutionId?: string | undefined,
    brokerId?: string | undefined,
    roles?: Array<string>
): Promise<DelegationResource> => {
    /* istanbul ignore if */
    if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
        return getBrokerDelegationMock();
    } else {
        return BackofficeApi.getBrokerDelegation(institutionId, brokerId, roles).then(
            (resources) => resources
        );
    }
};

export const getInstitutions = (
    taxCode: string | undefined
): Promise<InstitutionDetailResource> => {
    /* istanbul ignore if */
    if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
        return getInstitutionsMock();
    } else {
        return BackofficeApi.getInstitutions(taxCode).then((resources) => resources);
    }
};
