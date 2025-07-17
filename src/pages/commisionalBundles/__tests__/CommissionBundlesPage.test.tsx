import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { store } from '../../../redux/store';
import { Provider } from 'react-redux';
import React from 'react';
import CommissionBundlesPage from '../CommissionBundlesPage';
import * as useFeatureFlags from '../../../hooks/useFeatureFlags';
import { bundlesActions } from '../../../redux/slices/bundlesSlice';
import { useAppDispatch } from '../../../redux/hooks';
import {
  mockedCommissionBundlePspDetailGlobal,
  mockedCommissionBundlePspDetailPrivate,
  mockedCommissionBundlePspDetailPublic,
} from '../../../services/__mocks__/bundleService';
import { BundleResource } from '../../../model/CommissionBundle';
import * as useOrganizationType from '../../../hooks/useOrganizationType';
import * as useUserRole from '../../../hooks/useUserRole';
import { ROLE } from '../../../model/RolePermission';

let spyOnUseFlagValue: jest.SpyInstance<boolean, string[]>;

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  spyOnUseFlagValue = jest.spyOn(useFeatureFlags, 'useFlagValue');
  jest.spyOn(useUserRole, 'useUserRole').mockReturnValue({
    userRole: ROLE.PSP_ADMIN,
    userIsPspAdmin: false,
    userIsEcAdmin: false,
    userIsPspDirectAdmin: false,
    userIsPagopaOperator: false,
    userIsAdmin: true,
    userIsPspOperator: false
  });
  jest.spyOn(useOrganizationType, 'useOrganizationType').mockReturnValue({
    orgInfo: {
      isSigned: true,
      types: {
        isPsp: true,
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
});

afterEach(cleanup);

const ComponentRender = ({ bundle }: { bundle: BundleResource }) => {
  const dispatch = useAppDispatch();
  dispatch(bundlesActions.setSelectedBundle(bundle));

  return (
    <MemoryRouter initialEntries={[`/comm-bundles`]}>
      <Route path="/comm-bundles">
        <ThemeProvider theme={theme}>
          <CommissionBundlesPage />
        </ThemeProvider>
      </Route>
    </MemoryRouter>
  );
};

describe('<CommisionalBundlesPage />', () => {
  test('render component CommisionalBundlesPage all package types', async () => {
    const exportBundleList = jest
      .spyOn(require('../../../services/bundleService'), 'exportPSPBundleList')
      .mockResolvedValue('');

    spyOnUseFlagValue.mockReturnValue(true);

    render(
      <Provider store={store}>
        <ComponentRender bundle={mockedCommissionBundlePspDetailGlobal} />
      </Provider>
    );

    expect(screen.getByTestId('tab-private')).not.toBeDisabled();
    expect(screen.getByTestId('tab-public')).not.toBeDisabled();
    expect(screen.getByTestId('tab-global')).not.toBeDisabled();

    expect(screen.queryByTestId('table-PRIVATE')).not.toBeInTheDocument();
    expect(screen.queryByTestId('table-PUBLIC')).not.toBeInTheDocument();
    expect(screen.queryByTestId('table-GLOBAL')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('tab-public'));

    await waitFor(() => {
      expect(screen.queryByTestId('table-PRIVATE')).not.toBeInTheDocument();
      expect(screen.queryByTestId('table-PUBLIC')).toBeInTheDocument();
      expect(screen.queryByTestId('table-GLOBAL')).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('tab-private'));

    await waitFor(() => {
      expect(screen.queryByTestId('table-PRIVATE')).toBeInTheDocument();
      expect(screen.queryByTestId('table-PUBLIC')).not.toBeInTheDocument();
      expect(screen.queryByTestId('table-GLOBAL')).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('download-bundle-button'));

    await waitFor(() => {
        const confirmButtonModal = screen.getByTestId('confirm-button-test');
        fireEvent.click(confirmButtonModal);
    });

    await waitFor(() => {
        expect(exportBundleList).toBeCalled();
    });
  });

  test('render component CommisionalBundlesPage only global', () => {
    spyOnUseFlagValue.mockReturnValue(false);

    render(
      <Provider store={store}>
        <ComponentRender bundle={mockedCommissionBundlePspDetailGlobal} />
      </Provider>
    );

    expect(screen.getByTestId('tab-private')).toBeDisabled();
    expect(screen.getByTestId('tab-public')).toBeDisabled();
    expect(screen.getByTestId('tab-global')).not.toBeDisabled();

    expect(screen.queryByTestId('table-PRIVATE')).not.toBeInTheDocument();
    expect(screen.queryByTestId('table-PUBLIC')).not.toBeInTheDocument();
    expect(screen.queryByTestId('table-GLOBAL')).toBeInTheDocument();
  });

  test('render component CommisionalBundlesPage only private & global', () => {
    spyOnUseFlagValue.mockImplementation((arg) => arg === 'commission-bundles-private');

    render(
      <Provider store={store}>
        <ComponentRender bundle={mockedCommissionBundlePspDetailPrivate} />
      </Provider>
    );

    expect(screen.getByTestId('tab-private')).not.toBeDisabled();
    expect(screen.getByTestId('tab-public')).toBeDisabled();
    expect(screen.getByTestId('tab-global')).not.toBeDisabled();

    expect(screen.queryByTestId('table-PRIVATE')).toBeInTheDocument();
    expect(screen.queryByTestId('table-PUBLIC')).not.toBeInTheDocument();
    expect(screen.queryByTestId('table-GLOBAL')).not.toBeInTheDocument();
  });

  test('render component CommisionalBundlesPage only public & global', () => {
    spyOnUseFlagValue.mockImplementation((arg) => arg === 'commission-bundles-public');

    render(
      <Provider store={store}>
        <ComponentRender bundle={mockedCommissionBundlePspDetailPublic} />
      </Provider>
    );

    expect(screen.getByTestId('tab-private')).toBeDisabled();
    expect(screen.getByTestId('tab-public')).not.toBeDisabled();
    expect(screen.getByTestId('tab-global')).not.toBeDisabled();

    expect(screen.queryByTestId('table-PRIVATE')).not.toBeInTheDocument();
    expect(screen.queryByTestId('table-PUBLIC')).toBeInTheDocument();
    expect(screen.queryByTestId('table-GLOBAL')).not.toBeInTheDocument();
  });

  test('render component CommisionalBundlesPage error export', async () => {
    const exportBundleList = jest
      .spyOn(require('../../../services/bundleService'), 'exportPSPBundleList')
      .mockRejectedValue('');

    spyOnUseFlagValue.mockReturnValue(true);

    render(
      <Provider store={store}>
        <ComponentRender bundle={mockedCommissionBundlePspDetailGlobal} />
      </Provider>
    );

    fireEvent.click(screen.getByTestId('download-bundle-button'));

    await waitFor(() => {
        const confirmButtonModal = screen.getByTestId('confirm-button-test');
        fireEvent.click(confirmButtonModal);
    });

    await waitFor(() => {
        expect(exportBundleList).toBeCalled();
    });
  });
});
