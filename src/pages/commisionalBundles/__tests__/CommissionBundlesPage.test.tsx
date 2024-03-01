import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { cleanup, render } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { store } from '../../../redux/store';
import { Provider } from 'react-redux';
import React from 'react';
import CommissionBundlesPage from '../CommissionBundlesPage';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

describe('<CommisionalBundlesPage />', () => {
  test('render component CommisionalBundlesPage', () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/comm-bundles`]}>
          <Route path="/comm-bundles">
            <ThemeProvider theme={theme}>
              <CommissionBundlesPage />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );
  });
});
