import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { store } from '../../../../redux/store';
import { Provider } from 'react-redux';
import React from 'react';
import CommissionBundlesTable from '../CommissionBundlesTable';
import * as BundleService from '../../../../services/bundleService';
import * as useOrganizationType from '../../../../hooks/useOrganizationType';
import { mockedCommissionBundlePspList } from '../../../../services/__mocks__/bundleService';

let getBundleListByPSPSpy: jest.SpyInstance;
let getCisBundlesSpy: jest.SpyInstance;

jest.mock('../../../../hooks/useOrganizationType');

beforeEach(() => {
  jest
    .spyOn(require('../../../../hooks/usePermissions'), 'usePermissions')
    .mockReturnValue({ isPsp: () => true, isEc: () => true });
  getBundleListByPSPSpy = jest.spyOn(BundleService, 'getBundleListByPSP');
  getCisBundlesSpy = jest.spyOn(BundleService, 'getCisBundles');
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
  cleanup();
  jest.restoreAllMocks();
});

describe('<CommissionBundlesTable />', () => {
  test('render component CommissionBundlesTable with bundle list for PSP', async () => {
    jest.spyOn(useOrganizationType, 'useOrganizationType').mockReturnValue({
      orgInfo: {
        isSigned: true,
        types: {
          isPsp: true,
          isPspBroker: true,
          isEc: false,
          isEcBroker: false,
        },
      },
      orgIsBrokerSigned: false,
      orgIsEcBrokerSigned: false,
      orgIsEcDirect: false,
      orgIsEcSigned: false,
      orgIsPspBrokerSigned: false,
      orgIsPspDirect: false,
      orgIsPspSigned: false,
    });

    getBundleListByPSPSpy.mockResolvedValue(mockedCommissionBundlePspList);
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/comm-bundles`]}>
          <Route path="/comm-bundles">
            <ThemeProvider theme={theme}>
              <CommissionBundlesTable
                filtersValue={''}
                bundleType={'commissionBundlesPage.privateBundles'}
              />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );

    expect(await screen.findByText('Commission Bundle Name')).toBeInTheDocument();
    expect(screen.getByTestId('data-grid')).toBeInTheDocument();
    expect(screen.queryByTestId('empty-state-table')).not.toBeInTheDocument();
  });

  test('render component CommissionBundlesTable with bundle list for EC', async () => {
    jest.spyOn(useOrganizationType, 'useOrganizationType').mockReturnValue({
      orgInfo: {
        isSigned: true,
        types: {
          isPsp: false,
          isPspBroker: false,
          isEc: true,
          isEcBroker: true,
        },
      },
      orgIsBrokerSigned: false,
      orgIsEcBrokerSigned: false,
      orgIsEcDirect: false,
      orgIsEcSigned: false,
      orgIsPspBrokerSigned: false,
      orgIsPspDirect: false,
      orgIsPspSigned: false,
    });

    getCisBundlesSpy.mockResolvedValue(mockedCommissionBundlePspList);
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/comm-bundles`]}>
          <Route path="/comm-bundles">
            <ThemeProvider theme={theme}>
              <CommissionBundlesTable
                filtersValue={''}
                bundleType={'commissionBundlesPage.publicBundles'}
              />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );

    expect(await screen.findByText('Commission Bundle Name')).toBeInTheDocument();
    expect(screen.getByTestId('data-grid')).toBeInTheDocument();
    expect(screen.queryByTestId('empty-state-table')).not.toBeInTheDocument();
  });

  test('render component CommissionBundlesTable without bundle list', async () => {
    jest.spyOn(useOrganizationType, 'useOrganizationType').mockReturnValue({
      orgInfo: {
        isSigned: true,
        types: {
          isPsp: true,
          isPspBroker: true,
          isEc: false,
          isEcBroker: false,
        },
      },
      orgIsBrokerSigned: false,
      orgIsEcBrokerSigned: false,
      orgIsEcDirect: false,
      orgIsEcSigned: false,
      orgIsPspBrokerSigned: false,
      orgIsPspDirect: false,
      orgIsPspSigned: false,
    });
    getBundleListByPSPSpy.mockRejectedValue('');
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/comm-bundles`]}>
          <Route path="/comm-bundles">
            <ThemeProvider theme={theme}>
              <CommissionBundlesTable
                filtersValue={''}
                bundleType={'commissionBundlesPage.globalBundles'}
              />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('empty-state-table')).toBeInTheDocument();
    });
  });

  test('render component CommissionBundlesTable with private bundle list for EC', async () => {
    jest.spyOn(useOrganizationType, 'useOrganizationType').mockReturnValue({
      orgInfo: {
        isSigned: true,
        types: {
          isPsp: false,
          isPspBroker: false,
          isEc: true,
          isEcBroker: true,
        },
      },
      orgIsBrokerSigned: false,
      orgIsEcBrokerSigned: false,
      orgIsEcDirect: false,
      orgIsEcSigned: false,
      orgIsPspBrokerSigned: false,
      orgIsPspDirect: false,
      orgIsPspSigned: false,
    });

    getCisBundlesSpy.mockResolvedValue([]);
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/comm-bundles`]}>
          <Route path="/comm-bundles">
            <ThemeProvider theme={theme}>
              <CommissionBundlesTable
                filtersValue={''}
                bundleType={'commissionBundlesPage.privateBundles'}
              />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('data-grid')).toBeInTheDocument();
      expect(screen.queryByTestId('empty-state-table')).toBeInTheDocument();
      expect(screen.queryByTestId('private-bundle-cta')).toBeInTheDocument();
    });

    getCisBundlesSpy.mockResolvedValue(mockedCommissionBundlePspList);
    fireEvent.click(screen.getByTestId('private-bundle-cta'));

    expect(await screen.findByText('Commission Bundle Name')).toBeInTheDocument();
    expect(getCisBundlesSpy).toBeCalledTimes(2);
  });
});
