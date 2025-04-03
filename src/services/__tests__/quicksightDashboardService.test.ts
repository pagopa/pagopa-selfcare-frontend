import { BackofficeApi } from '../../api/BackofficeClient';
import { mockedDashboardUrl } from '../__mocks__/quicksightDashboardService';
import { getEmbedUrlForAnonymousUser } from '../quicksightDashboardService';

describe('QuicksightDashboardService test mocked', () => {
    test('Test getEmbedUrlForAnonymousUser', async () => {
        const response = await getEmbedUrlForAnonymousUser({institutionId: 'institutionId'});
        expect(response).toMatchObject(mockedDashboardUrl);
    });
    test('Test getEmbedUrlForAnonymousUser', async () => {
        const response = await getEmbedUrlForAnonymousUser({});
        expect(response).toMatchObject(mockedDashboardUrl);
    });
});

describe('QuicksightDashboardService test client', () => {
    const OLD_ENV = process.env;
    beforeEach(() => {
        jest.resetModules();
        process.env = {...OLD_ENV, REACT_APP_API_MOCK_BACKOFFICE: 'false'};
    });

    afterAll(() => {
        process.env = OLD_ENV;
    });

    test('Test getEmbedUrlForAnonymousUser', async () => {
        const spyOn = jest
            .spyOn(BackofficeApi.quicksightDashboard, 'getEmbedUrlForAnonymousUser')
            .mockReturnValue(Promise.resolve(mockedDashboardUrl));
        expect(getEmbedUrlForAnonymousUser({institutionId: 'institutionId'})).resolves.not.toThrow();
        expect(spyOn).toBeCalledTimes(1);
    });
    test('Test getEmbedUrlForAnonymousUser', async () => {
        const spyOn = jest
            .spyOn(BackofficeApi.quicksightDashboard, 'getEmbedUrlForAnonymousUser')
            .mockReturnValue(Promise.resolve(mockedDashboardUrl));
        expect(getEmbedUrlForAnonymousUser({})).resolves.not.toThrow();
        expect(spyOn).toBeCalledTimes(1);
    });
});
