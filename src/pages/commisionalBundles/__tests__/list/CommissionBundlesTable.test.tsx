import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { cleanup, render } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { store } from '../../../../redux/store';
import { Provider } from 'react-redux';
import React from 'react';
import CommissionBundlesTable from '../../list/CommissionBundlesTable';

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

describe('<CommissionBundlesTable />', () => {
  test('render component CommissionBundlesTable', () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/comm-bundles`]}>
          <Route path="/comm-bundles">
            <ThemeProvider theme={theme}>
              <CommissionBundlesTable
                bundleNameFilter={''}
                bundleType={'commissionBundlesPage.privateBundles'}
              />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );
  });
});