import { CreditorInstitutionDetailsResource } from '../api/generated/portal/CreditorInstitutionDetailsResource';
import { CreditorInstitutionDto } from '../api/generated/portal/CreditorInstitutionDto';
import { PaymentServiceProviderDetailsResource } from '../api/generated/portal/PaymentServiceProviderDetailsResource';
import { UpdateCreditorInstitutionDto } from '../api/generated/portal/UpdateCreditorInstitutionDto';
import { PortalApi } from '../api/PortalApiClient';
import { NodeOnSignInPSP } from '../model/Node';
import { PSPDirectDTO } from '../model/PSP';

import {
  createPSPDirect as createPSPDirectMocked,
  getPSPDetails as getPSPDetailsMocked,
  createECDirect as createECDirectMocked,
  getECDetails as getCreditorInstitutionDetailsMocked,
  updateECDirect,
} from './__mocks__/nodeService';

export const createPSPDirect = (psp: NodeOnSignInPSP): Promise<PSPDirectDTO> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return createPSPDirectMocked(psp);
  } else {
    return PortalApi.createPSPDirect(psp).then((resources) => resources);
  }
};

export const getPSPDetails = (pspcode: string): Promise<PaymentServiceProviderDetailsResource> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return getPSPDetailsMocked(pspcode);
  } else {
    return PortalApi.getPSPDetails(pspcode).then((resources) => resources);
  }
};

export const createECDirect = (
  ec: CreditorInstitutionDto
): Promise<CreditorInstitutionDetailsResource> => {
  if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return createECDirectMocked(ec);
  } else {
    return PortalApi.createECDirect(ec).then((resources) => resources);
  }
};

export const getCreditorInstitutionDetails = (
  ecCode: string
): Promise<CreditorInstitutionDetailsResource> => {
  if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return getCreditorInstitutionDetailsMocked(ecCode);
  } else {
    return PortalApi.getCreditorInstitutionDetails(ecCode).then((resources) => resources);
  }
};

export const updateCreditorInstitution = (
  ecCode: string,
  ec: UpdateCreditorInstitutionDto
): Promise<CreditorInstitutionDetailsResource> => {
  if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return updateECDirect(ecCode, ec);
  } else {
    return PortalApi.updateCreditorInstitution(ecCode, ec).then((resources) => resources);
  }
};
