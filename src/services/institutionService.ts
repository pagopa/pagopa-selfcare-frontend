import { BackofficeApi } from '../api/BackofficeClient';
import { DelegationResource } from '../api/generated/portal/DelegationResource';
import { InstitutionDetailResource } from '../api/generated/portal/InstitutionDetailResource';
import { ENV } from '../utils/env';
import { getBrokerDelegation as getBrokerDelegationMocked } from './__mocks__/institutionsService';

export const getBrokerDelegation = (
  institutionId?: string | undefined,
  brokerId?: string | undefined,
  roles?: Array<string>
): Promise<DelegationResource> => {
  /* istanbul ignore if */
  if (ENV.MOCK.SELFCARE) {
    return getBrokerDelegationMocked();
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
  if (ENV.MOCK.SELFCARE) {
    return {} as any;
  } else {
    return BackofficeApi.getInstitutions(taxCode).then((resources) => resources);
  }
};
