import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route } from 'react-router-dom';
import { store } from '../../../redux/store';
import { Provider } from 'react-redux';
import React from 'react';
import AddEditCommissionPackageForm from '../addEditCommissionPackage/components/AddEditCommissionPackageForm';
import {
  mockedChannelsIdList,
  mockedCommissionPackagePspDetail,
  mockedTouchpoints,
} from '../../../services/__mocks__/commissionPackageService';
import { mockedPaymentTypes } from '../../../services/__mocks__/channelService';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

describe('<AddEditCommissionPackageForm />', () => {
  const componentRender = () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/comm-packages/add-package/`]}>
          <Route path="/comm-packages/add-package/">
            <ThemeProvider theme={theme}>
              <AddEditCommissionPackageForm
                commissionPackageDetails={mockedCommissionPackagePspDetail}
                formAction={''}
              />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );

    const input = {
      public: screen
        .getByTestId('package-type-test')
        .querySelector('[value="PUBLIC"]') as HTMLInputElement,
      global: screen
        .getByTestId('package-type-test')
        .querySelector('[value="GLOBAL"]') as HTMLInputElement,
      name: screen.getByTestId('name-test') as HTMLInputElement,
      description: screen.getByTestId('description-test') as HTMLInputElement,
      paymentType: screen.getByTestId('payment-type-test') as HTMLInputElement,
      touchpoint: screen.getByTestId('touchpoint-test') as HTMLInputElement,
      addTaxnonomy: screen.getByTestId('add-taxonomy-test') as HTMLInputElement,
      minImport: screen.getByTestId('min-import-test') as HTMLInputElement,
      maxImport: screen.getByTestId('max-import-test') as HTMLInputElement,
      feeApplied: screen.getByTestId('payment-amount-test') as HTMLInputElement,
      channelList: screen.getByTestId('id-channel-test') as HTMLInputElement,
      digitalStampYes: screen
        .getByTestId('digital-stamp-test')
        .querySelector('[value="true"]') as HTMLInputElement,
      digitalStampNo: screen
        .getByTestId('digital-stamp-test')
        .querySelector('[value="false"]') as HTMLInputElement,
      digitalStampResYes: screen
        .getByTestId('digital-stamp-restriction-test')
        .querySelector('[value="true"]') as HTMLInputElement,
      digitalStampResNo: screen
        .getByTestId('digital-stamp-restriction-test')
        .querySelector('[value="false"]') as HTMLInputElement,
      digitalStampRes: screen.getByTestId('digital-stamp-restriction-test') as HTMLInputElement,
      fromDate: screen.getByTestId('from-date-test') as HTMLInputElement,
      ToDate: screen.getByTestId('to-date-test') as HTMLInputElement,
      confirmBtn: screen.getByTestId('confirm-button-test') as HTMLInputElement,
      cancelBtn: screen.getByTestId('cancel-button-test') as HTMLInputElement,
    };

    return input;
  };

  test('Test AddEditCommissionPackageForm input change', async () => {
    const { ...input } = componentRender();
    const paymentTypeOptionText = `${mockedPaymentTypes.payment_types[1].description} - ${mockedPaymentTypes.payment_types[1].payment_type}`;

    expect(input.public.checked).toBe(false);
    expect(input.global.checked).toBe(false);

    fireEvent.click(input.global);

    expect(input.public.checked).toBe(false);
    expect(input.global.checked).toBe(true);

    fireEvent.change(input.name, { target: { value: 'prova' } });
    fireEvent.change(input.description, { target: { value: 'prova' } });

    fireEvent.change(input.paymentType, { target: { value: paymentTypeOptionText } });

    fireEvent.change(input.touchpoint, { target: { value: mockedTouchpoints.touchpointList[1] } });

    await waitFor(() => {
      const transCategoryList = screen.getAllByTestId(
        'transfer-category-list-test'
      ) as HTMLInputElement[];
      fireEvent.change(transCategoryList[0], {
        target: { value: mockedPaymentTypes.payment_types[1] },
      });

      fireEvent.click(input.addTaxnonomy);

      fireEvent.change(transCategoryList[1], {
        target: { value: mockedPaymentTypes.payment_types[1] },
      });

      const removePaymentMethod = screen.getAllByTestId(
        'remove-payment-method'
      ) as HTMLButtonElement[];
      fireEvent.click(removePaymentMethod[1]);
    });

    fireEvent.change(input.minImport, { target: { value: 10 } });
    fireEvent.change(input.maxImport, { target: { value: 10 } });

    fireEvent.change(input.feeApplied, { target: { value: 10 } });
    fireEvent.change(input.feeApplied, { target: { value: 'abc' } });

    fireEvent.change(input.channelList, { target: { value: mockedChannelsIdList[0] } });

    expect(input.digitalStampYes.checked).toBe(false);
    expect(input.digitalStampNo.checked).toBe(false);

    fireEvent.click(input.digitalStampYes);

    expect(input.digitalStampYes.checked).toBe(true);
    expect(input.digitalStampNo.checked).toBe(false);

    expect(input.digitalStampResYes.checked).toBe(false);
    expect(input.digitalStampResNo.checked).toBe(false);

    fireEvent.click(input.digitalStampResYes);

    expect(input.digitalStampResYes.checked).toBe(true);
    expect(input.digitalStampResNo.checked).toBe(false);

    fireEvent.change(input.fromDate, { target: { value: '2023-10-27' } });
    fireEvent.change(input.ToDate, { target: { value: '2023-10-28' } });

    fireEvent.click(input.cancelBtn);

    fireEvent.click(input.confirmBtn);
    fireEvent.submit(input.confirmBtn);
  });
});
