import {BackofficeApi} from '../../api/BackofficeClient';
import {
    mockedDelegatedPSP,
    mockedInstitutionDetailResource,
} from '../__mocks__/institutionsService';
import {getBrokerDelegation, getInstitutionFullDetail, getInstitutions} from '../institutionService';

describe('InstitutionService test mocked', () => {
    test('Test getBrokerDelegation', async () => {
        const response = await getBrokerDelegation('institutionId', 'brokerId', ['roles']);
        expect(response).toMatchObject(mockedDelegatedPSP);
    });

    test('Test getInstitutions', async () => {
        const response = await getInstitutions('taxCode');
        expect(response).toMatchObject(mockedInstitutionDetailResource);
    });

    test('Test getInstitutionFullDetail', async () => {
        const response = await getInstitutionFullDetail('taxCode');
        expect(response).toMatchObject(mockedInstitutionDetailResource);
    });
});

describe('InstitutionService test client', () => {
    const OLD_ENV = process.env;
    beforeEach(() => {
        jest.resetModules();
        process.env = {...OLD_ENV, REACT_APP_API_MOCK_BACKOFFICE: 'false'};
    });

    afterAll(() => {
        process.env = OLD_ENV;
    });

    test('Test InstitutionService', async () => {
        const spyOn = jest
            .spyOn(BackofficeApi, 'getBrokerDelegation')
            .mockReturnValue(Promise.resolve(mockedDelegatedPSP));
        expect(getBrokerDelegation('institutionId', 'brokerId', ['roles'])).resolves.not.toThrow();
        expect(spyOn).toBeCalledTimes(1);
    });

    test('Test InstitutionService', async () => {
        const spyOn = jest
            .spyOn(BackofficeApi, 'getInstitutions')
            .mockReturnValue(Promise.resolve(mockedInstitutionDetailResource));
        expect(getInstitutions('taxCode')).resolves.not.toThrow();
        expect(spyOn).toBeCalledTimes(1);
    });

    test('Test InstitutionService', async () => {
        const spyOn = jest
            .spyOn(BackofficeApi, 'getInstitutionFullDetail')
            .mockReturnValue(Promise.resolve(mockedInstitutionDetailResource));
        expect(getInstitutionFullDetail('taxCode')).resolves.not.toThrow();
        expect(spyOn).toBeCalledTimes(1);
    });
});
