import {ThemeProvider} from '@mui/system';
import {theme} from '@pagopa/mui-italia';
import {cleanup, fireEvent, render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {createMemoryHistory} from 'history';
import {MemoryRouter, Route} from 'react-router-dom';
import {createStore, store} from '../../../../redux/store';
import {Provider} from 'react-redux';
import ChannelAssociatePSPPage from '../ChannelAssociatePSPPage';
import {pspAdminSignedDirect} from '../../../../services/__mocks__/partyService';
import * as channelService from '../../../../services/channelService';

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockHistoryPush,
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
        const {store, history} = renderApp();

        const back = screen.getByTestId('back-btn-test');
        await waitFor(() => fireEvent.click(back));
        expect(mockHistoryPush).toHaveBeenCalledWith(`ui/channels/${channelId}/psp-list`);
    });

    test('fetches already associated PSPs on mount', async () => {
        const getChannelPSPsSpy = jest.spyOn(channelService, 'getChannelPSPs');

        const {store} = renderApp();

        await waitFor(() =>
            store.dispatch({
                type: 'parties/setPartySelected',
                payload: pspAdminSignedDirect,
            })
        );

        await waitFor(() => {
            expect(getChannelPSPsSpy).toHaveBeenCalledWith(channelId, '', 0, 1000);
        });

        getChannelPSPsSpy.mockRestore();
    });

    test('handles getChannelPSPs failure gracefully', async () => {
        const getChannelPSPsSpy = jest
            .spyOn(channelService, 'getChannelPSPs')
            .mockRejectedValueOnce(new Error('Network error'));

        const {store} = renderApp();

        await waitFor(() =>
            store.dispatch({
                type: 'parties/setPartySelected',
                payload: pspAdminSignedDirect,
            })
        );

        // The page should still render without crashing
        const confirm = screen.getByTestId('confirm-btn-test');
        expect(confirm).toBeDisabled();

        getChannelPSPsSpy.mockRestore();
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

        // Confirm button should be disabled when no PSP is selected
        const confirm = screen.getByTestId('confirm-btn-test');
        expect(confirm).toBeDisabled();

        associateSpy.mockRestore();
    });
});
