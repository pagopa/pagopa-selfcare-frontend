import {ThemeProvider} from '@mui/system';
import {theme} from '@pagopa/mui-italia';
import {cleanup, fireEvent, render, screen} from '@testing-library/react';
import React from 'react';
import {MemoryRouter, Route} from 'react-router-dom';
import {store} from '../../../../redux/store';
import {Provider} from 'react-redux';
import PSPSelectionSearch from '../PSPSelectionSearch';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

describe('<PSPSelectionSearch />', () => {
  const channelId = 'XPAY_03_ONUS';
  const psp = {
    broker_psp_code: 'string',
    description: 'string',
    enabled: true,
    extended_fault_bean: true,
  };

  const availablePSP = [
    { broker_psp_code: '1', description: 'PSP 1', enabled: true, extended_fault_bean: true },
    { broker_psp_code: '2', description: 'PSP 2', enabled: true, extended_fault_bean: true },
    { broker_psp_code: '3', description: 'PSP 3', enabled: true, extended_fault_bean: true },
  ];

  const onPSPSelectionChange = jest.fn();

  test('render component PSPSelectionSearch with available PSP and PSP selected', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/channels/${channelId}/associate-psp`]}>
          <Route path="/channels/:channelId/associate-psp">
            <ThemeProvider theme={theme}>
              <PSPSelectionSearch
                availablePSP={availablePSP}
                selectedPSP={undefined}
                onPSPSelectionChange={onPSPSelectionChange}
              />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );

    const pspSelectionSearch = screen.getByTestId('psp-selection-search');
    expect(pspSelectionSearch).toBeInTheDocument();

    fireEvent.change(pspSelectionSearch, { target: { value: 'PSP 1' } });
    const filteredPSP = screen.getByText('PSP 1');
    const searchButton = screen.getByTestId('search-field-test');
    fireEvent.click(searchButton);
    expect(filteredPSP).toBeInTheDocument();

    fireEvent.click(filteredPSP);
    expect(onPSPSelectionChange).toHaveBeenCalledWith({
      broker_psp_code: '1',
      description: 'PSP 1',
      enabled: true,
      extended_fault_bean: true,
    });

    const filteredPSPContainer = screen.getByTestId('PartyItemContainer: PSP 1');
    fireEvent.click(filteredPSPContainer);

    const clearButton = screen.getByTestId('clear-field-test');
    fireEvent.click(clearButton);
  });

  test('render component PSPSelectionSearch without available PSP and PSP selected', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/channels/${channelId}/associate-psp`]}>
          <Route path="/channels/:channelId/associate-psp">
            <ThemeProvider theme={theme}>
              <PSPSelectionSearch
                availablePSP={[]}
                selectedPSP={undefined}
                onPSPSelectionChange={onPSPSelectionChange}
              />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );
  });
});
