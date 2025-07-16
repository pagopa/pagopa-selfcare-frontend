import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import CommissionBundleDetailActivationPage from '../CommissionBundleDetailActivationPage.tsx';
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { useAppDispatch } from '../../../../redux/hooks.ts';
import { bundlesActions } from '../../../../redux/slices/bundlesSlice.ts';
import {
  mockedCommissionBundleCiDetailPrivate,
  mockedCommissionBundleCiDetailPublic,
  mockedCommissionBundlePspDetailPrivate,
  mockedCommissionBundlePspDetailPublic,
} from '../../../../services/__mocks__/bundleService.ts';
import { store } from '../../../../redux/store.ts';
import { Provider } from 'react-redux';
import * as BundleService from '../../../../services/bundleService';
import { CIBundleResource } from '../../../../api/generated/portal/CIBundleResource.ts';

const spyOnCreateRequest = jest.spyOn(BundleService, 'createCIBundleRequest');
const spyOnAcceptOffer = jest.spyOn(BundleService, 'acceptPrivateBundleOffer');

const ComponentToRender = ({ bundle }: { bundle: CIBundleResource }) => {
  const dispatcher = useAppDispatch();
  dispatcher(bundlesActions.setBundleSelected(bundle));

  return (
    <MemoryRouter initialEntries={[`/comm-bundles/activate-bundle`]}>
      <Route path="/comm-bundles/:bundleId/">
        <CommissionBundleDetailActivationPage />
      </Route>
    </MemoryRouter>
  );
};

describe('<CommissionBundleDetailActivationPage />', () => {
  test('Render component', async () => {
    const amount = (mockedCommissionBundlePspDetailPublic.paymentAmount ?? 0) / 100;
    spyOnCreateRequest.mockReturnValueOnce(Promise.resolve());
    render(
      <Provider store={store}>
        <ComponentToRender bundle={mockedCommissionBundleCiDetailPublic} />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.queryAllByTestId('payment-amount-test').length).toBe(
        mockedCommissionBundlePspDetailPublic.bundleTaxonomies?.length
      );
    });

    const confirmButton = screen.getByTestId('open-modal-button-test');
    expect(confirmButton).toBeEnabled();

    const inputCommission = screen.queryAllByTestId('payment-amount-test')[0];

    fireEvent.change(inputCommission, {
      target: { value: `${amount + 1}` },
    });
    expect(confirmButton).toBeDisabled();

    fireEvent.change(inputCommission, { target: { value: '' } });
    expect(confirmButton).toBeEnabled();

    fireEvent.change(inputCommission, {
      target: { value: `${amount + 1}` },
    });
    expect(confirmButton).toBeDisabled();

    fireEvent.change(inputCommission, { target: { value: `${amount}` } });
    expect(confirmButton).toBeEnabled();

    fireEvent.change(inputCommission, {
      target: { value: `${amount + 1}` },
    });
    expect(confirmButton).toBeDisabled();

    fireEvent.change(inputCommission, {
      target: { value: `${amount}` },
    });
    expect(confirmButton).toBeEnabled();

    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(screen.queryByTestId('fade-test')).toBeInTheDocument();
    });

    const confirmModal = screen.getByTestId('confirm-button-test');
    fireEvent.click(confirmModal);

    await waitFor(() => {
      expect(spyOnCreateRequest).toBeCalled();
    });
  });
  test('Test createCIBundleRequest API error', async () => {
    spyOnCreateRequest.mockRejectedValueOnce('');
    render(
      <Provider store={store}>
        <ComponentToRender bundle={mockedCommissionBundleCiDetailPublic} />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.queryAllByTestId('payment-amount-test').length).toBe(
        mockedCommissionBundlePspDetailPublic.bundleTaxonomies?.length
      );
    });

    const confirmButton = screen.getByTestId('open-modal-button-test');
    expect(confirmButton).toBeEnabled();

    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(screen.queryByTestId('fade-test')).toBeInTheDocument();
    });

    const confirmModal = screen.getByTestId('confirm-button-test');
    fireEvent.click(confirmModal);

    await waitFor(() => {
      expect(spyOnCreateRequest).toBeCalled();
    });
  });
  test('Test acceptPrivateBundleOffer API error', async () => {
    spyOnAcceptOffer.mockRejectedValueOnce('');
    render(
      <Provider store={store}>
        <ComponentToRender bundle={mockedCommissionBundleCiDetailPrivate} />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.queryAllByTestId('payment-amount-test').length).toBe(
        mockedCommissionBundlePspDetailPrivate.bundleTaxonomies?.length
      );
    });

    const confirmButton = screen.getByTestId('open-modal-button-test');
    expect(confirmButton).toBeEnabled();

    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(screen.queryByTestId('fade-test')).toBeInTheDocument();
    });

    const confirmModal = screen.getByTestId('confirm-button-test');
    fireEvent.click(confirmModal);

    await waitFor(() => {
      expect(spyOnAcceptOffer).toBeCalled();
    });
  });
});
