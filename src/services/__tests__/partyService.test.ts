import {BackofficeApi} from '../../api/BackofficeClient';
import {mockedInstitutionDetailResource} from '../__mocks__/institutionsService';
import {mockedInstitutionBaseResource, mockedParties} from '../__mocks__/partyService';
import {fetchParties, fetchPartyDetails} from '../partyService';

describe('PartyService test client', () => {
    const OLD_ENV = process.env;
    beforeEach(() => {
        jest.resetModules();
        process.env = {...OLD_ENV, REACT_APP_API_MOCK_BACKOFFICE: 'false'};
    });

    afterAll(() => {
        process.env = OLD_ENV;
    });

    test('Test fetchParties', async () => {
        const spyOn = jest
            .spyOn(BackofficeApi, 'getInstitutions')
            .mockReturnValue(new Promise((resolve) => resolve(mockedInstitutionBaseResource)));
        expect(fetchParties()).resolves.not.toThrow();
        expect(spyOn).toBeCalledTimes(1);
    });

    test('Test fetchParties with empty response', async () => {
        const spyOn = jest
            .spyOn(BackofficeApi, 'getInstitutions')
            .mockReturnValue(new Promise((resolve) => resolve({})));
        expect(fetchParties()).resolves.not.toThrow();
        expect(spyOn).toBeCalledTimes(1);
    });

    test('Test fetchPartyDetails', async () => {
        const spyOn = jest
            .spyOn(BackofficeApi, 'getInstitutionFullDetail')
            .mockReturnValue(new Promise((resolve) => resolve(mockedInstitutionDetailResource)));
        expect(fetchPartyDetails('partyId', [])).resolves.not.toThrow();
        expect(spyOn).toBeCalledTimes(1);
    });
});

describe('PartyService test mocked', () => {
    test('Test fetchParties', async () => {
        const response = await fetchParties();
        expect(response).toMatchObject(mockedParties);
    });

    test('Test fetchPartyDetails', async () => {
        const response = await fetchPartyDetails(mockedParties[0].partyId, []);
        expect(response).toMatchObject(mockedParties[0]);
    });
});
