import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import CommissionBundleDetailOffersAddRecipientsPage from '../CommissionBundleDetailOffersAddRecipientsPage.tsx';
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { useAppDispatch } from '../../../../redux/hooks.ts';
import { bundleDetailsActions } from '../../../../redux/slices/bundleDetailsSlice.ts';
import { mockedCommissionBundlePspDetailPrivate } from '../../../../services/__mocks__/bundleService.ts';
import { store } from '../../../../redux/store.ts';
import { Provider } from 'react-redux';
import * as BundleService from '../../../../services/bundleService';
import * as CIService from '../../../../services/creditorInstitutionService.ts';
import { mockedCreditorInstitutionsResource } from '../../../../services/__mocks__/creditorInstitutionService.ts';

const spyOnGetCreditorInstitutions = jest.spyOn(CIService, 'getCreditorInstitutions');
const spyOnGetAddRecipients = jest.spyOn(BundleService, 'createCIBundleOffers');

const ComponentToRender = () => {
  const dispatcher = useAppDispatch();
  dispatcher(bundleDetailsActions.setBundleDetailsState(mockedCommissionBundlePspDetailPrivate));

  return (
    <MemoryRouter initialEntries={[`/comm-bundles/activate-bundle`]}>
      <Route path="/comm-bundles/:bundleId/">
        <CommissionBundleDetailOffersAddRecipientsPage />
      </Route>
    </MemoryRouter>
  );
};
describe('<CommissionBundleDetailOffersAddRecipientsPage />', () => {
  test('Render component', async () => {

    spyOnGetCreditorInstitutions.mockResolvedValue(mockedCreditorInstitutionsResource);
    render(
      <Provider store={store}>
        <ComponentToRender />
      </Provider>
    );

    await waitFor(() => {
      expect(spyOnGetCreditorInstitutions).toBeCalled();
    });

    const confirmButton = screen.getByTestId('open-modal-button-test');
    expect(confirmButton).toBeDisabled();

    expect(screen.queryByTestId("add-recipients-button")).not.toBeInTheDocument();

    let ecAutocomplete = screen.getByTestId('ec-selection-id-test');
    let ecSelectionSearch = within(ecAutocomplete).getByRole("combobox");

    ecAutocomplete.focus();
    fireEvent.change(ecSelectionSearch as Element, {
        target: { value: mockedCreditorInstitutionsResource.creditor_institutions![0].businessName },
    });
    await waitFor(() => {
        expect(screen.queryByText(mockedCreditorInstitutionsResource.creditor_institutions![0].businessName)).toBeInTheDocument();
    })
    fireEvent.keyDown(ecAutocomplete as Element, { key: 'ArrowDown' });
    fireEvent.keyDown(ecAutocomplete as Element, { key: 'Enter' });

    await waitFor(() => {
        expect(screen.queryAllByTestId("selected-recipients").length).toBe(1);
    })

    expect(confirmButton).toBeEnabled();
    expect(screen.queryByTestId("add-recipients-button")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("remove-selected-ec-btn-id-test"));

    await waitFor(() => {
        expect(screen.queryAllByTestId("selected-recipients").length).toBe(0);
    })
    expect(screen.queryByTestId("add-recipients-button")).not.toBeInTheDocument();

    expect(confirmButton).toBeDisabled();

    ecAutocomplete = screen.getByTestId('ec-selection-id-test');
    ecSelectionSearch = within(ecAutocomplete).getByRole("combobox");
    ecAutocomplete.focus();
    fireEvent.change(ecSelectionSearch as Element, {
        target: { value: mockedCreditorInstitutionsResource.creditor_institutions![0].businessName },
    });
    await waitFor(() => {
        expect(screen.queryByText(mockedCreditorInstitutionsResource.creditor_institutions![0].businessName)).toBeInTheDocument();
    })
    fireEvent.keyDown(ecAutocomplete as Element, { key: 'ArrowDown' });
    fireEvent.keyDown(ecAutocomplete as Element, { key: 'Enter' });

    fireEvent.click(screen.getByTestId("add-recipients-button"));

    await waitFor(() => {
        ecAutocomplete = screen.getByTestId('ec-selection-id-test');
        ecSelectionSearch = within(ecAutocomplete).getByRole("combobox");
    })
    ecAutocomplete.focus();
    fireEvent.change(ecSelectionSearch as Element, {
        target: { value: mockedCreditorInstitutionsResource.creditor_institutions![1].businessName },
    });
    await waitFor(() => {
        expect(screen.queryByText(mockedCreditorInstitutionsResource.creditor_institutions![1].businessName)).toBeInTheDocument();
    })
    fireEvent.keyDown(ecAutocomplete as Element, { key: 'ArrowDown' });
    fireEvent.keyDown(ecAutocomplete as Element, { key: 'ArrowDown' });
    fireEvent.keyDown(ecAutocomplete as Element, { key: 'Enter' });

    await waitFor(() => {
        expect(screen.queryAllByTestId("selected-recipients").length).toBe(2);
    })

    expect(confirmButton).toBeEnabled();

    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(screen.queryByTestId('fade-test')).toBeInTheDocument();
    });

    spyOnGetAddRecipients.mockResolvedValueOnce();
    const confirmModal = screen.getByTestId('confirm-button-test');
    fireEvent.click(confirmModal);

    await waitFor(() => {
      expect(spyOnGetAddRecipients).toBeCalled();
    });
  });
  test('Test getCreditorInstitutions API error', async () => {
    spyOnGetCreditorInstitutions.mockRejectedValueOnce('');
    render(
      <Provider store={store}>
        <ComponentToRender />
      </Provider>
    );

    const confirmButton = screen.getByTestId('open-modal-button-test');
    expect(confirmButton).toBeDisabled();
  });
  test('Test createCIBundleOffers API error', async () => {

    spyOnGetCreditorInstitutions.mockResolvedValue(mockedCreditorInstitutionsResource);
    render(
      <Provider store={store}>
        <ComponentToRender />
      </Provider>
    );

    await waitFor(() => {
      expect(spyOnGetCreditorInstitutions).toBeCalled();
    });

    const confirmButton = screen.getByTestId('open-modal-button-test');
    expect(confirmButton).toBeDisabled();

    expect(screen.queryByTestId("add-recipients-button")).not.toBeInTheDocument();

    let ecAutocomplete = screen.getByTestId('ec-selection-id-test');
    let ecSelectionSearch = within(ecAutocomplete).getByRole("combobox");

    ecAutocomplete.focus();
    fireEvent.change(ecSelectionSearch as Element, {
        target: { value: mockedCreditorInstitutionsResource.creditor_institutions![0].businessName },
    });
    await waitFor(() => {
        expect(screen.queryByText(mockedCreditorInstitutionsResource.creditor_institutions![0].businessName)).toBeInTheDocument();
    })
    fireEvent.keyDown(ecAutocomplete as Element, { key: 'ArrowDown' });
    fireEvent.keyDown(ecAutocomplete as Element, { key: 'Enter' });

    await waitFor(() => {
        expect(screen.queryAllByTestId("selected-recipients").length).toBe(1);
    })

    expect(confirmButton).toBeEnabled();

    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(screen.queryByTestId('fade-test')).toBeInTheDocument();
    });

    spyOnGetAddRecipients.mockRejectedValueOnce("");
    const confirmModal = screen.getByTestId('confirm-button-test');
    fireEvent.click(confirmModal);

    await waitFor(() => {
      expect(spyOnGetAddRecipients).toBeCalled();
    });
  });
});
