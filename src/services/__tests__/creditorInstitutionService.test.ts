import {BackofficeApi} from '../../api/BackofficeClient';
import {
    mockedCIContacts,
    mockedCreditorInstitutionContactsResource,
    mockedCreditorInstitutionInfoArray,
    mockedCreditorInstitutionsResource,
} from '../__mocks__/creditorInstitutionService';
import {
    getAvailableCreditorInstitutionsForStation,
    getCreditorInstitutionContacts,
    getCreditorInstitutions,
} from '../creditorInstitutionService';

describe('CreditorInstitutionService test client', () => {
    const OLD_ENV = process.env;
    beforeEach(() => {
        jest.resetModules();
        process.env = {...OLD_ENV, REACT_APP_API_MOCK_BACKOFFICE: 'false'};
    });

    afterAll(() => {
        process.env = OLD_ENV;
    });

    test('Test getCreditorInstitutionContacts', async () => {
        const spyOn = jest
            .spyOn(BackofficeApi.creditorInstitutions, 'getCreditorInstitutionContacts')
            .mockReturnValue(new Promise((resolve) => resolve(mockedCIContacts)));
        expect(getCreditorInstitutionContacts('ciTaxCode', 'institutionId')).resolves.not.toThrow();
        expect(spyOn).toBeCalledTimes(1);
    });

    test('Test getCreditorInstitutions', async () => {
        const spyOn = jest
            .spyOn(BackofficeApi.creditorInstitutions, 'getCreditorInstitutions')
            .mockReturnValue(new Promise((resolve) => resolve(mockedCreditorInstitutionsResource)));
        expect(getCreditorInstitutions('taxCode', 'name', 0, 10)).resolves.not.toThrow();
        expect(spyOn).toBeCalledTimes(1);
    });

    test('Test getAvailableCreditorInstitutionsForStation', async () => {
        const spyOn = jest
            .spyOn(BackofficeApi.creditorInstitutions, 'getAvailableCreditorInstitutionsForStation')
            .mockReturnValue(new Promise((resolve) => resolve(mockedCreditorInstitutionInfoArray)));
        expect(
            getAvailableCreditorInstitutionsForStation('stationCode', 'brokerId')
        ).resolves.not.toThrow();
        expect(spyOn).toBeCalledTimes(1);
    });
});

describe('CreditorInstitutionService test mocked', () => {
    test('Test getCreditorInstitutionContacts', async () => {
        const response = await getCreditorInstitutionContacts('ciTaxCode', 'institutionId');
        expect(response).toMatchObject(mockedCreditorInstitutionContactsResource);
    });

    test('Test getCreditorInstitutions', async () => {
        const response = await getCreditorInstitutions('taxCode', 'name', 0, 10);
        expect(response).toMatchObject(mockedCreditorInstitutionsResource);
    });

    test('Test getAvailableCreditorInstitutionsForStation', async () => {
        const response = await getAvailableCreditorInstitutionsForStation('stationCode', 'brokerId');
        expect(response).toMatchObject(mockedCreditorInstitutionInfoArray);
    });
});
