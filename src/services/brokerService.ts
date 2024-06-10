import {BackofficeApi} from '../api/BackofficeClient';
import {CIBrokerDelegationPage} from '../api/generated/portal/CIBrokerDelegationPage';
import {CIBrokerStationPage} from '../api/generated/portal/CIBrokerStationPage';
import {getCIBrokerDelegationMock, getCIBrokerStationsMock} from './__mocks__/brokerService';

export const getCIBrokerDelegation = (
    brokerTaxCode: string,
    brokerId: string,
    ciName: string,
    limit: number,
    page: number
): Promise<CIBrokerDelegationPage> => {
    if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
        return getCIBrokerDelegationMock();
    } else {
        return BackofficeApi.getCIBrokerDelegation(brokerTaxCode, brokerId, ciName, limit, page);
    }
};

export const getCIBrokerStations = (
    brokerTaxCode: string,
    ciTaxCode: string,
    stationCode: string,
    limit: number,
    page: number
): Promise<CIBrokerStationPage> => {
    if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
        return getCIBrokerStationsMock();
    } else {
        return BackofficeApi.getCIBrokerStations(brokerTaxCode, ciTaxCode, stationCode, limit, page);
    }
};

export const deleteCIBroker = (brokerTaxCode: string): Promise<void> => {
    if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
        return new Promise((resolve) => resolve());
    } else {
        return BackofficeApi.deleteCIBroker(brokerTaxCode);
    }
};
