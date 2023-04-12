import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import SideMenu from '../SideMenu/SideMenu';
import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { store } from '../../redux/store';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

describe('<SideMenu />', () => {
  const history = createMemoryHistory();
  test('render SideMenu', async () => {
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router history={history}>
            <SideMenu />
          </Router>
        </ThemeProvider>
      </Provider>
    );

    const home = screen.getByText('sideMenu.home.title');
    fireEvent.click(home);

    const apikeys = screen.getByText('sideMenu.apikeys.title');
    fireEvent.click(apikeys);

    // const channels = await screen.findByText('sideMenu.channels.title');
    // fireEvent.click(channels);

    // const stations = await screen.findByText('sideMenu.stations.title');
    // fireEvent.click(stations);
  });
});
