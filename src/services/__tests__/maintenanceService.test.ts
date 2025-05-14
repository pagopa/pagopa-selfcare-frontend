import {BackofficeApi} from '../../api/BackofficeClient';
import {mockMaintenanceMessage} from '../__mocks__/maintenanceService';
import {getMaintenanceMessage} from '../maintenanceService';

describe('MaintenanceService test mocked', () => {
    test('Test getMaintenanceMessage', async () => {
        const response = await getMaintenanceMessage();
        expect(response).toMatchObject(mockMaintenanceMessage);
    });
});

describe('MaintenanceService test client', () => {
    const OLD_ENV = process.env;
    beforeEach(() => {
        jest.resetModules();
        process.env = {...OLD_ENV, REACT_APP_API_MOCK_BACKOFFICE: 'false'};
    });

    afterAll(() => {
        process.env = OLD_ENV;
    });

    test('Test getMaintenanceMessage', async () => {
        const spyOn = jest
            .spyOn(BackofficeApi.home, 'getMaintenanceMessage')
            .mockReturnValue(Promise.resolve(mockMaintenanceMessage));
        expect(getMaintenanceMessage()).resolves.not.toThrow();
        expect(spyOn).toBeCalledTimes(1);
    });
});
