import { render } from '@testing-library/react';
import React from 'react';
import Layout from '../Layout/Layout';
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

describe('<Layout />', () => {
  const history = createMemoryHistory();
  test('render Layout component', () => {
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router history={history}>
            <Layout />{' '}
          </Router>
        </ThemeProvider>
      </Provider>
    );
  });
});
