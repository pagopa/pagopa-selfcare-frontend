import {ThemeProvider} from '@mui/system';
import {theme} from '@pagopa/mui-italia';
import {cleanup, fireEvent, render, screen} from '@testing-library/react';
import React from 'react';
import {MemoryRouter, Route} from 'react-router-dom';
import {store} from '../../../../redux/store';
import {Provider} from 'react-redux';
import ECSelectionSearch from '../ECSelectionSearch';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

describe('<ECSelectionSearch />', () => {
  const stationId = 'XPAY_03_ONUS';
  const ec = {
    broker_ec_code: 'string',
    description: 'string',
    enabled: true,
    extended_fault_bean: true,
  };

  const availableEC = [
    { broker_ec_code: '1', description: 'EC 1', enabled: true, extended_fault_bean: true },
    { broker_ec_code: '2', description: 'EC 2', enabled: true, extended_fault_bean: true },
    { broker_ec_code: '3', description: 'EC 3', enabled: true, extended_fault_bean: true },
  ];

  const onECSelectionChange = jest.fn();

  test('render component ECSelectionSearch with available EC and EC selected', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/stations/${stationId}/associate-ec`]}>
          <Route path="/stations/:stationId/associate-ec">
            <ThemeProvider theme={theme}>
              <ECSelectionSearch
                availableEC={availableEC}
                selectedEC={undefined}
                onECSelectionChange={onECSelectionChange}
              />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );

    const ecSelectionSearch = screen.getByTestId('ec-selection-search');
    expect(ecSelectionSearch).toBeInTheDocument();

    fireEvent.change(ecSelectionSearch, { target: { value: 'EC 1' } });
    const filteredEC = screen.getByText('EC 1');
    const searchButton = screen.getByTestId('search-field-test');
    fireEvent.click(searchButton);
    expect(filteredEC).toBeInTheDocument();

    fireEvent.click(filteredEC);
    expect(onECSelectionChange).toHaveBeenCalledWith({
      broker_ec_code: '1',
      description: 'EC 1',
      enabled: true,
      extended_fault_bean: true,
    });

    const filteredECContainer = screen.getByTestId('PartyItemContainer: EC 1');
    fireEvent.click(filteredECContainer);

    const clearButton = screen.getByTestId('clear-field-test');
    fireEvent.click(clearButton);
  });

  test('render component ECSelectionSearch without available EC and EC selected', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/stations/${stationId}/associate-ec`]}>
          <Route path="/stations/:stationId/associate-ec">
            <ThemeProvider theme={theme}>
              <ECSelectionSearch
                availableEC={[]}
                selectedEC={undefined}
                onECSelectionChange={onECSelectionChange}
              />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );
  });
});
