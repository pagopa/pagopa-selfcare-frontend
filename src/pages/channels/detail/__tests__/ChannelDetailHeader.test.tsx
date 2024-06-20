import {ThemeProvider} from '@mui/system';
import {theme} from '@pagopa/mui-italia';
import {cleanup, screen, render, fireEvent} from '@testing-library/react';
import React from 'react';
import {MemoryRouter, Route} from 'react-router-dom';
import {store} from '../../../../redux/store';
import ChannelDetailHeader from '../components/GetChannelAlert';
import {StatusEnum} from '../../../../api/generated/portal/WrapperChannelDetailsDto';
import {WrapperStatusEnum,} from '../../../../api/generated/portal/ChannelDetailsResource';
import {Provider} from 'react-redux';


beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {
    });
    jest.spyOn(console, 'warn').mockImplementation(() => {
    });
    jest.resetModules();
});
afterEach(cleanup);

describe('<ChannelDetailHeader />', () => {
    const channelId = 'XPAY_03_ONUS';
    test('render component ChannelDetailHeader', async () => {
        const channelDetail = {
            broker_psp_code: '97735020584',
            broker_description: 'AgID - Agenzia per l’Italia Digitale',
            channel_code: `$test`,
            target_path: ' /govpay/api/pagopa/PagamentiTelematiciCCPservice',
            target_port: 8081,
            target_host: ' lab.link.it',
            status: StatusEnum.TO_CHECK,
            wrapperStatus: WrapperStatusEnum.APPROVED
        };
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/channels/${channelId}`]}>
                    <Route path="/channels/:channelId">
                        <ThemeProvider theme={theme}>
                            <ChannelDetailHeader channelId={channelId} channelDetail={channelDetail} goBack={jest.fn()}/>
                        </ThemeProvider>
                    </Route>
                </MemoryRouter>
            </Provider>
        );

    });

});


