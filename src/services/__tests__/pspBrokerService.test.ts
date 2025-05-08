import {BackofficeApi} from '../../api/BackofficeClient';
import {deletePSPBroker} from '../pspBrokerService';

describe('BrokerService test client', () => {
    const OLD_ENV = process.env;
    beforeEach(() => {
        jest.resetModules();
        process.env = {...OLD_ENV, REACT_APP_API_MOCK_BACKOFFICE: 'false'};
    });

    afterAll(() => {
        process.env = OLD_ENV;
    });

    test('Test deletePSPBroker', async () => {
        const spyOn = jest
            .spyOn(BackofficeApi.creditorInstitutionBroker, 'deletePSPBroker')
            .mockReturnValue(new Promise((resolve) => resolve()));
        expect(deletePSPBroker('brokerTaxCode')).resolves.not.toThrow();
        expect(spyOn).toBeCalledTimes(1);
    });
});
