import React from 'react';
import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import { store } from '../../../../redux/store';
import StationECTableEmpty from '../StationECTableEmpty';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

describe('<StationECTableEmpty />', () => {
  const history = createMemoryHistory();
  test('render component StationECTableEmpty', async () => {
    await waitFor(() => {
      render(
        <Provider store={store}>
          <Router history={history}>
            <ThemeProvider theme={theme}>
              <StationECTableEmpty stationId={'XPAY_03_ONUS'} />
            </ThemeProvider>
          </Router>
        </Provider>
      );
    });

    const associateEc = screen.getByText('stationECList.associateEcButtonLabel');
    fireEvent.click(associateEc);
  });
});
