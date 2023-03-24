import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { cleanup, render } from '@testing-library/react';
import React from 'react';
import { Router } from 'react-router-dom';
import { store } from '../../../redux/store';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import StationPage from '../list/StationsPage';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

describe('<AddEditChannelPage />', () => {
  const history = createMemoryHistory();

  test('render component AddEditChannelPage', () => {
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router history={history}>
            <StationPage />
          </Router>
        </ThemeProvider>
      </Provider>
    );
  });
});
