import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import CommissionBundleDetailPage from '../../detail/CommissionBundleDetailPage';
import * as BundleService from '../../../../services/bundleService';
import {
  mockedCommissionBundlePspDetailGlobal,
  mockedCommissionBundlePspDetailPrivate,
  mockedCommissionBundlePspDetailPublic,
} from '../../../../services/__mocks__/bundleService';
import { MemoryRouter, Route } from 'react-router-dom';
import { store } from '../../../../redux/store';
import { Provider } from 'react-redux';
import { useAppDispatch } from '../../../../redux/hooks';
import { BundleResource } from '../../../../api/generated/portal/BundleResource';
import { bundleDetailsActions } from '../../../../redux/slices/bundleDetailsSlice';
import * as usePermissions from '../../../../hooks/usePermissions';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);
jest.mock('../../../../hooks/usePermissions');

const deleteMock = jest.spyOn(BundleService, 'deletePSPBundle');

const idBundle = 'idBundle';

const ComponentToRender = ({ bundle }: { bundle: BundleResource }) => {
  const dispatcher = useAppDispatch();
  dispatcher(bundleDetailsActions.setBundleDetailsState(bundle));

  return (
    <MemoryRouter initialEntries={[`/comm-bundles/${idBundle}/`]}>
      <Route path="/comm-bundles/:bundleId/">
        <CommissionBundleDetailPage />
      </Route>
    </MemoryRouter>
  );
};

jest.mock('../../../../hooks/usePermissions');

describe('<CommissionBundleDetailPage /> for PSP', () => {
  beforeEach(() => {
    jest
    .spyOn(usePermissions, 'usePermissions')
    .mockReturnValue({ isPsp: () => true, hasPermission: jest.fn(), isEc: () => false });
  });

  test('render component CommissionBundleDetailPage bundle type GLOBAl', async () => {
    deleteMock.mockReturnValueOnce(new Promise((resolve) => resolve()));

    render(
      <Provider store={store}>
        <ComponentToRender bundle={mockedCommissionBundlePspDetailGlobal} />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('taxonomies-detail')).toBeInTheDocument();
      expect(screen.queryByTestId('config-detail')).toBeInTheDocument();
    });

    const deleteButton = screen.getByTestId('delete-button');
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.queryByTestId('fade-test')).toBeInTheDocument();
    });

    const cancelDeleteButton = screen.getByTestId('cancel-button-test');
    fireEvent.click(cancelDeleteButton);

    await waitFor(() => {
      expect(screen.queryByTestId('fade-test')).not.toBeInTheDocument();
    });

    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.queryByTestId('fade-test')).toBeInTheDocument();
    });

    const confirmDeleteButton = screen.getByTestId('confirm-button-test');
    fireEvent.click(confirmDeleteButton);
    expect(deleteMock).toBeCalledTimes(1);
  });

  test('render component CommissionBundleDetailPage bundle type PRIVATE', async () => {
    deleteMock.mockReturnValueOnce(new Promise((resolve) => resolve()));

    render(
      <Provider store={store}>
        <ComponentToRender bundle={mockedCommissionBundlePspDetailPrivate} />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('taxonomies-detail')).toBeInTheDocument();
      expect(screen.queryByTestId('config-detail')).toBeInTheDocument();
    });
  });

  test('render component CommissionBundleDetailPage bundle type PUBLIC', async () => {
    deleteMock.mockReturnValueOnce(new Promise((resolve) => resolve()));

    render(
      <Provider store={store}>
        <ComponentToRender bundle={mockedCommissionBundlePspDetailPublic} />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('taxonomies-detail')).toBeInTheDocument();
      expect(screen.queryByTestId('config-detail')).toBeInTheDocument();
    });
  });
});

describe('<CommissionBundleDetailPage /> for EC', () => {
  beforeEach(() => {
    jest
    .spyOn(usePermissions, 'usePermissions')
    .mockReturnValue({ isPsp: () => false, hasPermission: jest.fn(), isEc: () => true });
  });

  test('render component CommissionBundleDetailPage bundle type GLOBAl', async () => {
    deleteMock.mockReturnValueOnce(new Promise((resolve) => resolve()));

    render(
      <Provider store={store}>
        <ComponentToRender bundle={mockedCommissionBundlePspDetailGlobal} />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('taxonomies-detail')).toBeInTheDocument();
      expect(screen.queryByTestId('config-detail')).toBeInTheDocument();
    });
  });

  test('render component CommissionBundleDetailPage bundle type PRIVATE', async () => {
    deleteMock.mockReturnValueOnce(new Promise((resolve) => resolve()));

    render(
      <Provider store={store}>
        <ComponentToRender bundle={mockedCommissionBundlePspDetailPrivate} />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('taxonomies-detail')).toBeInTheDocument();
      expect(screen.queryByTestId('config-detail')).toBeInTheDocument();
    });
  });

  test('render component CommissionBundleDetailPage bundle type PUBLIC', async () => {
    deleteMock.mockReturnValueOnce(new Promise((resolve) => resolve()));

    render(
      <Provider store={store}>
        <ComponentToRender bundle={mockedCommissionBundlePspDetailPublic} />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('taxonomies-detail')).toBeInTheDocument();
      expect(screen.queryByTestId('config-detail')).toBeInTheDocument();
    });
  });
});