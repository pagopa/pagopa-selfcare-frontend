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

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

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

describe('<CommissionBundleDetailPage />', () => {
  test('render component CommissionBundleDetailPage bundle type GLOBAl', async () => {
    deleteMock.mockReturnValueOnce(new Promise((resolve) => resolve()));

    render(
      <Provider store={store}>
        <ComponentToRender bundle={mockedCommissionBundlePspDetailGlobal} />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('taxonomies-detail')).not.toBeInTheDocument();
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
