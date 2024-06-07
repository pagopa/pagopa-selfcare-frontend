import {BackofficeApi} from '../../api/BackofficeClient';
import {deleteCIBroker, getCIBrokerDelegation, getCIBrokerStations} from '../brokerService';

describe('BrokerService test client', () => {
    const OLD_ENV = process.env;
    beforeEach(() => {
        jest.resetModules();
        process.env = {...OLD_ENV, REACT_APP_API_MOCK_BACKOFFICE: 'false'};
    });

    afterAll(() => {
        process.env = OLD_ENV;
    });

    test('Test getCIBrokerDelegation', async () => {
        const spyOn = jest
            .spyOn(BackofficeApi, 'getCIBrokerDelegation')
            .mockReturnValue(new Promise((resolve) => resolve([])));
        expect(getCIBrokerDelegation('brokerTaxCode', 'brokerId', 'ciName', 10, 0)).resolves.not.toThrow();
        expect(spyOn).toBeCalledTimes(1);
    });
    test('Test getCIBrokerStations', async () => {
        const spyOn = jest
            .spyOn(BackofficeApi, 'getCIBrokerStations')
            .mockReturnValue(new Promise((resolve) => resolve('')));
        expect(getCIBrokerStations('brokerTaxCode', 'ciTaxCode', 'stationCode', 10, 0)).resolves.not.toThrow();
        expect(spyOn).toBeCalledTimes(1);
    });
    test('Test deleteCIBroker', async () => {
        const spyOn = jest
            .spyOn(BackofficeApi, 'deleteCIBroker')
            .mockReturnValue(new Promise((resolve) => resolve()));
        expect(deleteCIBroker('brokerTaxCode')).resolves.not.toThrow();
        expect(spyOn).toBeCalledTimes(1);
    });
});
