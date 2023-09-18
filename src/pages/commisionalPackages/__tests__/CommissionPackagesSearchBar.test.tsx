import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { store } from '../../../redux/store';
import { Provider } from 'react-redux';
import React from 'react';
import CommissionPackagesSearchBar from '../list/CommissionPackagesSearchBar';

let getCommissionPackagePspSpy: jest.SpyInstance;

beforeEach(() => {
  getCommissionPackagePspSpy = jest.spyOn(
    require('../../../services/__mocks__/commissionPackageService'),
    'getCommissionPackagePsp'
  );
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

describe('<CommissionPackagesSearchBar />', () => {
  test('render component CommissionPackagesSearchBar with filter', () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/comm-packages`]}>
          <Route path="/comm-packages">
            <ThemeProvider theme={theme}>
              <CommissionPackagesSearchBar
                packageNameInput={'lorem'}
                setPackageNameInput={jest.fn()}
              />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );
  });

  test('render component CommissionPackagesSearchBar without filter', () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/comm-packages`]}>
          <Route path="/comm-packages">
            <ThemeProvider theme={theme}>
              <CommissionPackagesSearchBar packageNameInput={''} setPackageNameInput={jest.fn()} />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );

    const filterName = screen.getByTestId('search-name-test') as HTMLInputElement;
    fireEvent.change(filterName, { target: { value: 'lorem' } });
  });
});
