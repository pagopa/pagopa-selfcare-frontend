import {ThemeProvider} from '@mui/system';
import {theme} from '@pagopa/mui-italia';
import {cleanup, fireEvent, render, screen, waitFor, within} from '@testing-library/react';
import {MemoryRouter, Route} from 'react-router-dom';
import {createStore, store} from '../../../../../redux/store';
import {Provider} from 'react-redux';
import React from 'react';
import {mockedBundleRequest, mockedChannelsIdList,} from '../../../../../services/__mocks__/bundleService';
import {partiesActions} from '../../../../../redux/slices/partiesSlice';
import {pspOperatorSignedDirect} from '../../../../../services/__mocks__/partyService';
import {TypeEnum} from '../../../../../api/generated/portal/BundleResource';
import AddEditCommissionBundleForm from '../AddEditCommissionBundleForm';
import {useFormik} from 'formik';
import {BundleRequest} from '../../../../../api/generated/portal/BundleRequest';
import {FormAction} from '../../../../../model/CommissionBundle';
import {mockedDelegatedPSP} from '../../../../../services/__mocks__/institutionsService';
import {formatDateToDDMMYYYY} from '../../../../../utils/common-utils';
import * as useErrorDispatcher from '@pagopa/selfcare-common-frontend';
import * as useFeatureFlags from "../../../../../hooks/useFeatureFlags";
import * as useUserRole from "../../../../../hooks/useUserRole";
import {ROLE} from "../../../../../model/RolePermission";


let spyOnGetPaymentTypes: jest.SpyInstance<any, unknown[]>;
let spyOnGetTouchpoint: jest.SpyInstance<any, unknown[]>;
let spyOnGetInstitutionService: jest.SpyInstance<any, unknown[]>;
let spyOnCreateCommissionBundle: jest.SpyInstance<any, unknown[]>;
let spyOnGetChannelService: jest.SpyInstance<any, unknown[]>;
let spyOnErrorHook: jest.SpyInstance<any, unknown[]>;
let spyOnUseFlagValue: jest.SpyInstance<boolean, string[]>;

const TestAddEditCommissionBundleForm = ({
                                             formAction,
                                             initialValues,
                                             injectedStore,
                                         }: {
    formAction: string;
    initialValues?: BundleRequest;
    injectedStore?: ReturnType<typeof createStore>;
}) => {
    const formik = useFormik<Partial<BundleRequest>>({
        initialValues: initialValues ?? {},
        onSubmit: async () => jest.fn(),
        enableReinitialize: true,
        validateOnBlur: true,
        validateOnChange: true,
    });
    return (
        <Provider store={injectedStore ?? store}>
            <MemoryRouter initialEntries={[`/comm-bundles/add-bundle/`]}>
                <Route path="/comm-bundles/add-bundle/">
                    <ThemeProvider theme={theme}>
                        <AddEditCommissionBundleForm
                            formik={formik}
                            isEdit={formAction === FormAction.Edit}
                            idBrokerPsp={initialValues?.idBrokerPsp}
                        />
                    </ThemeProvider>
                </Route>
            </MemoryRouter>
        </Provider>
    );
};

const bundleName = 'bundleName';
const bundleDescription = 'description';

describe('<AddEditCommissionBundleForm />', () => {
    beforeEach(() => {
        spyOnGetPaymentTypes = jest.spyOn(
            require('../../../../../services/configurationService'),
            'getPaymentTypes'
        );
        spyOnGetTouchpoint = jest.spyOn(
            require('../../../../../services/bundleService'),
            'getTouchpoints'
        );
        spyOnGetInstitutionService = jest.spyOn(
            require('../../../../../services/institutionService'),
            'getBrokerDelegation'
        );
        spyOnCreateCommissionBundle = jest.spyOn(
            require('../../../../../services/bundleService'),
            'createBundle'
        );
        spyOnGetChannelService = jest.spyOn(
            require('../../../../../services/channelService'),
            'getChannelsIdAssociatedToPSP'
        );
        spyOnErrorHook = jest
            .spyOn(useErrorDispatcher, 'useErrorDispatcher')
            .mockReturnValue(jest.fn());
        spyOnUseFlagValue = jest.spyOn(useFeatureFlags, 'useFlagValue');
        jest.mock('../../../../../hooks/useUserRole');
        jest.spyOn(useUserRole, 'useUserRole').mockReturnValue({
            userRole: ROLE.PSP_ADMIN,
            userIsPspAdmin: true,
            userIsEcAdmin: false,
            userIsPspDirectAdmin: false,
            userIsOperator: false,
            userIsAdmin: false,
        });
        jest.spyOn(console, 'error').mockImplementation(() => {
        });
        jest.spyOn(console, 'warn').mockImplementation(() => {
        });
    });

    afterEach(() => {
        cleanup();
        spyOnGetPaymentTypes.mockRestore();
        spyOnGetTouchpoint.mockRestore();
        spyOnGetInstitutionService.mockRestore();
        spyOnCreateCommissionBundle.mockRestore();
        spyOnGetChannelService.mockRestore();
        spyOnErrorHook.mockRestore();
    });

    const componentRender = (
        formAction: string,
        initialValues?: BundleRequest,
        injectedStore?: ReturnType<typeof createStore>
    ) => {
        render(
            <TestAddEditCommissionBundleForm
                formAction={formAction}
                initialValues={initialValues}
                injectedStore={injectedStore}
            />
        );

        const input = {
            public: screen
                .getByTestId('bundle-type-test')
                .querySelector(`[value=${TypeEnum.PUBLIC}]`) as HTMLInputElement,
            global: screen
                .getByTestId('bundle-type-test')
                .querySelector(`[value=${TypeEnum.GLOBAL}]`) as HTMLInputElement,
            private: screen
                .getByTestId('bundle-type-test')
                .querySelector(`[value=${TypeEnum.PRIVATE}]`) as HTMLInputElement,
            name: screen.getByTestId('name-test') as HTMLInputElement,
            description: screen.getByTestId('description-test') as HTMLInputElement,
            paymentType: screen.getByTestId('payment-type-test') as HTMLInputElement,
            touchpoint: screen.getByTestId('touchpoint-test') as HTMLInputElement,
            minImport: screen.getByTestId('min-import-test') as HTMLInputElement,
            maxImport: screen.getByTestId('max-import-test') as HTMLInputElement,
            feeApplied: screen.getByTestId('payment-amount-test') as HTMLInputElement,
            brokerCodeList: screen
                .getByTestId('broker-code-test')
                .querySelector('input') as HTMLInputElement,
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
            fromDate: screen.getByTestId('from-date-test') as HTMLInputElement,
            ToDate: screen.getByTestId('to-date-test') as HTMLInputElement,
        };

        return input;
    };

    test('Test AddEditCommissionBundleForm with all input change in CREATE', async () => {
        const injectStore = createStore();
        spyOnUseFlagValue.mockReturnValue(true);
        await waitFor(() =>
            injectStore.dispatch(partiesActions.setPartySelected(pspOperatorSignedDirect))
        );
        const {...input} = componentRender(FormAction.Create, undefined, injectStore);
        await waitFor(() => {
            expect(spyOnGetPaymentTypes).toHaveBeenCalled();
            expect(spyOnGetTouchpoint).toHaveBeenCalled();
            expect(spyOnGetInstitutionService).toHaveBeenCalled();
            expect(spyOnGetChannelService).not.toHaveBeenCalled();
        });

        //Change radio group bundle type
        expect(input.public.checked).toBe(false);
        expect(input.global.checked).toBe(false);
        expect(input.private.checked).toBe(false);

        fireEvent.click(input.global);
        expect(input.public.checked).toBe(false);
        expect(input.global.checked).toBe(true);
        expect(input.private.checked).toBe(false);

        fireEvent.click(input.public);
        expect(input.public.checked).toBe(true);
        expect(input.global.checked).toBe(false);
        expect(input.private.checked).toBe(false);

        fireEvent.click(input.private);
        expect(input.public.checked).toBe(false);
        expect(input.global.checked).toBe(false);
        expect(input.private.checked).toBe(true);

        // Change input name & description
        fireEvent.change(input.name, {target: {value: bundleName}});
        expect(input.name.value).toBe(bundleName);
        fireEvent.change(input.description, {target: {value: bundleDescription}});
        expect(input.description.value).toBe(bundleDescription);

        // Change paymentType
        const selectPaymentTypeBtn = await within(input.paymentType).getByRole('button');
        await waitFor(() => {
            fireEvent.mouseDown(selectPaymentTypeBtn);
            screen.getByText(new RegExp('.*Bonifico - SEPA.*', 'i'));
            fireEvent.click(screen.getByText(new RegExp('.*Bonifico - SEPA.*', 'i')));
        });
        expect(selectPaymentTypeBtn.textContent).toBe('Bonifico - SEPA');

        // Change touchpoint
        const selectTouchPointBtn = await within(input.touchpoint).getByRole('button');
        await waitFor(() => {
            fireEvent.mouseDown(selectTouchPointBtn);
            screen.getByText(new RegExp('Tutti', 'i'));
            fireEvent.click(screen.getByText(new RegExp('Tutti', 'i')));
        });
        expect(selectTouchPointBtn.textContent).toBe('Tutti');

        // Change min import number
        fireEvent.change(input.minImport, {target: {value: 10}});
        expect(parseFloat(input.minImport.value)).toBe(10);
        // Change max import number
        fireEvent.change(input.maxImport, {target: {value: 10}});
        expect(parseFloat(input.maxImport.value)).toBe(10);

        fireEvent.change(input.feeApplied, {target: {value: '10,8'}});
        expect(input.feeApplied.value).toBe('10,8');

        fireEvent.change(input.feeApplied, {target: {value: 10.8}});
        expect(input.feeApplied.value).toBe('10,8');

        // Change broker code list
        expect(input.channelList.disabled).toBe(true);
        fireEvent.change(input.brokerCodeList, {
            target: {value: mockedDelegatedPSP[1].institution_name},
        });
        input.brokerCodeList.focus();

        fireEvent.change(document.activeElement as Element, {
            target: {value: mockedDelegatedPSP[1].institution_name},
        });
        fireEvent.keyDown(document.activeElement as Element, {key: 'ArrowDown'});
        fireEvent.keyDown(document.activeElement as Element, {key: 'Enter'});
        expect(input.brokerCodeList.value).toEqual(mockedDelegatedPSP[1].institution_name);
        await waitFor(() => {
            expect(spyOnGetChannelService).toBeCalledTimes(1);
            expect(input.channelList.disabled).toBe(false);
        });

        fireEvent.change(document.activeElement as Element, {
            target: {value: ''},
        });
        fireEvent.keyDown(document.activeElement as Element, {key: 'ArrowDown'});
        fireEvent.keyDown(document.activeElement as Element, {key: 'Enter'});
        await waitFor(() => {
            expect(input.channelList.disabled).toBe(true);
        });

        // Change channel id
        fireEvent.mouseDown(input.channelList);
        fireEvent.select(input.channelList, {target: {value: mockedChannelsIdList[0]}});
        expect(input.channelList.value).toBe(mockedChannelsIdList[0]);

        //Change radio buttons digitalStamp
        expect(input.digitalStampYes.checked).toBe(false);
        expect(input.digitalStampNo.checked).toBe(true);
        expect(input.digitalStampResYes.disabled).toBe(false);

        fireEvent.click(input.digitalStampYes);
        expect(input.digitalStampYes.checked).toBe(true);
        expect(input.digitalStampNo.checked).toBe(false);
        expect(input.digitalStampResYes.disabled).toBe(true);

        fireEvent.click(input.digitalStampNo);
        expect(input.digitalStampYes.checked).toBe(false);
        expect(input.digitalStampNo.checked).toBe(true);
        expect(input.digitalStampResYes.disabled).toBe(false);

        //Change radio buttons digitalStampRes
        expect(input.digitalStampResYes.checked).toBe(false);
        expect(input.digitalStampResNo.checked).toBe(true);
        expect(input.digitalStampYes.disabled).toBe(false);

        fireEvent.click(input.digitalStampResYes);
        expect(input.digitalStampResYes.checked).toBe(true);
        expect(input.digitalStampResNo.checked).toBe(false);
        expect(input.digitalStampYes.disabled).toBe(true);

        fireEvent.click(input.digitalStampResNo);
        expect(input.digitalStampResYes.checked).toBe(false);
        expect(input.digitalStampResNo.checked).toBe(true);
        expect(input.digitalStampYes.disabled).toBe(false);

        // Change dates
        const formatDate = (date: Date) => {
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        };

        const fromDate = new Date(2028, 9, 27);
        const toDate = new Date(2028, 9, 28);

        fireEvent.change(input.fromDate, {target: {value: formatDate(fromDate)}});
        expect(input.fromDate.value).toBe('27/10/2028');

        fireEvent.change(input.ToDate, {target: {value: formatDate(toDate)}});
        expect(input.ToDate.value).toBe('28/10/2028');
    });

    test('Test AddEditCommissionBundleForm with all input change in EDIT', async () => {
        const injectStore = createStore();
        await waitFor(() =>
            injectStore.dispatch(partiesActions.setPartySelected(pspOperatorSignedDirect))
        );
        const {...input} = componentRender(FormAction.Edit, mockedBundleRequest, injectStore);
        await waitFor(() => {
            expect(spyOnGetPaymentTypes).toHaveBeenCalled();
            expect(spyOnGetTouchpoint).toHaveBeenCalled();
            expect(spyOnGetInstitutionService).toHaveBeenCalled();
            expect(spyOnGetChannelService).toHaveBeenCalled();
        });

        //Check radio group bundle type
        expect(input.public.disabled).toBe(true);
        expect(input.global.disabled).toBe(true);
        expect(input.private.disabled).toBe(true);

        expect(input.public.checked).toBe(false);
        expect(input.global.checked).toBe(true);
        expect(input.private.checked).toBe(false);

        // Check input name & description
        expect(input.name.value).toBe(mockedBundleRequest.name);
        expect(input.description.value).toBe(mockedBundleRequest.description);

        // Check paymentType
        //TODO FIX DEFAULT LIST
        // const selectPaymentTypeBtn = await within(input.paymentType).getByRole('button');
        // expect(selectPaymentTypeBtn.textContent).toBe(mockedBundleRequest.paymentType);

        // Check touchpoint
        //TODO FIX DEFAULT LIST
        // const selectTouchPointBtn = await within(input.touchpoint).getByRole('button');
        // expect(selectTouchPointBtn.textContent).toBe(mockedBundleRequest.paymentType);

        // Check min import number
        expect(input.minImport.value).toBe(
            (mockedBundleRequest.minPaymentAmount! / 100)?.toString().replace('.', ',')
        );
        // Check max import number
        expect(input.maxImport.value).toBe(
            (mockedBundleRequest.maxPaymentAmount! / 100)?.toString().replace('.', ',')
        );

        expect(input.feeApplied.value).toBe(
            (mockedBundleRequest.paymentAmount! / 100)?.toString().replace('.', ',')
        );

        // Check broker code list
        expect(input.brokerCodeList.value).toBe(mockedDelegatedPSP.find(el => el.broker_id === mockedBundleRequest.idBrokerPsp)?.institution_name);

        // Check channel id
        expect(input.channelList.value).toBe(mockedBundleRequest.idChannel);

        //Check radio buttons digitalStamp
        expect(input.digitalStampYes.checked).toBe(false);
        expect(input.digitalStampNo.checked).toBe(true);

        expect(input.digitalStampYes.disabled).toBe(true);

        //Check radio buttons digitalStampRes
        expect(input.digitalStampResYes.checked).toBe(true);
        expect(input.digitalStampResNo.checked).toBe(false);

        expect(input.digitalStampResYes.disabled).toBe(false);

        fireEvent.click(input.digitalStampResYes);
        expect(input.digitalStampResYes.checked).toBe(true);
        expect(input.digitalStampResNo.checked).toBe(false);
        expect(input.digitalStampYes.disabled).toBe(true);

        // Check dates
        expect(input.fromDate.disabled).toBe(true);
        expect(input.fromDate.value).toBe(formatDateToDDMMYYYY(mockedBundleRequest.validityDateFrom));

        expect(input.ToDate.value).toBe(formatDateToDDMMYYYY(mockedBundleRequest.validityDateTo));
    });

    test('Test AddEditCommissionBundleForm feature flag only global types', async () => {
        const injectStore = createStore();
        spyOnUseFlagValue.mockReturnValue(false);
        await waitFor(() =>
            injectStore.dispatch(partiesActions.setPartySelected(pspOperatorSignedDirect))
        );
        const {...input} = componentRender(FormAction.Create, undefined, injectStore);
        await waitFor(() => {
            expect(spyOnGetPaymentTypes).toHaveBeenCalled();
            expect(spyOnGetTouchpoint).toHaveBeenCalled();
            expect(spyOnGetInstitutionService).toHaveBeenCalled();
            expect(spyOnGetChannelService).not.toHaveBeenCalled();
        });

        //Check radio group bundle type
        expect(input.public.disabled).toBe(true);
        expect(input.global.disabled).toBe(false);
        expect(input.private.disabled).toBe(true);

        expect(input.public.checked).toBe(false);
        expect(input.global.checked).toBe(false);
        expect(input.private.checked).toBe(false);
    });

    test('Test AddEditCommissionBundleForm feature flag only global & private types', async () => {
        const injectStore = createStore();
        spyOnUseFlagValue.mockImplementation((arg) => arg === "commission-bundles-private");
        await waitFor(() =>
            injectStore.dispatch(partiesActions.setPartySelected(pspOperatorSignedDirect))
        );
        const {...input} = componentRender(FormAction.Create, undefined, injectStore);
        await waitFor(() => {
            expect(spyOnGetPaymentTypes).toHaveBeenCalled();
            expect(spyOnGetTouchpoint).toHaveBeenCalled();
            expect(spyOnGetInstitutionService).toHaveBeenCalled();
            expect(spyOnGetChannelService).not.toHaveBeenCalled();
        });


        //Check radio group bundle type
        expect(input.public.disabled).toBe(true);
        expect(input.global.disabled).toBe(false);
        expect(input.private.disabled).toBe(false);

        expect(input.public.checked).toBe(false);
        expect(input.global.checked).toBe(false);
        expect(input.private.checked).toBe(false);
    });

    test('Test AddEditCommissionBundleForm feature flag only global & public types', async () => {
        const injectStore = createStore();
        spyOnUseFlagValue.mockImplementation((arg) => arg === "commission-bundles-public");
        await waitFor(() =>
            injectStore.dispatch(partiesActions.setPartySelected(pspOperatorSignedDirect))
        );
        const {...input} = componentRender(FormAction.Create, undefined, injectStore);
        await waitFor(() => {
            expect(spyOnGetPaymentTypes).toHaveBeenCalled();
            expect(spyOnGetTouchpoint).toHaveBeenCalled();
            expect(spyOnGetInstitutionService).toHaveBeenCalled();
            expect(spyOnGetChannelService).not.toHaveBeenCalled();
        });


        //Check radio group bundle type
        expect(input.public.disabled).toBe(false);
        expect(input.global.disabled).toBe(false);
        expect(input.private.disabled).toBe(true);

        expect(input.public.checked).toBe(false);
        expect(input.global.checked).toBe(false);
        expect(input.private.checked).toBe(false);
    });

    test('Test fetch error getPaymentTypes', async () => {
        const mockError = new Error('API error message getPaymentTypes');
        spyOnGetPaymentTypes.mockRejectedValue(mockError);

        componentRender(FormAction.Create);

        await waitFor(() => {
            expect(spyOnGetPaymentTypes).toHaveBeenCalled();
            expect(spyOnErrorHook).toHaveBeenCalled();
        });
    });

    test('Test fetch error getTouchpoint', async () => {
        const mockError = new Error('API error message GetTouchpoint');
        spyOnGetTouchpoint.mockRejectedValue(mockError);

        componentRender(FormAction.Create);

        await waitFor(() => {
            expect(spyOnGetTouchpoint).toHaveBeenCalled();
            expect(spyOnErrorHook).toHaveBeenCalled();
        });
    });

    test('Test fetch error getBrokerDelegation', async () => {
        const mockError = new Error('API error message getBrokerDelegation');
        spyOnGetInstitutionService.mockRejectedValue(mockError);

        componentRender(FormAction.Create);

        await waitFor(() => {
            expect(spyOnGetInstitutionService).toHaveBeenCalled();
            expect(spyOnErrorHook).toHaveBeenCalled();
            expect(spyOnGetChannelService).not.toHaveBeenCalled();
        });
    });

    test('Test fetch getBrokerDelegation empty list', async () => {
        spyOnGetInstitutionService.mockReturnValue(new Promise((resolve) => resolve([])));

        componentRender(FormAction.Create);

        await waitFor(() => {
            expect(spyOnGetInstitutionService).toHaveBeenCalled();
            expect(spyOnErrorHook).toHaveBeenCalled();
            expect(spyOnGetChannelService).not.toHaveBeenCalled();
        });
    });

    test('Test fetch getChannels empty list', async () => {
        spyOnGetChannelService.mockReturnValue(new Promise((resolve) => resolve([])));
        const injectStore = createStore();
        await waitFor(() =>
            injectStore.dispatch(partiesActions.setPartySelected(pspOperatorSignedDirect))
        );
        componentRender(FormAction.Edit, mockedBundleRequest, injectStore);

        await waitFor(() => {
            expect(spyOnGetChannelService).toHaveBeenCalled();
            expect(spyOnErrorHook).toHaveBeenCalled();
        });
    });

    test('Test fetch getChannels throw error', async () => {
        const mockError = new Error('API error message getChannels');
        spyOnGetChannelService.mockRejectedValue(mockError);
        const injectStore = createStore();
        await waitFor(() =>
            injectStore.dispatch(partiesActions.setPartySelected(pspOperatorSignedDirect))
        );
        componentRender(FormAction.Edit, mockedBundleRequest, injectStore);

        await waitFor(() => {
            expect(spyOnErrorHook).toHaveBeenCalled();
            expect(spyOnGetChannelService).toHaveBeenCalled();
        });
    });
});
