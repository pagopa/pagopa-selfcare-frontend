import React from 'react';
import {ThemeProvider} from '@mui/system';
import {theme} from '@pagopa/mui-italia';
import {cleanup, fireEvent, render, screen, waitFor} from '@testing-library/react';
import {MemoryRouter, Route} from 'react-router-dom';
import {Provider} from 'react-redux';
import {store} from '../../../../redux/store';
import ChannelPSPTable from '../ChannelPSPTable';
import * as channelService from '../../../../services/channelService';

let spyApi: jest.SpyInstance;

beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {
    });
    jest.spyOn(console, 'warn').mockImplementation(() => {
    });
    spyApi = jest.spyOn(channelService, 'dissociatePSPfromChannel');
    jest.resetModules();
});

afterEach(cleanup);
const channelId = 'XPAY_03_ONUS';

describe('<ChannelPSPTable />', () => {
    test('render component ChannelPSPTable', async () => {
        await waitFor(() => {
            render(
                <Provider store={store}>
                    <MemoryRouter initialEntries={[`/channels/${channelId}`]}>
                        <Route path="/channels/:channelId">
                            <ThemeProvider theme={theme}>
                                <ChannelPSPTable setAlertMessage={() => ''} pspNameFilter={''}/>
                            </ThemeProvider>
                        </Route>
                    </MemoryRouter>
                </Provider>
            );
        });
    });

    test('Break up PSP Channel relationship', async () => {
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/channels/${channelId}`]}>
                    <Route path="/channels/:channelId">
                        <ThemeProvider theme={theme}>
                            <ChannelPSPTable setAlertMessage={() => ''} pspNameFilter={''}/>
                        </ThemeProvider>
                    </Route>
                </MemoryRouter>
            </Provider>
        );

        await waitFor(() => {
            const dissociatePspBtn = screen.getByTestId('dissociate-AAAAAAAA78AAAAA3');
            fireEvent.click(dissociatePspBtn);
        });

        const confirmBtn = screen.getByRole('button', {
            name: /channelPSPList.dissociateModal.confirmButton/i,
        });
        fireEvent.click(confirmBtn);

        await waitFor(() => {
            expect(spyApi).toBeCalledTimes(1);
        });
    });
});
