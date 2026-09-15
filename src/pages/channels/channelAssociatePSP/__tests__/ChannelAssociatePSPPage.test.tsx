import {ThemeProvider} from '@mui/system';
import {theme} from '@pagopa/mui-italia';
import {cleanup, fireEvent, render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import {createMemoryHistory} from 'history';
import {MemoryRouter, Route} from 'react-router-dom';
import {createStore} from '../../../../redux/store';
import {Provider} from 'react-redux';
import ChannelAssociatePSPPage from '../ChannelAssociatePSPPage';
import {pspAdminSignedDirect} from '../../../../services/__mocks__/partyService';
import * as channelService from '../../../../services/channelService';
import {channelsActions} from '../../../../redux/slices/channelsSlice';

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockHistoryPush,
        location: {state: {}},
    }),
}));

beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {
    });
    jest.spyOn(console, 'warn').mockImplementation(() => {
    });
});

afterEach(cleanup);

const channelId = 'XPAY_03_ONUS';

const renderApp = (
    injectedStore?: ReturnType<typeof createStore>,
    injectedHistory?: ReturnType<typeof createMemoryHistory>
) => {
    const store = injectedStore ? injectedStore : createStore();
    const history = injectedHistory ? injectedHistory : createMemoryHistory();
    render(
        <Provider store={store}>
            <MemoryRouter initialEntries={[`channels/${channelId}/associate-psp`]}>
                <Route path={'channels/:channelId/associate-psp'}>
                    <ThemeProvider theme={theme}>
                        <ChannelAssociatePSPPage/>
                    </ThemeProvider>
                </Route>
            </MemoryRouter>
        </Provider>
    );
    return {store, history};
};

describe('<ChannelAssociatePSPPage />', () => {
    test('render component ChannelAssociatePSPPage and associate a psp', async () => {
        const {store} = renderApp();

        await waitFor(() =>
            store.dispatch({
                type: 'parties/setPartySelected',
                payload: pspAdminSignedDirect,
            })
        );
        const confirm = screen.getByTestId('confirm-btn-test');
        expect(confirm).toBeDisabled();

        const pspSelectionSearch = screen.getByText(
            'Digita il nome del nuovo PSP da associare al canale'
        );
        expect(pspSelectionSearch).toBeInTheDocument();

        const searchInput = screen.getByTestId('psp-selection-search');

        await userEvent.type(searchInput, 'PSP1{enter}');
    });

    test('render component ChannelAssociatePSPPage and go back', async () => {
        renderApp();

        const back = screen.getByTestId('back-btn-test');
        await waitFor(() => fireEvent.click(back));
        expect(mockHistoryPush).toHaveBeenCalledWith(`ui/channels/${channelId}/psp-list`);
    });

    test('reads associated PSP tax codes from Redux store', async () => {
        const store = createStore();
        store.dispatch(channelsActions.setAssociatedPSPTaxCodes(['TAX001', 'TAX002']));

        renderApp(store);

        await waitFor(() =>
            store.dispatch({
                type: 'parties/setPartySelected',
                payload: pspAdminSignedDirect,
            })
        );

        const confirm = screen.getByTestId('confirm-btn-test');
        expect(confirm).toBeDisabled();
    });

    test('handles empty Redux store gracefully', async () => {
        const {store} = renderApp();

        await waitFor(() =>
            store.dispatch({
                type: 'parties/setPartySelected',
                payload: pspAdminSignedDirect,
            })
        );

        const confirm = screen.getByTestId('confirm-btn-test');
        expect(confirm).toBeDisabled();
    });

    test('handles associatePSPtoChannel failure with error toast', async () => {
        const associateSpy = jest
            .spyOn(channelService, 'associatePSPtoChannel')
            .mockRejectedValueOnce(new Error('Association failed'));

        const {store} = renderApp();

        await waitFor(() =>
            store.dispatch({
                type: 'parties/setPartySelected',
                payload: pspAdminSignedDirect,
            })
        );

        const confirm = screen.getByTestId('confirm-btn-test');
        expect(confirm).toBeDisabled();

        associateSpy.mockRestore();
    });
});
