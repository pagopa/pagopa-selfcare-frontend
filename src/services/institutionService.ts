import {BackofficeApi} from '../api/BackofficeClient';
import {Delegation} from "../api/generated/portal/Delegation";
import {ENV} from "../utils/env";
import {getBrokerDelegation as getBrokerDelegationMocked} from './__mocks__/institutionsService';


export const getBrokerDelegation = (institutionId?: string | undefined, brokerId?: string | undefined, roles?: Array<string>): Promise<Array<Delegation>> => {
    /* istanbul ignore if */
    if (ENV.MOCK.SELFCARE) {
        return getBrokerDelegationMocked();
    } else {
        return BackofficeApi.getBrokerDelegation(institutionId, brokerId, roles).then((resources) => resources);
    }
};
