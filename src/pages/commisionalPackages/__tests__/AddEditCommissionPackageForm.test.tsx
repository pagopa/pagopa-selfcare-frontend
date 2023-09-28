import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { store } from '../../../redux/store';
import { Provider } from 'react-redux';
import React from 'react';
import AddEditCommissionPackageForm from '../addEditCommissionPackage/components/AddEditCommissionPackageForm';
import { mockedTouchpoints } from '../../../services/__mocks__/commissionPackageService';
import { mockedPaymentTypes } from '../../../services/__mocks__/channelService';

let spyOnGetPaymentTypes;
let spyOnGetTouchpoint;
let spyOnGetTaxonomyService;
let spyOnGetChannelsIdAssociatedToPSP;
let spyOnCreateCommissionPackage;

beforeEach(() => {
  spyOnGetPaymentTypes = jest.spyOn(
    require('../../../services/__mocks__/commissionPackageService'),
    'getPaymentTypes'
  );
  spyOnGetTouchpoint = jest.spyOn(
    require('../../../services/__mocks__/commissionPackageService'),
    'getTouchpoint'
  );
  spyOnGetTaxonomyService = jest.spyOn(
    require('../../../services/__mocks__/commissionPackageService'),
    'getTaxonomyService'
  );
  spyOnGetChannelsIdAssociatedToPSP = jest.spyOn(
    require('../../../services/commissionPackageService.ts'),
    'getChannelsIdAssociatedToPSP'
  );

  spyOnCreateCommissionPackage = jest.spyOn(
    require('../../../services/__mocks__/commissionPackageService'),
    'createCommissionPackage'
  );
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
                commissionPackageDetails={{
                  abi: '',
                  description: 'Pacchetti commissione',
                  digitalStamp: true,
                  digitalStampRestriction: false,
                  idBrokerPsp: '',
                  idCdi: '',
                  idChannel: '97735020584_01',
                  maxPaymentAmount: 1500,
                  minPaymentAmount: 150,
                  name: 'Pacchetto 1',
                  paymentAmount: 10,
                  paymentType: mockedPaymentTypes.payment_types[0],
                  touchpoint: mockedTouchpoints,
                  transferCategoryList: ['100 - Rendite catastali (ICI, IMU, TUC, ecc.) '],
                  type: 'GLOBAL',
                  validityDateFrom: new Date('23/10/2050'),
                  validityDateTo: new Date('23/10/2050'),
                }}
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
      channelList: screen
        .getByTestId('channels-id-test')
        .querySelector('input') as HTMLInputElement,
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

  test('Test AddEditCommissionPackageForm input change', () => {
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

    const transCategoryListFirst = screen.getByTestId(
      'transfer-category-list-test0'
    ) as HTMLInputElement;
    fireEvent.change(transCategoryListFirst, {
      target: { value: mockedPaymentTypes.payment_types[1] },
    });

    fireEvent.click(input.addTaxnonomy);

    const transCategoryListSecond = screen.getByTestId(
      'transfer-category-list-test1'
    ) as HTMLInputElement;

    fireEvent.change(transCategoryListSecond, {
      target: { value: mockedPaymentTypes.payment_types[1] },
    });

    const removePaymentMethod = screen.getByTestId('remove-payment-method1') as HTMLButtonElement;
    fireEvent.click(removePaymentMethod);

    fireEvent.change(input.minImport, { target: { value: 10 } });
    fireEvent.change(input.maxImport, { target: { value: 10 } });

    fireEvent.change(input.feeApplied, { target: { value: 10.76 } });

    fireEvent.click(input.channelList);
    fireEvent.change(input.channelList, { target: { value: '' } });

    fireEvent.click(input.channelList);
    const optionToSelect = '97735020584_01';
    fireEvent.change(input.channelList, { target: { value: optionToSelect } });

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

    fireEvent.change(input.fromDate, { target: { value: new Date('2023-10-27') } });
    fireEvent.change(input.ToDate, { target: { value: new Date('2023-10-28') } });

    fireEvent.click(input.confirmBtn);
    fireEvent.submit(input.confirmBtn);

    fireEvent.click(input.cancelBtn);
  });

  it('Test fetch error getPaymentTypes', async () => {
    const mockError = new Error('API error message getPaymentTypes');
    spyOnGetPaymentTypes.mockRejectedValue(mockError);

    componentRender();

    await waitFor(() => {
      expect(spyOnGetPaymentTypes).toHaveBeenCalled();
    });
  });

  it('Test fetch error getTouchpoint', async () => {
    const mockError = new Error('API error message GetTouchpoint');
    spyOnGetTouchpoint.mockRejectedValue(mockError);

    componentRender();

    await waitFor(() => {
      expect(spyOnGetTouchpoint).toHaveBeenCalled();
    });
  });

  it('Test fetch error getTaxonomyService', async () => {
    const mockError = new Error('API error message GetTaxonomyService');
    spyOnGetTaxonomyService.mockRejectedValue(mockError);

    componentRender();

    await waitFor(() => {
      expect(spyOnGetTaxonomyService).toHaveBeenCalled();
    });
  });

  it('Test fetch error getChannelsIdAssociatedToPSP', async () => {
    const mockError = new Error('API error message GetChannelsIdAssociatedToPSP');
    spyOnGetChannelsIdAssociatedToPSP.mockRejectedValue(mockError);

    componentRender();

    await waitFor(() => {
      expect(spyOnGetChannelsIdAssociatedToPSP).toHaveBeenCalled();
    });
  });

  it('Test the opening of the modal and then the submit of the form', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/comm-packages/add-package/`]}>
          <Route path="/comm-packages/add-package/">
            <ThemeProvider theme={theme}>
              <AddEditCommissionPackageForm
                commissionPackageDetails={{
                  abi: '',
                  description: 'momom',
                  digitalStamp: true,
                  digitalStampRestriction: false,
                  idBrokerPsp: '',
                  idCdi: '',
                  idChannel: '14847241008_14',
                  maxPaymentAmount: 33333,
                  minPaymentAmount: 233,
                  name: '22222',
                  paymentAmount: 32,
                  paymentType: undefined,
                  touchpoint: undefined,
                  transferCategoryList: [''],
                  type: 'PRIVATE',
                  validityDateFrom: new Date('30/10/2060'),
                  validityDateTo: new Date('30/10/2080'),
                }}
                formAction={''}
              />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );

    const confirmBtn = screen.getByTestId('confirm-button-test') as HTMLButtonElement;

    const checkDisabledAttributeValue = confirmBtn.getAttribute('disabled'); // element.hasAttribute("disabled")
    expect(checkDisabledAttributeValue).toBe('');

    fireEvent.submit(confirmBtn);
  });
});
