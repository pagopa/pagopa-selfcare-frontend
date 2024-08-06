import { render } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import StationMaintenancesHoursSummary from '../StationMaintenancesHoursSummary';
import { mockMaintenanceHoursSummary } from '../../../../services/__mocks__/stationMaintenancesService';
import { store } from '../../../../redux/store';

describe('<StationMaintenancesHoursSummary />', () => {
  test('render StationMaintenancesHoursSummary', () => {
    render(
      <Provider store={store}>
        <StationMaintenancesHoursSummary hoursSummary={mockMaintenanceHoursSummary}/>
      </Provider>
    );
  });
  test('render StationMaintenancesHoursSummary error getBrokerMaintenancesSummary', () => {
    render(
      <Provider store={store}>
        <StationMaintenancesHoursSummary hoursSummary={mockMaintenanceHoursSummary}/>
      </Provider>
    );
  });
});
