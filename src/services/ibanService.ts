import {BackofficeApi} from '../api/BackofficeClient';
import {Ibans} from "../api/generated/portal/Ibans";
import {Iban} from "../api/generated/portal/Iban";
import {IbanCreate} from "../api/generated/portal/IbanCreate";
import {BrokerECExportStatus} from '../api/generated/portal/BrokerECExportStatus';
import { IbanDeletionRequests } from '../api/generated/portal/IbanDeletionRequests';
import {
    createIban as createIbanMocked,
    deleteIban as deleteIbanMocked,
    exportCreditorInstitutionsToCsv as exportCreditorInstitutionsToCsvMocked,
    exportIbansToCsv as exportIbansToCsvMocked,
    getBrokerExportStatus as getBrokerExportStatusMocked,
    getCreditorInstitutionIbans as getCreditorInstitutionIbansMocked,
    getIbanDeletionRequests as getIbanDeletionRequestsMocked,
    cancelIbanDeletionRequests as cancelIbanDeletionRequestsMocked,
    updateIban as updateIbanMocked
} from './__mocks__/ibanService';

export const getIbanList = (
    creditorInstitutionCode: string,
    labelName?: string
): Promise<Ibans> => {
    /* istanbul ignore if */
    if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
        return getCreditorInstitutionIbansMocked(creditorInstitutionCode, labelName);
    } else {
        return BackofficeApi.ibans.getCreditorInstitutionIbans(creditorInstitutionCode, labelName).then(
            (resources) => resources
        );
    }
};

export const createIban = (ciCode: string, iban: IbanCreate): Promise<Iban> => {
    /* istanbul ignore if */
    if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
        return createIbanMocked(iban);
    } else {
        return BackofficeApi.ibans.createIban(ciCode, iban).then((resources) => resources);
    }
};

export const updateIban = (ciCode: string, iban: IbanCreate): Promise<Iban> => {
    /* istanbul ignore if */
    if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
        return updateIbanMocked(iban);
    } else {
        return BackofficeApi.ibans.updateIban(ciCode, iban).then((resources) => resources);
    }
};

export const deleteIban = (ecCode: string, ibanValue: string): Promise<void> => {
    /* istanbul ignore if */
    if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
        return deleteIbanMocked(ecCode, ibanValue);
    } else {
        return BackofficeApi.ibans.deleteIban(ecCode, ibanValue).then((resources) => resources);
    }
};

export const createIbanDeletionRequest = (ecCode: string, ibanValue: string, dateToDelete: Date): Promise<void> => {
    /* istanbul ignore if */ 
    if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
        return deleteIbanMocked(ecCode, ibanValue);
    } else {
        return BackofficeApi.ibanDeletionRequest.createIbanDeletionRequest(ecCode, ibanValue, dateToDelete).then((resources) => resources);
    }
};

export const getIbanDeletionRequests = (ecCode: string, ibanValue: string, status: string): Promise<IbanDeletionRequests> => {
    /* istanbul ignore if */ 
    if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
        return getIbanDeletionRequestsMocked(ecCode, ibanValue, status);
    } else {
        return BackofficeApi.ibanDeletionRequest.getIbanDeletionRequest(ecCode, ibanValue, status).then((resources) => resources);
    }
};

export const cancelIbanDeletionRequests = (ecCode: string, id: string): Promise<void> => {
    /* istanbul ignore if */ 
    if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
        return cancelIbanDeletionRequestsMocked(id);
    } else {
        return BackofficeApi.ibanDeletionRequest.cancelIbanDeletionRequest(ecCode, id).then((resources) => resources);
    }
};

export const exportIbanToCSV = (brokerCode: string): Promise<Buffer> => {
    /* istanbul ignore if */
    if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
        return exportIbansToCsvMocked(brokerCode);
    } else {
        return BackofficeApi.creditorInstitutionBroker.exportIbansToCsv(brokerCode).then((resources) => resources);
    }
};

export const exportCreditorInstitutionToCSV = (brokerCode: string): Promise<Buffer> => {
    /* istanbul ignore if */
    if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
        return exportCreditorInstitutionsToCsvMocked(brokerCode);
    } else {
        return BackofficeApi.creditorInstitutionBroker.exportCreditorInstitutionsToCsv(brokerCode).then((resources) => resources);
    }
};

export const getBrokerExportStatus = (brokerCode: string): Promise<BrokerECExportStatus> => {
    /* istanbul ignore if */
    if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
        return getBrokerExportStatusMocked(brokerCode);
    } else {
        return BackofficeApi.creditorInstitutionBroker.getBrokerExportStatus(brokerCode).then(
            (resources) => resources
        );
    }
};
