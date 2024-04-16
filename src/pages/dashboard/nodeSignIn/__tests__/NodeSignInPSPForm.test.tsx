import {ThemeProvider} from '@mui/system';
import {theme} from '@pagopa/mui-italia';
import {cleanup, fireEvent, render, screen, waitFor} from '@testing-library/react';
import {createMemoryHistory} from 'history';
import React from 'react';
import {Provider} from 'react-redux';
import {MemoryRouter, Route} from 'react-router-dom';
import {createStore} from '../../../../redux/store';
import NodeSignInPSPForm from '../NodeSignInPSPForm';
import {
  brokerOrPspDetailsResource_PSPAndBroker,
  brokerOrPspDetailsResource_PSPOnly
} from '../../../../services/__mocks__/nodeService';
import {
  pspAdminSignedDirect,
  pspAdminSignedUndirect,
  pspAdminUnsigned,
} from '../../../../services/__mocks__/partyService';
import { BrokerOrPspDetailsResource } from '../../../../api/generated/portal/BrokerOrPspDetailsResource';

let createPSPDirectMocked: jest.SpyInstance;
let createPSPIndirectMocked: jest.SpyInstance;
let useSigninDataMocked: jest.SpyInstance;
let updatePSPInfoMocked: jest.SpyInstance;
let getBrokerAndPspDetailsMocked: jest.SpyInstance;
let createPspBroker: jest.SpyInstance;

jest.mock('../../../../decorators/withSelectedParty');

const renderApp = (
    signInData: BrokerOrPspDetailsResource,
    injectedStore?: ReturnType<typeof createStore>,
    injectedHistory?: ReturnType<typeof createMemoryHistory>
) => {
    const store = injectedStore ? injectedStore : createStore();
    const history = injectedHistory ? injectedHistory : createMemoryHistory();
    render(
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <MemoryRouter initialEntries={[`/node-signin`]}>
                    <Route path="/node-signin">
                        <NodeSignInPSPForm goBack={jest.fn()} signInData={signInData}/>
                    </Route>
                </MemoryRouter>
            </ThemeProvider>
        </Provider>
    );
    return {store, history};
};

const setupFormAndSubmit = async (store) => {
    await waitFor(() =>
        store.dispatch({
            type: 'parties/setPartySelected',
            payload: pspPartySelected,
        })
    );
    const businessName = screen.getByTestId('businessName-test') as HTMLInputElement;
    const fiscalCode = screen.getByTestId('fiscalCode-test') as HTMLSelectElement;
    const abiCode = screen.getByTestId('abiCode-test') as HTMLInputElement;
    const pspCode = screen.getByTestId('pspCode-test') as HTMLInputElement;
    const bicCode = screen.getByTestId('bicCode-test') as HTMLInputElement;
    const digitalStampRadioTrue = screen.getByTestId('digitalStamp-true-test') as HTMLInputElement;
    const intermediaryTrue = screen
        .getByTestId('intermediary-available-test')
        .querySelector('[value=true]') as HTMLInputElement;

    fireEvent.change(bicCode, {target: {value: '12345'}});
    expect(bicCode.value).toBe('12345');

    fireEvent.click(digitalStampRadioTrue);

    fireEvent.click(intermediaryTrue);

    const confirmBtn = await screen.findByTestId('continue-button-test');
    fireEvent.click(confirmBtn);
};

beforeEach(() => {
    createPSPDirectMocked = jest.spyOn(
        require('../../../../services/nodeService'),
        'createPSPDirect'
    );

    createPSPIndirectMocked = jest.spyOn(
        require('../../../../services/nodeService'),
        'createPSPIndirect'
    );
    useSigninDataMocked = jest.spyOn(require('../../../../hooks/useSigninData'), 'useSigninData');
    updatePSPInfoMocked = jest.spyOn(require('../../../../services/nodeService'), 'updatePSPInfo');
    getBrokerAndPspDetailsMocked = jest.spyOn(
        require('../../../../services/nodeService'),
        'getBrokerAndPspDetails'
    );
    createPspBroker = jest.spyOn(require('../../../../services/nodeService'), 'createPspBroker');

    jest.spyOn(console, 'error').mockImplementation(() => {
    });
    jest.spyOn(console, 'warn').mockImplementation(() => {
    });
});

afterEach(cleanup);

describe('NodeSignInPSPForm', () => {
    test('Test rendering NodeSignInPSPForm with getBrokerAndPspDetailsMocked error ', async () => {
        getBrokerAndPspDetailsMocked.mockRejectedValueOnce(new Error('Fetch error'));

        const {store} = renderApp(brokerOrPspDetailsResource_PSPAndBroker);

        await waitFor(() =>
            store.dispatch({
                type: 'parties/setPartySelected',
                payload: pspAdminUnsigned,
            })
        );

        await waitFor(() =>
            store.dispatch({
                type: 'parties/setSigninData',
                payload: brokerOrPspDetailsResource_PSPAndBroker,
            })
        );

        await setupFormAndSubmit(store);

        await waitFor(() => expect(getBrokerAndPspDetailsMocked).toBeCalled());
        expect(console.error).toBeCalled();
    });

    test('Test rendering NodeSignInPSPForm with intermediary true and Sumbit', async () => {
        const {store} = renderApp({});

        await waitFor(() =>
            store.dispatch({
                type: 'parties/setSigninData',
                payload: {},
            })
        );

        await waitFor(() =>
            store.dispatch({
                type: 'parties/setPartySelected',
                payload: pspAdminUnsigned,
            })
        );

        await setupFormAndSubmit(store);

        const intermediaryTrue = screen
            .getByTestId('intermediary-available-test')
            .querySelector('[value=true]') as HTMLInputElement;

        fireEvent.click(intermediaryTrue);

        await waitFor(() => expect(createPSPDirectMocked).toHaveBeenCalledTimes(1));
        await waitFor(() => expect(useSigninDataMocked).toHaveBeenCalled());
    });

    test('Test rendering NodeSignInPSPForm with intermediary false and Sumbit', async () => {
        const {store} = renderApp({});

        await waitFor(() =>
            store.dispatch({
                type: 'parties/setSigninData',
                payload: {},
            })
        );

        await waitFor(() =>
            store.dispatch({
                type: 'parties/setPartySelected',
                payload: pspAdminUnsigned,
            })
        );

        await setupFormAndSubmit(store);

        const intermediaryFalse = screen
            .getByTestId('intermediary-available-test')
            .querySelector('[value=false]') as HTMLInputElement;

        fireEvent.click(intermediaryFalse);

        await waitFor(() => expect(createPSPIndirectMocked).toHaveBeenCalledTimes(1));
        await waitFor(() => expect(useSigninDataMocked).toHaveBeenCalled());
    });

    test('Test rendering NodeSignInPSPForm with intermediary true and Sumbit with createPspBroker api call', async () => {
        const {store} = renderApp(brokerOrPspDetailsResource_PSPOnly);

        await waitFor(() =>
            store.dispatch({
                type: 'parties/setSigninData',
                payload: brokerOrPspDetailsResource_PSPOnly,
            })
        );

        await waitFor(() =>
            store.dispatch({
                type: 'parties/setPartySelected',
                payload: pspAdminSignedUndirect,
            })
        );

        await setupFormAndSubmit(store);

        const intermediaryTrue = screen
            .getByTestId('intermediary-available-test')
            .querySelector('[value=true]') as HTMLInputElement;

        fireEvent.click(intermediaryTrue);

        await waitFor(() => expect(createPspBroker).toHaveBeenCalledTimes(1));
        await waitFor(() => expect(useSigninDataMocked).toHaveBeenCalled());
    });

    test('Test bicCode empty', async () => {
        const {store} = renderApp({});

        await waitFor(() =>
            store.dispatch({
                type: 'parties/setSigninData',
                payload: {},
            })
        );

        await waitFor(() =>
            store.dispatch({
                type: 'parties/setPartySelected',
                payload: pspAdminUnsigned,
            })
        );

        const bicCode = screen.getByTestId('bicCode-test') as HTMLInputElement;

        fireEvent.change(bicCode, {target: {value: 'abc'}});
        expect(bicCode.value).toBe('');

        const confirmBtn = await screen.findByTestId('continue-button-test');
        fireEvent.click(confirmBtn);
    });
});

test('Test rendering NodeSignInPSPForm in case of updating the form with a psp direct', async () => {
    const {store} = renderApp(brokerOrPspDetailsResource_PSPAndBroker);

    await waitFor(() =>
        store.dispatch({
            type: 'parties/setSigninData',
            payload: brokerOrPspDetailsResource_PSPAndBroker,
        })
    );

    await waitFor(() =>
        store.dispatch({
            type: 'parties/setPartySelected',
            payload: pspAdminSignedDirect,
        })
    );
    const bicCode = screen.getByTestId('bicCode-test') as HTMLInputElement;

    expect(bicCode.value).toBe(
        brokerOrPspDetailsResource_PSPAndBroker.paymentServiceProviderDetailsResource?.bic
    );

    fireEvent.change(bicCode, {target: {value: '12345'}});
    expect(bicCode.value).toBe('12345');

    const confirmBtn = await screen.findByTestId('continue-button-test');
    fireEvent.click(confirmBtn);

    await waitFor(() => {
        expect(updatePSPInfoMocked).toHaveBeenCalled();
    });
});

test('Test rendering NodeSignInPSPForm in case of updating the form with a psp indirect', async () => {
    const {store} = renderApp(brokerOrPspDetailsResource_PSPOnly);

    await waitFor(() =>
        store.dispatch({
            type: 'parties/setSigninData',
            payload: brokerOrPspDetailsResource_PSPOnly,
        })
    );

    await waitFor(() =>
        store.dispatch({
            type: 'parties/setPartySelected',
            payload: pspAdminSignedUndirect,
        })
    );
    const bicCode = screen.getByTestId('bicCode-test') as HTMLInputElement;
    const intermediaryFalse = screen
        .getByTestId('intermediary-available-test')
        .querySelector('[value=false]') as HTMLInputElement;
    const intermediaryTrue = screen
        .getByTestId('intermediary-available-test')
        .querySelector('[value=true]') as HTMLInputElement;

    expect(bicCode.value).toBe(
        brokerOrPspDetailsResource_PSPOnly.paymentServiceProviderDetailsResource?.bic
    );
    expect(intermediaryFalse.checked).toBe(true);

    fireEvent.change(bicCode, {target: {value: '12345'}});
    expect(bicCode.value).toBe('12345');

    expect(intermediaryTrue.checked).toBe(false);
    fireEvent.click(intermediaryTrue);
    expect(intermediaryTrue.checked).toBe(true);

    const confirmBtn = await screen.findByTestId('continue-button-test');
    fireEvent.click(confirmBtn);

    await waitFor(() => expect(createPspBroker).toHaveBeenCalledTimes(1));
    await waitFor(() => {
        expect(updatePSPInfoMocked).toHaveBeenCalled();
    });
});

const pspPartySelected = {
    partyId: '26a0aabf-ce6a-4dfa-af4e-d4f744a8b944',
    externalId: '15376371009',
    originId: 'PAGOPASPA',
    origin: 'SELC',
    description: 'PagoPA S.p.A.',
    fiscalCode: '15376371009',
    digitalAddress: 'selfcare@pec.pagopa.it',
    status: 'ACTIVE',
    registeredOffice: 'Piazza Colonna, 370',
    institutionType: 'PSP',
    roles: [
        {
            partyRole: 'DELEGATE',
            roleKey: 'admin',
        },
    ],
    urlLogo: 'https://checkout.selfcare/institutions/26a0aabf-ce6a-4dfa-af4e-d4f744a8b944/logo.png',
    typology: 'TODO',
    pspData: {
        businessRegisterNumber: '00000000000',
        legalRegisterName: 'ISTITUTI DI PAGAMENTO',
        legalRegisterNumber: '09878',
        abiCode: '36042',
        vatNumberGroup: false,
    },
};
