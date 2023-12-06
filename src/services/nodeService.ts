import {BrokerDto} from '../api/generated/portal/BrokerDto';
import {BrokerOrPspDetailsResource} from '../api/generated/portal/BrokerOrPspDetailsResource';
import {BrokerPspDetailsDto} from '../api/generated/portal/BrokerPspDetailsDto';
import {BrokerPspDetailsResource} from '../api/generated/portal/BrokerPspDetailsResource';
import {BrokerResource} from '../api/generated/portal/BrokerResource';
import {CreditorInstitutionDetailsResource} from '../api/generated/portal/CreditorInstitutionDetailsResource';
import {CreditorInstitutionDto} from '../api/generated/portal/CreditorInstitutionDto';
import {PaymentServiceProviderDetailsResource} from '../api/generated/portal/PaymentServiceProviderDetailsResource';
import {PaymentServiceProvidersResource} from '../api/generated/portal/PaymentServiceProvidersResource';
import {UpdateCreditorInstitutionDto} from '../api/generated/portal/UpdateCreditorInstitutionDto';
import {BackofficeApi} from '../api/BackofficeClient';
import {NodeOnSignInPSP} from '../model/Node';

import {Actor} from '../api/generated/portal/Actor';
import {
    createECAndBroker as createECAndBrokerMocked,
    createEcBroker as createEcBrokerMocked,
    createECIndirect as createECIndirectMocked,
    createPspBroker as createPspBrokerMocked,
    createPSPDirect as createPSPDirectMocked,
    createPSPIndirect as createPSPIndirectMocked,
    getBrokerAndPspDetails as getBrokerAndPspDetailsMocked,
    getPaymentServiceProviders as getPaymentServiceProvidersMocked,
    getPSPBrokerDetails as getPSPBrokerDetailsMocked,
    getPSPDetails as getPSPDetailsMoked,
    updateECDirect,
    updatePSPInfo as updatePSPInfoMocked,
} from './__mocks__/nodeService';

export const createPSPDirect = (
    psp: NodeOnSignInPSP
): Promise<PaymentServiceProviderDetailsResource> => {
    /* istanbul ignore if */
    if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
        return createPSPDirectMocked(psp);
    } else {
        return BackofficeApi.createPSPDirect(psp).then((resources) => resources);
    }
};

export const createPspBroker = (broker: BrokerPspDetailsDto): Promise<BrokerPspDetailsResource> => {
    if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
        return createPspBrokerMocked(broker);
    } else {
        return BackofficeApi.createPspBroker(broker).then((resources) => resources);
    }
};

export const updatePSPInfo = (
    pspcode: string,
    psp: NodeOnSignInPSP
): Promise<PaymentServiceProviderDetailsResource> => {
    if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
        return updatePSPInfoMocked(pspcode, psp);
    } else {
        return BackofficeApi.updatePaymentServiceProvider(pspcode, psp);
    }
};

export const createPSPIndirect = (
    psp: NodeOnSignInPSP
): Promise<PaymentServiceProviderDetailsResource> => {
    if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
        return createPSPIndirectMocked(psp);
    } else {
        return BackofficeApi.createPSPIndirect(psp);
    }
};

export const getBrokerAndPspDetails = (pspcode: string): Promise<BrokerOrPspDetailsResource> => {
    /* istanbul ignore if */
    if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
        return getBrokerAndPspDetailsMocked(pspcode);
    } else {
        return BackofficeApi.getBrokerAndPspDetails(pspcode).then((resources) => resources);
    }
};

export const getPSPBrokerDetails = (pspBrokerCode: string): Promise<BrokerPspDetailsResource> => {
    /* istanbul ignore if */
    if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
        return getPSPBrokerDetailsMocked(pspBrokerCode);
    } else {
        return BackofficeApi.getPSPBrokerDetails(pspBrokerCode).then((resources) => resources);
    }
};

export const getPSPDetails = (pspCode: string): Promise<PaymentServiceProviderDetailsResource> => {
    /* istanbul ignore if */
    if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
        return getPSPDetailsMoked(pspCode);
    } else {
        return BackofficeApi.getPSPDetails(pspCode).then((resources) => resources);
    }
};

export const getPaymentServiceProviders = (
    page: number,
    name?: string,
    limit?: number,
    pspCode?: string,
    taxCode?: string
): Promise<PaymentServiceProvidersResource> => {
    if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
        return getPaymentServiceProvidersMocked(page, name, limit, pspCode, taxCode);
    } else {
        return BackofficeApi.getPaymentServiceProviders(page, name, limit, pspCode, taxCode).then(
            (resources) => resources
        );
    }
};

export const getActor = (taxCode: string): Promise<Actor> => {
    /* istanbul ignore if */
    if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
        // @ts-ignore
        return {} as Actor;
    } else {
        return BackofficeApi.getActor(taxCode).then((resources) => resources);
    }
};

export const createECAndBroker = (
    ec: CreditorInstitutionDto
): Promise<CreditorInstitutionDetailsResource> => {
    if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
        return createECAndBrokerMocked(ec);
    } else {
        return BackofficeApi.createECAndBroker(ec).then((resources) => resources);
    }
};

export const createEcBroker = (broker: BrokerDto): Promise<BrokerResource> => {
    if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
        return createEcBrokerMocked(broker);
    } else {
        return BackofficeApi.createEcBroker(broker).then((resources) => resources);
    }
};

export const createECIndirect = (
    ec: CreditorInstitutionDto
): Promise<CreditorInstitutionDetailsResource> => {
    if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
        return createECIndirectMocked(ec);
    } else {
        return BackofficeApi.createECIndirect(ec).then((resources) => resources);
    }
};

export const updateCreditorInstitution = (
    ecCode: string,
    ec: UpdateCreditorInstitutionDto
): Promise<CreditorInstitutionDetailsResource> => {
    if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
        return updateECDirect(ecCode, ec);
    } else {
        return BackofficeApi.updateCreditorInstitution(ecCode, ec).then((resources) => resources);
    }
};
