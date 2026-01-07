import { resolve } from "path";
import { BackofficeApi } from "../../api/BackofficeClient";
import { getIbanList, createIban, updateIban, deleteIban, createIbanDeletionRequest, getIbanDeletionRequests, cancelIbanDeletionRequests, exportIbanToCSV, exportCreditorInstitutionToCSV, getBrokerExportStatus } from "../ibanService";
import { IbanCreate } from "../../api/generated/portal/IbanCreate";

describe('ibanService test client', () => {

    const OLD_ENV = process.env;
    beforeEach(() => {
        jest.resetModules();
        process.env = { ...OLD_ENV, REACT_APP_API_MOCK_BACKOFFICE: 'false' };
    });

    afterAll(() => {
        process.env = OLD_ENV;
    });

    test('Test getIbanList', async () => {
        const spyOn = jest.
            spyOn(BackofficeApi.ibans, 'getCreditorInstitutionIbans').
            mockReturnValue(new Promise((resolve) => resolve([])));
        expect(getIbanList('creditorIstitutionCode', 'labelName')).resolves.not.toThrow();
        expect(spyOn).toBeCalledTimes(1);
    });


    test('Test createIban', async () => {
        let iban: IbanCreate = {
            due_date: new Date(),
            iban: 'iban',
            is_active: true,
            validity_date: new Date(),
        }
        const spyOn = jest.
            spyOn(BackofficeApi.ibans, 'createIban')
            .mockReturnValue(new Promise((resolve) => resolve([])));
        expect(createIban('ciCode', iban)).resolves.not.toThrow();
        expect(spyOn).toBeCalledTimes(1);
    });

    test('Test updateIban', async () => {
        let iban: IbanCreate = {
            due_date: new Date(),
            iban: 'iban',
            is_active: true,
            validity_date: new Date(),
        }
        const spyOn = jest.
            spyOn(BackofficeApi.ibans, 'updateIban').
            mockReturnValue(new Promise((resolve) => resolve([])));
        expect(updateIban('ciCode', iban)).resolves.not.toThrow();
        expect(spyOn).toBeCalledTimes(1);
    });

    test('Test deleteIban', async () => {
        const spyOn = jest.
            spyOn(BackofficeApi.ibans, 'deleteIban').
            mockReturnValue(new Promise((resolve) => resolve([])));
        expect(deleteIban('ciCode', 'ibanValue')).resolves.not.toThrow();
        expect(spyOn).toBeCalledTimes(1);
    });

    test('Test createIbanDeletionRequest', async () => {
        const spyOn = jest.
            spyOn(BackofficeApi.ibanDeletionRequest, 'createIbanDeletionRequest').
            mockReturnValue(new Promise((resolve) => resolve([])));
        expect(createIbanDeletionRequest('ciCode', 'ibanValue', new Date())).resolves.not.toThrow();
        expect(spyOn).toBeCalledTimes(1);
    });

    test('Test getIbanDeletionRequests', async () => {
        const spyOn = jest.
            spyOn(BackofficeApi.ibanDeletionRequest, 'getIbanDeletionRequest').
            mockReturnValue(new Promise((resolve) => resolve([])));
        expect(getIbanDeletionRequests('ciCode', 'ibanValue', 'status')).resolves.not.toThrow();
        expect(spyOn).toBeCalledTimes(1);
    });

    test('Test cancelIbanDeletionRequests', async () => {
        const spyOn = jest.
            spyOn(BackofficeApi.ibanDeletionRequest, 'cancelIbanDeletionRequest').
            mockReturnValue(new Promise((resolve) => resolve([])));
        expect(cancelIbanDeletionRequests('ecCode', 'id')).resolves.not.toThrow();
        expect(spyOn).toBeCalledTimes(1);
    });

    test('Test exportIbanToCSV', async () => {
        const spyOn = jest.
            spyOn(BackofficeApi.creditorInstitutionBroker, 'exportIbansToCsv').
            mockReturnValue(new Promise((resolve) => resolve([])));
        expect(exportIbanToCSV('brokerCode')).resolves.not.toThrow();
        expect(spyOn).toBeCalledTimes(1);
    });

    test('Test exportCreditorInstitutionToCSV', async () => {
        const spyOn = jest.
            spyOn(BackofficeApi.creditorInstitutionBroker, 'exportCreditorInstitutionsToCsv').
            mockReturnValue(new Promise((resolve) => resolve([])));
        expect(exportCreditorInstitutionToCSV('brokerCode')).resolves.not.toThrow();
        expect(spyOn).toBeCalledTimes(1);
    });

    test('Test getBrokerExportStatus', async () => {
        const spyOn = jest.
            spyOn(BackofficeApi.creditorInstitutionBroker, 'getBrokerExportStatus').
            mockReturnValue(new Promise((resolve) => resolve([])));
        expect(getBrokerExportStatus('brokerCode')).resolves.not.toThrow();
        expect(spyOn).toBeCalledTimes(1);
    });

});