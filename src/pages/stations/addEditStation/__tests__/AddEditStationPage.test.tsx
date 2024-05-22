import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { cleanup, render } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { store } from '../../../../redux/store';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import React from 'react';
import AddEditStationPage from '../AddEditStationPage';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

describe('<AddEditStationPage />', () => {
  const history = createMemoryHistory();

  test('render component AddEditStationPage', () => {
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router history={history}>
            <AddEditStationPage />
          </Router>
        </ThemeProvider>
      </Provider>
    );
  });
});
