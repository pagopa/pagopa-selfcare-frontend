import { BrokerAndEcDetailsResource } from '../api/generated/portal/BrokerAndEcDetailsResource';
import { BrokerOrPspDetailsResource } from '../api/generated/portal/BrokerOrPspDetailsResource';
import { CreditorInstitutionDetailsResource } from '../api/generated/portal/CreditorInstitutionDetailsResource';
import { CreditorInstitutionDto } from '../api/generated/portal/CreditorInstitutionDto';
import { UpdateCreditorInstitutionDto } from '../api/generated/portal/UpdateCreditorInstitutionDto';
import { PortalApi } from '../api/PortalApiClient';
import { NodeOnSignInPSP } from '../model/Node';
import { PSPDirectDTO } from '../model/PSP';

import {
  createPSPDirect as createPSPDirectMocked,
  getBrokerAndPspDetails as getBrokerAndPspDetailsMocked,
  getBrokerAndEcDetails as getBrokerAndEcDetailsMocked,
  createECAndBroker as createECAndBrokerMocked,
  createECDirect as createECDirectMocked,
  updatePSPInfo as updatePSPInfoMocked,
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

export const updatePSPInfo = (psp: NodeOnSignInPSP): Promise<PSPDirectDTO> =>
  updatePSPInfoMocked(psp);

// {
/* istanbul ignore if */
// if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
// return updatePSPInfo(psp);
/* } else {
    return PortalApi.createPSPDirect(psp).then((resources) => resources);
  } 
}; */

export const getBrokerAndPspDetails = (pspcode: string): Promise<BrokerOrPspDetailsResource> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return getBrokerAndPspDetailsMocked(pspcode);
  } else {
    return PortalApi.getBrokerAndPspDetails(pspcode).then((resources) => resources);
  }
};

export const getBrokerAndEcDetails = (ecCode: string): Promise<BrokerAndEcDetailsResource> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return getBrokerAndEcDetailsMocked(ecCode);
  } else {
    return PortalApi.getBrokerAndEcDetails(ecCode).then((resources) => resources);
  }
};

export const createECAndBroker = (
  ec: CreditorInstitutionDto
): Promise<CreditorInstitutionDetailsResource> => {
  if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return createECAndBrokerMocked(ec);
  } else {
    return PortalApi.createECAndBroker(ec).then((resources) => resources);
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
