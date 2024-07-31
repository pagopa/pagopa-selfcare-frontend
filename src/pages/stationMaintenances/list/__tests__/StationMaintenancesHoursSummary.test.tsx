import { render } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import StationMaintenancesHoursSummary from '../StationMaintenancesHoursSummary';
import * as StationMaintenanceService from '../../../../services/stationMaintenancesService';
import { mockMaintenanceHoursSummary } from '../../../../services/__mocks__/stationMaintenancesService';
import { store } from '../../../../redux/store';

const mockGetStationMaintenances = jest.spyOn(
  StationMaintenanceService,
  'getBrokerMaintenancesSummary'
);
describe('<StationMaintenancesHoursSummary />', () => {
  test('render StationMaintenancesHoursSummary', () => {
    mockGetStationMaintenances.mockResolvedValueOnce(mockMaintenanceHoursSummary);
    render(
      <Provider store={store}>
        <StationMaintenancesHoursSummary />
      </Provider>
    );
  });
  test('render StationMaintenancesHoursSummary error getBrokerMaintenancesSummary', () => {
    mockGetStationMaintenances.mockRejectedValueOnce("error");
    render(
      <Provider store={store}>
        <StationMaintenancesHoursSummary />
      </Provider>
    );
  });
});
