import { BrokerAndEcDetailsResource } from '../api/generated/portal/BrokerAndEcDetailsResource';
import { BrokerDto } from '../api/generated/portal/BrokerDto';
import { BrokerOrPspDetailsResource } from '../api/generated/portal/BrokerOrPspDetailsResource';
import { BrokerPspDetailsDto } from '../api/generated/portal/BrokerPspDetailsDto';
import { BrokerPspDetailsResource } from '../api/generated/portal/BrokerPspDetailsResource';
import { BrokerResource } from '../api/generated/portal/BrokerResource';
import { CreditorInstitutionDetailsResource } from '../api/generated/portal/CreditorInstitutionDetailsResource';
import { CreditorInstitutionDto } from '../api/generated/portal/CreditorInstitutionDto';
import { PaymentServiceProviderDetailsDto } from '../api/generated/portal/PaymentServiceProviderDetailsDto';
import { PaymentServiceProviderDetailsResource } from '../api/generated/portal/PaymentServiceProviderDetailsResource';
import { UpdateCreditorInstitutionDto } from '../api/generated/portal/UpdateCreditorInstitutionDto';
import { PortalApi } from '../api/PortalApiClient';
import { NodeOnSignInPSP } from '../model/Node';
import { PSPDirectDTO } from '../model/PSP';

import {
  createPSPDirect as createPSPDirectMocked,
  getBrokerAndPspDetails as getBrokerAndPspDetailsMocked,
  getPSPBrokerDetails as getPSPBrokerDetailsMocked,
  getBrokerAndEcDetails as getBrokerAndEcDetailsMocked,
  createECAndBroker as createECAndBrokerMocked,
  createEcBroker as createEcBrokerMocked,
  createPspBroker as createPspBrokerMocked,
  createECIndirect as createECIndirectMocked,
  createPSPIndirect as createPSPIndirectMocked,
  getECDetails as getCreditorInstitutionDetailsMocked,
  updatePSPInfo as updatePSPInfoMocked,
  updateECDirect,
} from './__mocks__/nodeService';

export const createPSPDirect = (
  psp: NodeOnSignInPSP
): Promise<PaymentServiceProviderDetailsResource> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return createPSPDirectMocked(psp);
  } else {
    return PortalApi.createPSPDirect(psp).then((resources) => resources);
  }
};

export const createPspBroker = (broker: BrokerPspDetailsDto): Promise<BrokerPspDetailsResource> => {
  if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return createPspBrokerMocked(broker);
  } else {
    return PortalApi.createPspBroker(broker).then((resources) => resources);
  }
};

export const updatePSPInfo = (
  pspcode: string,
  psp: NodeOnSignInPSP
): Promise<PaymentServiceProviderDetailsResource> => {
  if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return updatePSPInfoMocked(pspcode, psp);
  } else {
    return PortalApi.updatePaymentServiceProvider(pspcode, psp);
  }
};

export const createPSPIndirect = (
  psp: NodeOnSignInPSP
): Promise<PaymentServiceProviderDetailsResource> => {
  if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return createPSPIndirectMocked(psp);
  } else {
    return PortalApi.createPSPIndirect(psp);
  }
};

export const getBrokerAndPspDetails = (pspcode: string): Promise<BrokerOrPspDetailsResource> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return getBrokerAndPspDetailsMocked(pspcode);
  } else {
    return PortalApi.getBrokerAndPspDetails(pspcode).then((resources) => resources);
  }
};

export const getPSPBrokerDetails = (pspBrokerCode: string): Promise<BrokerPspDetailsResource> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return getPSPBrokerDetailsMocked(pspBrokerCode);
  } else {
    return PortalApi.getPSPBrokerDetails(pspBrokerCode).then((resources) => resources);
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

export const createEcBroker = (broker: BrokerDto): Promise<BrokerResource> => {
  if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return createEcBrokerMocked(broker);
  } else {
    return PortalApi.createEcBroker(broker).then((resources) => resources);
  }
};

export const createECIndirect = (
  ec: CreditorInstitutionDto
): Promise<CreditorInstitutionDetailsResource> => {
  if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return createECIndirectMocked(ec);
  } else {
    return PortalApi.createECIndirect(ec).then((resources) => resources);
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
