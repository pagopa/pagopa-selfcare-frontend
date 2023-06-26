import { PortalApi } from '../api/PortalApiClient';
import { IbansResource } from '../api/generated/portal/IbansResource';
import { getCreditorInstitutionIbans as getCreditorInstitutionIbansMocked } from './__mocks__/ibanService';

export const getIbanList = (creditorInstitutionCode: string): Promise<IbansResource> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return getCreditorInstitutionIbansMocked(creditorInstitutionCode);
  } else {
    return PortalApi.getCreditorInstitutionIbans(creditorInstitutionCode).then(
      (resources) => resources
    );
  }
};
