import React from 'react';
import {render} from '@testing-library/react';
import {MemoryRouter, Route, Router} from 'react-router-dom';
import {Provider} from 'react-redux';
import ChannelDetailsWrap from '../components/ChannelDetailsWrap';
import {mockedPaymentTypes} from '../../../../services/__mocks__/configurationService';
import {StatusEnum} from '../../../../api/generated/portal/WrapperChannelDetailsDto';
import {store} from '../../../../redux/store';
import {theme} from '@pagopa/mui-italia';
import {ThemeProvider} from '@mui/system';

describe('<ChannelDetailsWrap />', () => {
    test('render component ChannelDetailsWrap', async () => {
        const channelId = 'XPAY_03_ONUS';
        const channelDetailWrapper = {
            broker_psp_code: '97735020584',
            broker_description: 'AgID - Agenzia per l’Italia Digitale',
            channel_code: `${channelId}`,
            target_path: ' /govpay/api/pagopa/PagamentiTelematiciCCPservice',
            target_port: 8081,
            target_host: ' lab.link.it',
            payment_types: mockedPaymentTypes.payment_types!.map((e) => e.payment_type ?? ''),
            status: StatusEnum.TO_CHECK,
        };
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/channels/${channelId}`]}>
                    <Route path="/channels/:channelId">
                        <ThemeProvider theme={theme}>
                            <ChannelDetailsWrap
                                channelDetWrap={channelDetailWrapper}
                                channelId={channelId}
                                goBack={jest.fn()}
                                PSPAssociatedNumber={0}
                            />
                        </ThemeProvider>
                    </Route>
                </MemoryRouter>
            </Provider>
        );
    });
});
