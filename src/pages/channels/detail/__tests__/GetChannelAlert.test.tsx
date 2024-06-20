import {ThemeProvider} from '@mui/system';
import {theme} from '@pagopa/mui-italia';
import {cleanup, render} from '@testing-library/react';
import React from 'react';
import {MemoryRouter, Route} from 'react-router-dom';
import {store} from '../../../../redux/store';
import * as useUserRole from '../../../../hooks/useUserRole';
import GetChannelAlert from '../components/GetChannelAlert';
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

describe('<ChannelDetailPage />', () => {
    const channelId = 'XPAY_03_ONUS';
    test('render component ChannelDetailPage on APPROVED', async () => {
        const channelDetail = {
            broker_psp_code: '97735020584',
            broker_description: 'AgID - Agenzia per l’Italia Digitale',
            channel_code: `$test`,
            target_path: ' /govpay/api/pagopa/PagamentiTelematiciCCPservice',
            target_port: 8081,
            target_host: ' lab.link.it',
            status: StatusEnum.APPROVED,
            wrapperStatus: WrapperStatusEnum.APPROVED
        };
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/channels/${channelId}`]}>
                    <Route path="/channels/:channelId">
                        <ThemeProvider theme={theme}>
                            <GetChannelAlert channelDetail={channelDetail}/>
                        </ThemeProvider>
                    </Route>
                </MemoryRouter>
            </Provider>
        );
    });

    test('render component ChannelDetailPage on TO_FIX', async () => {
        const channelDetail = {
            broker_psp_code: '97735020584',
            broker_description: 'AgID - Agenzia per l’Italia Digitale',
            channel_code: `$test`,
            target_path: ' /govpay/api/pagopa/PagamentiTelematiciCCPservice',
            target_port: 8081,
            target_host: ' lab.link.it',
            status: StatusEnum.TO_FIX,
            wrapperStatus: WrapperStatusEnum.TO_FIX
        };
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/channels/${channelId}`]}>
                    <Route path="/channels/:channelId">
                        <ThemeProvider theme={theme}>
                            <GetChannelAlert channelDetail={channelDetail}/>
                        </ThemeProvider>
                    </Route>
                </MemoryRouter>
            </Provider>
        );
    });

    test('render component ChannelDetailPage on TO_CHECK', async () => {

        jest.spyOn(useUserRole, 'useUserRole').mockReturnValue({
            userRole: ROLE.PAGOPA_OPERATOR,
            userIsPspAdmin: false,
            userIsEcAdmin: false,
            userIsPspDirectAdmin: false,
            userIsPagopaOperator: true,
            userIsAdmin: true,
        });

        const channelDetail = {
            broker_psp_code: '97735020584',
            broker_description: 'AgID - Agenzia per l’Italia Digitale',
            channel_code: `$test`,
            target_path: ' /govpay/api/pagopa/PagamentiTelematiciCCPservice',
            target_port: 8081,
            target_host: ' lab.link.it',
            status: StatusEnum.TO_CHECK,
            wrapperStatus: WrapperStatusEnum.TO_CHECK
        };
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/channels/${channelId}`]}>
                    <Route path="/channels/:channelId">
                        <ThemeProvider theme={theme}>
                            <GetChannelAlert channelDetail={channelDetail}/>
                        </ThemeProvider>
                    </Route>
                </MemoryRouter>
            </Provider>
        );
    });

});


