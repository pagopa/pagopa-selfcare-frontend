import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { store } from '../../redux/store';
import Header from '../Header';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

describe('<Header />', () => {
  const history = createMemoryHistory();
  test('render Header component', () => {
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router history={history}>
            <Header onExit={() => {}} />
          </Router>
        </ThemeProvider>
      </Provider>
    );
  });
});
