import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { cleanup, render, screen } from '@testing-library/react';
import React from 'react';
import { Router } from 'react-router-dom';
import { store } from '../../../../redux/store';
import StationsTable from '../StationsTable';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

describe('<StationsTable />', () => {
  const history = createMemoryHistory();

  test('render component StationsTable', () => {
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router history={history}>
            <StationsTable />
          </Router>
        </ThemeProvider>
      </Provider>
    );
  });
});
