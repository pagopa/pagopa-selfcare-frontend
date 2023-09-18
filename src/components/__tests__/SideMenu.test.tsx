import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { store } from '../../redux/store';
import SideMenu from '../SideMenu/SideMenu';
import React from 'react';
import { ENV } from '../../utils/env';
import { mockedParties } from '../../services/__mocks__/partyService';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

describe('<SideMenu />', () => {
  const history = createMemoryHistory();

  test('render SideMenu with psp selected party', async () => {
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router history={history}>
            <SideMenu />
          </Router>
        </ThemeProvider>
      </Provider>
    );

    await waitFor(() =>
      store.dispatch({
        type: 'parties/setPartySelected',
        payload: mockedParties[0],
      })
    );

    const apikeys = await screen.findByText('sideMenu.apikeys.title');
    fireEvent.click(apikeys);

    const home = await screen.findByText('sideMenu.home.title');
    fireEvent.click(home);

    const channels = await screen.findByText('sideMenu.channels.title');
    fireEvent.click(channels);
  });

  test('render SideMenu with ec selected party', async () => {
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router history={history}>
            <SideMenu />
          </Router>
        </ThemeProvider>
      </Provider>
    );

    await waitFor(() =>
      store.dispatch({
        type: 'parties/setPartySelected',
        payload: mockedParties[1],
      })
    );

    const stations = await screen.findByText('sideMenu.stations.title');
    fireEvent.click(stations);

    const iban = await screen.findByText('sideMenu.iban.title');
    fireEvent.click(iban);

    if (store.getState().parties.selected?.institutionType === 'PSP') {
      const commPages = await screen.findByText('sideMenu.commPackages.title');
      fireEvent.click(commPages);
    }
  });
});
