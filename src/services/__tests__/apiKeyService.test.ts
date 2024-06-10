import {BackofficeApi} from '../../api/BackofficeClient';
import {
    createMockedKeys,
    mockedKeys,
    mockedPrimaryKey,
    mockedSecondaryKey,
} from '../__mocks__/apiKeyService';
import {
    createInstitutionApiKeys,
    getInstitutionApiKeys,
    regeneratePrimaryKey,
    regenerateSecondaryKey,
} from '../apiKeyService';

describe('ApiKeyService test mocked', () => {
    test('Test getInstitutionApiKeys', async () => {
        const response = await getInstitutionApiKeys('institutionId');
        expect(response).toMatchObject(mockedKeys);
    });
    test('Test createInstitutionApiKeys', async () => {
        const response = await createInstitutionApiKeys('institutionId', 'subscriptionId');
        expect(response).toMatchObject(createMockedKeys);
    });
    test('Test regeneratePrimaryKey', async () => {
        const response = await regeneratePrimaryKey('institutionId', 'subscriptionId');
        expect(response).toMatch(mockedPrimaryKey);
    });
    test('Test regenerateSecondaryKey', async () => {
        const response = await regenerateSecondaryKey('institutionId', 'subscriptionId');
        expect(response).toMatch(mockedSecondaryKey);
    });
});

describe('BundleService test client', () => {
    const OLD_ENV = process.env;
    beforeEach(() => {
        jest.resetModules();
        process.env = {...OLD_ENV, REACT_APP_API_MOCK_BACKOFFICE: 'false'};
    });

    afterAll(() => {
        process.env = OLD_ENV;
    });

    test('Test getInstitutionApiKeys', async () => {
        const spyOn = jest
            .spyOn(BackofficeApi, 'getInstitutionApiKeys')
            .mockReturnValue(new Promise((resolve) => resolve([])));
        expect(getInstitutionApiKeys('institutionId')).resolves.not.toThrow();
        expect(spyOn).toBeCalledTimes(1);
    });
    test('Test createInstitutionApiKeys', async () => {
        const spyOn = jest
            .spyOn(BackofficeApi, 'createInstitutionApiKeys')
            .mockReturnValue(new Promise((resolve) => resolve([])));
        expect(createInstitutionApiKeys('institutionId', 'subscriptionId')).resolves.not.toThrow();
        expect(spyOn).toBeCalledTimes(1);
    });
    test('Test regeneratePrimaryKey', async () => {
        const spyOn = jest
            .spyOn(BackofficeApi, 'regeneratePrimaryKey')
            .mockReturnValue(new Promise((resolve) => resolve('')));
        expect(regeneratePrimaryKey('institutionId', 'subscriptionId')).resolves.not.toThrow();
        expect(spyOn).toBeCalledTimes(1);
    });
    test('Test regenerateSecondaryKey', async () => {
        const spyOn = jest
            .spyOn(BackofficeApi, 'regenerateSecondaryKey')
            .mockReturnValue(new Promise((resolve) => resolve('')));
        expect(regenerateSecondaryKey('institutionId', 'subscriptionId')).resolves.not.toThrow();
        expect(spyOn).toBeCalledTimes(1);
    });
});
