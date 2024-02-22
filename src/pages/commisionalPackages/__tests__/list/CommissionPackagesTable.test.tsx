import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { cleanup, render } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { store } from '../../../../redux/store';
import { Provider } from 'react-redux';
import React from 'react';
import CommissionPackagesTable from '../../list/CommissionPackagesTable';

let getCommissionPackagePspSpy: jest.SpyInstance;

beforeEach(() => {
  getCommissionPackagePspSpy = jest.spyOn(
    require('../../../../services/__mocks__/bundleService'),
    'getCommissionPackagePsp'
  );
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

describe('<CommissionPackagesTable />', () => {
  test('render component CommissionPackagesTable', () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/comm-packages`]}>
          <Route path="/comm-packages">
            <ThemeProvider theme={theme}>
              <CommissionPackagesTable
                packageNameFilter={''}
                packageType={'commissionPackagesPage.privatePackages'}
              />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );
  });
});

//SNAPSHOT TESTING
it('renders correctly', () => {
  const tree = render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[`/comm-packages`]}>
        <Route path="/comm-packages">
          <ThemeProvider theme={theme}>
            <CommissionPackagesTable
              packageNameFilter={''}
              packageType={'commissionPackagesPage.privatePackages'}
            />
          </ThemeProvider>
        </Route>
      </MemoryRouter>
    </Provider>
  );
  expect(tree).toMatchSnapshot();
});