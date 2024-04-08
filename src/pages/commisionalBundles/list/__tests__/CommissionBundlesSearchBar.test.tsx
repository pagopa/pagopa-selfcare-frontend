import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { store } from '../../../../redux/store';
import { Provider } from 'react-redux';
import React from 'react';
import CommissionBundlesSearchBar from '../CommissionBundlesSearchBar';

let getCommissionBundlePspSpy: jest.SpyInstance;

beforeEach(() => {
  getCommissionBundlePspSpy = jest.spyOn(
    require('../../../../services/__mocks__/bundleService'),
    'getCommissionBundlePsp'
  );
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

describe('<CommissionBundlesSearchBar />', () => {
  test('render component CommissionBundlesSearchBar with filter', () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/comm-bundles`]}>
          <Route path="/comm-bundles">
            <ThemeProvider theme={theme}>
              <CommissionBundlesSearchBar
                bundleNameInput={'lorem'}
                setBundleNameInput={jest.fn()}
              />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );
  });

  test('render component CommissionBundlesSearchBar without filter', () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/comm-bundles`]}>
          <Route path="/comm-bundles">
            <ThemeProvider theme={theme}>
              <CommissionBundlesSearchBar bundleNameInput={''} setBundleNameInput={jest.fn()} />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );

    const filterName = screen.getByTestId('search-name-test') as HTMLInputElement;
    fireEvent.change(filterName, { target: { value: 'lorem' } });
  });
});

