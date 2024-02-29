import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import CommissionBundleDetailPage from '../../detail/CommissionBundleDetailPage';
import * as BundleService from '../../../../services/bundleService';
import { mockedCommissionBundlePspDetailGlobal, mockedCommissionBundlePspDetailPrivate, mockedCommissionBundlePspDetailPublic } from '../../../../services/__mocks__/bundleService';
import { MemoryRouter, Route } from 'react-router-dom';
import { store } from '../../../../redux/store';
import { Provider } from 'react-redux';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

const mock = jest.spyOn(BundleService, 'getBundleDetailByPSP');
const deleteMock = jest.spyOn(BundleService, "deletePSPBundle");
const idBundle = "idBundle";

describe('<CommissionBundleDetailPage />', () => {
  test('render component CommissionBundleDetailPage bundle type GLOBAl', async () => {
    mock.mockReturnValueOnce(
      new Promise((resolve) => resolve(mockedCommissionBundlePspDetailGlobal))
    );
    deleteMock.mockReturnValueOnce(new Promise(resolve => resolve()));

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/comm-bundles/${idBundle}/`]}>
          <Route path="/comm-bundles/:bundleId/">
            <CommissionBundleDetailPage />
          </Route>
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('taxonomies-detail')).not.toBeInTheDocument();
      expect(screen.queryByTestId('config-detail')).toBeInTheDocument();

      const deleteButton = screen.getByTestId("delete-button");
      fireEvent.click(deleteButton);

      expect(screen.queryByTestId('fade-test')).toBeInTheDocument();
      
      const confirmDeleteButton = screen.getByTestId("confirm-button-test");
      fireEvent.click(confirmDeleteButton);
      expect(deleteMock).toBeCalledTimes(1);
    });
  });

  test('render component CommissionBundleDetailPage bundle type PRIVATE', async () => {
    mock.mockReturnValueOnce(
      new Promise((resolve) => resolve(mockedCommissionBundlePspDetailPrivate))
    );
    deleteMock.mockReturnValueOnce(new Promise(resolve => resolve()));

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/comm-bundles/${idBundle}/`]}>
          <Route path="/comm-bundles/:bundleId/">
            <CommissionBundleDetailPage />
          </Route>
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('taxonomies-detail')).toBeInTheDocument();
      expect(screen.queryByTestId('config-detail')).toBeInTheDocument();
    });
  });

  test('render component CommissionBundleDetailPage bundle type PUBLIC', async () => {
    mock.mockReturnValueOnce(
      new Promise((resolve) => resolve(mockedCommissionBundlePspDetailPublic))
    );
    deleteMock.mockReturnValueOnce(new Promise(resolve => resolve()));

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/comm-bundles/${idBundle}/`]}>
          <Route path="/comm-bundles/:bundleId/">
            <CommissionBundleDetailPage />
          </Route>
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('taxonomies-detail')).toBeInTheDocument();
      expect(screen.queryByTestId('config-detail')).toBeInTheDocument();
    });
  });
});
