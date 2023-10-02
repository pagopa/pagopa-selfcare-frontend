import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { store } from '../../../redux/store';
import { Provider } from 'react-redux';
import React from 'react';
import AddEditCommissionPackageForm from '../addEditCommissionPackage/components/AddEditCommissionPackageForm';
import { mockedTouchpoints } from '../../../services/__mocks__/commissionPackageService';

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
  const emptyDetailsComponentRender = () =>
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/comm-packages/add-package/`]}>
          <Route path="/comm-packages/add-package/">
            <ThemeProvider theme={theme}>
              <AddEditCommissionPackageForm commissionPackageDetails={{}} formAction={''} />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );

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
                  paymentType: undefined,
                  touchpoint: {
                    touchpointList: [mockedTouchpoints.touchpointList[0]],
                  },
                  transferCategoryList: [''],
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

  test('Test AddEditCommissionPackageForm with all input change', () => {
    const { ...input } = componentRender();
    const button = screen.getAllByTestId('ArrowDropDownIcon');

    expect(input.public.checked).toBe(false);
    expect(input.global.checked).toBe(false);

    fireEvent.click(input.global);

    expect(input.public.checked).toBe(false);
    expect(input.global.checked).toBe(true);

    fireEvent.change(input.name, { target: { value: 'prova' } });
    fireEvent.change(input.description, { target: { value: 'prova' } });

    const option1 = document.createElement('option');
    option1.value = 'Opzione 1';
    option1.text = 'Opzione 1';
    input.paymentType.appendChild(option1);

    fireEvent.mouseDown(button[0]);
    fireEvent.change(input.paymentType, { target: { value: 'Opzione 1' } });

    const option2 = document.createElement('option');
    option2.value = 'Opzione 2';
    option2.text = 'Opzione 2';
    input.touchpoint.appendChild(option2);

    fireEvent.mouseDown(button[1]);
    const option2ToSelect = screen.getByText('Opzione 2');
    fireEvent.change(input.touchpoint, { target: { value: option2ToSelect } });

    const transCategoryListFirst = screen.getByTestId(
      'transfer-category-list-test0'
    ) as HTMLInputElement;

    const option3 = document.createElement('option');
    option2.value = 'Opzione 3';
    option2.text = 'Opzione 3';
    transCategoryListFirst.appendChild(option3);

    fireEvent.mouseDown(button[2]);
    fireEvent.click(option3);

    fireEvent.click(input.addTaxnonomy);

    const transCategoryListSecond = screen.getByTestId(
      'transfer-category-list-test1'
    ) as HTMLInputElement;

    const option4 = document.createElement('option');
    option2.value = 'Opzione 4';
    option2.text = 'Opzione 4';
    transCategoryListSecond.appendChild(option4);

    fireEvent.mouseDown(button[3]);
    fireEvent.change(transCategoryListSecond, {
      target: { value: 'Opzione 4' },
    });

    const removePaymentMethod = screen.getByTestId('remove-payment-method1') as HTMLButtonElement;
    fireEvent.click(removePaymentMethod);

    fireEvent.change(input.minImport, { target: { value: 10 } });
    fireEvent.change(input.maxImport, { target: { value: 10 } });

    fireEvent.change(input.feeApplied, { target: { value: 10.76 } });

    fireEvent.click(input.channelList);
    fireEvent.change(input.channelList, { target: { value: '' } });

    fireEvent.click(input.channelList);

    const option5 = document.createElement('option');
    option2.value = 'Opzione 5';
    option2.text = 'Opzione 5';
    input.channelList.appendChild(option5);

    const closeIcon = screen.getByTestId('CloseIcon');
    fireEvent.mouseDown(closeIcon);

    fireEvent.mouseDown(input.channelList);

    const option5ToSelect = screen.getByText('Opzione 5');
    fireEvent.change(input.channelList, { target: { value: option5ToSelect } });

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

    fireEvent.change(input.fromDate, { target: { value: new Date('27/10/2028') } });
    fireEvent.change(input.ToDate, { target: { value: new Date('28/10/2028') } });

    fireEvent.submit(input.confirmBtn);

    fireEvent.click(input.cancelBtn);
  });

  it('Test fetch error getPaymentTypes', async () => {
    const mockError = new Error('API error message getPaymentTypes');
    spyOnGetPaymentTypes.mockRejectedValue(mockError);

    emptyDetailsComponentRender();

    await waitFor(() => {
      expect(spyOnGetPaymentTypes).toHaveBeenCalled();
    });
  });

  it('Test fetch error getTouchpoint', async () => {
    const mockError = new Error('API error message GetTouchpoint');
    spyOnGetTouchpoint.mockRejectedValue(mockError);

    emptyDetailsComponentRender();

    await waitFor(() => {
      expect(spyOnGetTouchpoint).toHaveBeenCalled();
    });
  });

  it('Test fetch error getTaxonomyService', async () => {
    const mockError = new Error('API error message GetTaxonomyService');
    spyOnGetTaxonomyService.mockRejectedValue(mockError);

    emptyDetailsComponentRender();

    await waitFor(() => {
      expect(spyOnGetTaxonomyService).toHaveBeenCalled();
    });
  });

  it('Test fetch error getChannelsIdAssociatedToPSP', async () => {
    const mockError = new Error('API error message GetChannelsIdAssociatedToPSP');
    spyOnGetChannelsIdAssociatedToPSP.mockRejectedValue(mockError);

    emptyDetailsComponentRender();

    await waitFor(() => {
      expect(spyOnGetChannelsIdAssociatedToPSP).toHaveBeenCalled();
    });
  });

  it('Il pulsante di invio è abilitato con i valori forniti', async () => {
    const mockError = new Error('API error message CreateCommissionPackage');
    spyOnCreateCommissionPackage.mockRejectedValue(mockError);

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
                  transferCategoryList: undefined,
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

    const digitalStampYes = screen
      .getByTestId('digital-stamp-test')
      .querySelector('[value="true"]') as HTMLInputElement;
    const digitalStampResYes = screen
      .getByTestId('digital-stamp-restriction-test')
      .querySelector('[value="true"]') as HTMLInputElement;

    fireEvent.click(digitalStampYes);
    fireEvent.click(digitalStampResYes);

    const submitButton = screen.getByTestId('confirm-button-test') as HTMLInputElement;
    fireEvent.click(submitButton);
    fireEvent.submit(submitButton);

    const backModalBtn = screen.getByText(
      'commissionPackagesPage.addEditCommissionPackage.modal.backButton'
    ) as HTMLInputElement;
    const confirmModalBtn = screen.getByText(
      'commissionPackagesPage.addEditCommissionPackage.modal.confirmButton'
    ) as HTMLInputElement;
    fireEvent.click(backModalBtn);
    fireEvent.click(submitButton);
    fireEvent.click(confirmModalBtn);
  });

  test('Test AddEditCommissionPackageForm with all input change', () => {
    const { ...input } = componentRender();
    fireEvent.click(input.confirmBtn);
  });
});
