import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { store } from '../../../../redux/store';
import { Provider } from 'react-redux';
import StationAssociateECPage from '../StationAssociateECPage';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

jest.mock('../../../../services/stationService', () => ({
  getStationAvailableEC: jest.fn(),
}));

describe('<StationAssociateECPage />', () => {
  const stationId = 'XPAY_03_ONUS';
  test('render component StationAssociateECPage', async () => {
    jest
      .spyOn(require('../../../../services/stationService'), 'getStationAvailableEC')
      .mockResolvedValue([
        {
          id: 'ec1',
          name: 'EC 1',
        },
        {
          id: 'ec2',
          name: 'EC 2',
        },
      ]);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/stations/${stationId}/associate-ec`]}>
          <Route path="/stations/:stationId/associate-ec">
            <ThemeProvider theme={theme}>
              <StationAssociateECPage />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );

    const ecSelectionSearch = screen.getByText(
      'Digita il nome del nuovo EC da associare al canale'
    );
    expect(ecSelectionSearch).toBeInTheDocument();

    const newEc = screen.getByTestId('ec-selection-search');
    fireEvent.change(newEc, { target: { value: 'EC 2' } });

    const searchSubmit = screen.getByTestId('search-field-test');
    fireEvent.click(searchSubmit);

    const confirm = screen.getByTestId('confirm-btn-test');
    fireEvent.click(confirm);

    // const alertSuccessMessage = await screen.findByText(
    //   'stationAssociateECPage.associationForm.successMessage'
    // );
    // expect(alertSuccessMessage).toBeInTheDocument();

    const back = screen.getByTestId('back-btn-test');
    fireEvent.click(back);
  });
});
