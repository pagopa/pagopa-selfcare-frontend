import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { store } from '../../../../redux/store';
import { Provider } from 'react-redux';
import React from 'react';
import AddEditCommissionPackageForm from '../../addEditCommissionPackage/components/AddEditCommissionPackageForm';
import { mockedTouchpoints } from '../../../../services/__mocks__/bundleService';
import { partiesActions } from '../../../../redux/slices/partiesSlice';
import { pspOperatorSignedDirect } from '../../../../services/__mocks__/partyService';
import { Bundle, TypeEnum } from '../../../../api/generated/portal/Bundle';
import renderer from 'react-test-renderer';

let spyOnGetPaymentTypes: jest.SpyInstance<any, unknown[]>;
let spyOnGetTouchpoint: jest.SpyInstance<any, unknown[]>;
let spyOnGetTaxonomyService: jest.SpyInstance<any, unknown[]>;
let spyOnCreateCommissionPackage: jest.SpyInstance<any, unknown[]>;

beforeEach(() => {
  spyOnGetPaymentTypes = jest.spyOn(
    require('../../../../services/__mocks__/configurationService'),
    'getPaymentTypes'
  );
  spyOnGetTouchpoint = jest.spyOn(
    require('../../../../services/__mocks__/bundleService'),
    'getTouchpoints'
  );
  spyOnGetTaxonomyService = jest.spyOn(
    require('../../../../services/__mocks__/taxonomyService'),
    'getTaxonomies'
  );
  spyOnCreateCommissionPackage = jest.spyOn(
    require('../../../../services/__mocks__/bundleService'),
    'createCommissionPackage'
  );
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

describe('<AddEditCommissionPackageForm />', () => {
  const commissionPackageDetailsMocked: Bundle = {
    description: 'Pacchetti commissione',
    maxPaymentAmount: 1500,
    minPaymentAmount: 150,
    name: 'Pacchetto 1',
    paymentAmount: 10,
    paymentType: undefined,
    touchpoint: mockedTouchpoints.touchpoints![0].name,
    transferCategoryList: ['100 - Rendite catastali (ICI, IMU, TUC, ecc.)'],
    type: TypeEnum.GLOBAL,
    validityDateFrom: new Date(2050, 9, 27),
    validityDateTo: new Date(2050, 9, 27),
  };

  const componentRender = (commPackageDetails?: Bundle) => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/comm-packages/add-package/`]}>
          <Route path="/comm-packages/add-package/">
            <ThemeProvider theme={theme}>
              <AddEditCommissionPackageForm commPackageDetails={commPackageDetails} />
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
      addTaxonomy: screen.getByTestId('add-taxonomy-test') as HTMLInputElement,
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
      tranferCategoryList: screen.getAllByTestId(
        'transfer-category-list-test'
      ) as HTMLInputElement[],
      confirmBtn: screen.getByTestId('confirm-button-test') as HTMLInputElement,
      cancelBtn: screen.getByTestId('cancel-button-test') as HTMLInputElement,
    };

    return input;
  };

  test('match the snapshot', async () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <MemoryRouter initialEntries={[`/comm-packages/add-package/`]}>
            <Route path="/comm-packages/add-package/">
              <ThemeProvider theme={theme}>
                <AddEditCommissionPackageForm commPackageDetails={commissionPackageDetailsMocked} />
              </ThemeProvider>
            </Route>
          </MemoryRouter>
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('Test AddEditCommissionPackageForm with all input change', async () => {
    const { ...input } = componentRender();
    await waitFor(() => store.dispatch(partiesActions.setPartySelected(pspOperatorSignedDirect)));

    const changeChannelId = () => {
      fireEvent.mouseDown(input.channelList);
      fireEvent.select(input.channelList, { target: { value: '97735020584_01' } });
      expect(input.channelList.value).toBe('97735020584_01');
    };

    expect(input.public.checked).toBe(false);
    expect(input.global.checked).toBe(false);

    fireEvent.click(input.global);

    expect(input.public.checked).toBe(false);
    expect(input.global.checked).toBe(true);

    fireEvent.change(input.name, { target: { value: 'prova' } });
    fireEvent.change(input.description, { target: { value: 'prova' } });

    // Change paymentType

    await waitFor(() => {
      expect(spyOnGetPaymentTypes).toHaveBeenCalled();
    });

    // const selectPaymentTypeBtn = await within(input.paymentType).getByRole('button');
    // await waitFor(() => fireEvent.mouseDown(selectPaymentTypeBtn));
    // await waitFor(() => screen.getByText(new RegExp('.*Bonifico - SEPA.*', 'i')));

    // waitFor(() => fireEvent.click(screen.getByText(new RegExp('.*Bonifico - SEPA.*', 'i'))));

    // expect(selectPaymentTypeBtn.textContent).toBe('Bonifico - SEPA');

    // Change touchpoint

    await waitFor(() => {
      expect(spyOnGetTouchpoint).toHaveBeenCalled();
    });
    // const selectTouchPointBtn = await within(input.touchpoint).getByRole('button');
    // await waitFor(() => fireEvent.mouseDown(selectTouchPointBtn));
    // await waitFor(() => screen.getByText(new RegExp('Tutti', 'i')));

    // waitFor(() => fireEvent.click(screen.getByText(new RegExp('Tutti', 'i'))));

    // expect(selectTouchPointBtn.textContent).toBe('Tutti');

    // change taxonomy service

    await waitFor(() => {
      expect(spyOnGetTaxonomyService).toHaveBeenCalled();
    });

    // const selectTransCategoryListFirstBtn = await within(input.tranferCategoryList[0]).getByRole(
    //   'button'
    // );
    // await waitFor(() => fireEvent.mouseDown(selectTransCategoryListFirstBtn));

    // await waitFor(() => screen.getByText(new RegExp('.*Rendite catastali.*', 'i')));

    // waitFor(() => fireEvent.click(screen.getByText(new RegExp('Rendite catastali', 'i'))));

    // expect(selectTransCategoryListFirstBtn.textContent).toBe(
    //   '100 - Rendite catastali (ICI, IMU, TUC, ecc.)'
    // );

    // fireEvent.click(input.addTaxonomy);

    // const removePaymentMethod = screen.getByTestId('remove-payment-method1') as HTMLButtonElement;
    // fireEvent.click(removePaymentMethod);

    // change input number

    fireEvent.change(input.minImport, { target: { value: 10 } });
    expect(parseFloat(input.minImport.value)).toBe(10);
    fireEvent.change(input.maxImport, { target: { value: 10 } });
    expect(parseFloat(input.maxImport.value)).toBe(10);

    fireEvent.change(input.feeApplied, { target: { value: '10,8' } });
    expect(input.feeApplied.value).toBe('10,8');

    fireEvent.change(input.feeApplied, { target: { value: 10.8 } });
    expect(input.feeApplied.value).toBe('10,8');

    // change channel id

    // changeChannelId();

    // const closeIcon = screen.getByTestId('CloseIcon');
    // fireEvent.click(closeIcon);

    // expect(input.channelList.value).toBe('');

    changeChannelId();

    // change radio buttons

    expect(input.digitalStampYes.checked).toBe(false);
    expect(input.digitalStampNo.checked).toBe(true);

    fireEvent.click(input.digitalStampYes);

    expect(input.digitalStampYes.checked).toBe(true);
    expect(input.digitalStampNo.checked).toBe(false);

    expect(input.digitalStampResYes.checked).toBe(false);
    expect(input.digitalStampResNo.checked).toBe(true);

    fireEvent.click(input.digitalStampResYes);

    expect(input.digitalStampResYes.checked).toBe(true);
    expect(input.digitalStampResNo.checked).toBe(false);

    //change dates

    const formatDate = (date: Date) => {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };

    const fromDate = new Date(2028, 9, 27);
    const toDate = new Date(2028, 9, 28);

    fireEvent.change(input.fromDate, { target: { value: formatDate(fromDate) } });
    expect(input.fromDate.value).toBe('27/10/2028');

    fireEvent.change(input.ToDate, { target: { value: formatDate(toDate) } });
    expect(input.ToDate.value).toBe('28/10/2028');

    fireEvent.submit(input.confirmBtn);
    fireEvent.click(input.cancelBtn);
  });

  test('Test fetch error getPaymentTypes', async () => {
    const mockError = new Error('API error message getPaymentTypes');
    spyOnGetPaymentTypes.mockRejectedValue(mockError);

    componentRender();

    await waitFor(() => {
      expect(spyOnGetPaymentTypes).toHaveBeenCalled();
    });
  });

  test('Test fetch error getTouchpoint', async () => {
    const mockError = new Error('API error message GetTouchpoint');
    spyOnGetTouchpoint.mockRejectedValue(mockError);

    componentRender();

    await waitFor(() => {
      expect(spyOnGetTouchpoint).toHaveBeenCalled();
    });
  });

  test('Test fetch error getTaxonomyService', async () => {
    const mockError = new Error('API error message GetTaxonomyService');
    spyOnGetTaxonomyService.mockRejectedValue(mockError);

    componentRender();

    await waitFor(() => {
      expect(spyOnGetTaxonomyService).toHaveBeenCalled();
    });
  });
});