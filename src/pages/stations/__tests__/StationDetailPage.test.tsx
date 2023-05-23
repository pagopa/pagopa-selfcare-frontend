import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { cleanup, render } from '@testing-library/react';
import React from 'react';
import { Router } from 'react-router-dom';
import { store } from '../../../redux/store';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import StationDetailPage from '../detail/StationDetailPage';
import { partiesActions } from '../../../redux/slices/partiesSlice';
import { mockedParties } from '../../../services/__mocks__/partyService';
import { getWrapperStation } from '../../../services/__mocks__/stationService';

// import { Party } from '../../../model/Party';
// import { fetchParties } from '../../../services/partyService';

// jest.mock('../../../api/PortalApiClient.ts');

// let portalApiFetchPartySpy;

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  // portalApiFetchPartySpy = jest.spyOn(require('../../../services/partyService'), 'fetchParties');
});

afterEach(cleanup);

describe('<StationDetailPage />', () => {
  const history = createMemoryHistory();

  test('render component StationDetailPage', () => {
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router history={history}>
            <StationDetailPage />
          </Router>
        </ThemeProvider>
      </Provider>
    );
  });

  test('Test Render station detail with role operator', async () => {
    store.dispatch(partiesActions.setPartySelected(mockedParties[1]));
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router history={history}>
            <StationDetailPage />
          </Router>
        </ThemeProvider>
      </Provider>
    );
  });
});
