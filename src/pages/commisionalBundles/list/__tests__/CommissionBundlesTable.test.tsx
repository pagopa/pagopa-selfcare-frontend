import {ThemeProvider} from '@mui/system';
import {theme} from '@pagopa/mui-italia';
import {cleanup, render, screen, waitFor} from '@testing-library/react';
import {MemoryRouter, Route} from 'react-router-dom';
import {store} from '../../../../redux/store';
import {Provider} from 'react-redux';
import React from 'react';
import CommissionBundlesTable from '../CommissionBundlesTable';
import * as BundleService from "../../../../services/bundleService";
import * as useOrganizationType from "../../../../hooks/useOrganizationType";
import {mockedCommissionBundlePspList} from '../../../../services/__mocks__/bundleService';

let getCommissionBundlePspSpy: jest.SpyInstance;

jest.mock("../../../../hooks/useOrganizationType");

beforeEach(() => {
  jest.spyOn(require('../../../../hooks/usePermissions'), "usePermissions")
    .mockReturnValue({ isPsp: () => true, isEc: () => true});
  getCommissionBundlePspSpy = jest.spyOn(
    require('../../../../services/__mocks__/bundleService'),
    'getCommissionBundlePsp'
  );
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

const mock = jest.spyOn(BundleService, "getBundleListByPSP");

afterEach(cleanup);
jest.setTimeout(20000);

describe('<CommissionBundlesTable />', () => {
  test('render component CommissionBundlesTable with bundle list', async () => {

    jest.spyOn(useOrganizationType, 'useOrganizationType').mockReturnValue({
      orgInfo: {
        isSigned: true,
        types: {
          isPsp: true,
          isPspBroker: true,
          isEc: false,
          isEcBroker: false,
        }
      },
      orgIsBroker: false,
      orgIsEcBrokerSigned: false,
      orgIsEcDirect: false,
      orgIsEcSigned: false,
      orgIsPspBrokerSigned: false,
      orgIsPspDirect: false,
      orgIsPspSigned: false

    });
 
    mock.mockReturnValueOnce(new Promise(resolve => resolve(mockedCommissionBundlePspList)));
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

    await waitFor(() => {
      expect(screen.queryByTestId("data-grid")).toBeInTheDocument();
      expect(screen.queryByTestId("empty-bundles")).not.toBeInTheDocument();
    }, {timeout: 10000})
  });

  test('render component CommissionBundlesTable without bundle list', async () => {
 
    mock.mockReturnValueOnce(new Promise(resolve => resolve({})));
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

    await waitFor(() => {
      expect(screen.queryByTestId("data-grid")).not.toBeInTheDocument();
      expect(screen.queryByTestId("empty-bundles")).toBeInTheDocument();
    }, {timeout: 10000})
  });
});
