import {ThemeProvider} from '@mui/system';
import {theme} from '@pagopa/mui-italia';
import {cleanup, screen, render, fireEvent} from '@testing-library/react';
import React from 'react';
import {MemoryRouter, Route} from 'react-router-dom';
import {store} from '../../../../redux/store';
import {Provider} from 'react-redux';
import ChannelDetails from '../components/ChannelDetails';
import {StatusEnum} from '../../../../api/generated/portal/ChannelDetailsDto';
import {mockedPaymentTypes} from '../../../../services/__mocks__/configurationService';

beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {
    });
    jest.spyOn(console, 'warn').mockImplementation(() => {
    });
    jest.resetModules();
});
afterEach(cleanup);

const passwordFieldValue = 'randomValue';

describe('<ChannelDetails />', () => {
    const channelId = 'XPAY_03_ONUS';
    const channelDetail = {
        broker_psp_code: '97735020584',
        broker_description: 'AgID - Agenzia per l’Italia Digitale',
        channel_code: `${channelId}`,
        target_path: ' /govpay/api/pagopa/PagamentiTelematiciCCPservice',
        target_port: 8081,
        target_host: ' lab.link.it',
        payment_types: mockedPaymentTypes.payment_types!.map((e) => e.payment_type ?? ''),
        status: StatusEnum.TO_CHECK,
        password: passwordFieldValue,
    };
    test('render component ChannelDetails with channelDetail', async () => {
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/channels/${channelId}`]}>
                    <Route path="/channels/:channelId">
                        <ThemeProvider theme={theme}>
                            <ChannelDetails
                                channelDetail={channelDetail}
                                channelId={channelId}
                                goBack={jest.fn()}
                                PSPAssociatedNumber={0}
                            />
                        </ThemeProvider>
                    </Route>
                </MemoryRouter>
            </Provider>
        );

        const passwordField = screen.getByTestId('password-value-test') as HTMLElement;
        expect(passwordField.innerHTML).toBe('XXXXXXXXXXXXXX');

        const showPasswordButton = screen.getByTestId('show-psw-test') as HTMLElement;

        fireEvent.click(showPasswordButton);

        expect(passwordField.innerHTML).toBe(passwordFieldValue);
    });

    test('render component ChannelDetails with empty channelDetail', async () => {
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/channels/${channelId}`]}>
                    <Route path="/channels/:channelId">
                        <ThemeProvider theme={theme}>
                            <ChannelDetails
                                channelDetail={{
                                    broker_psp_code: undefined,
                                    broker_description: undefined,
                                    channel_code: '',
                                    target_path: undefined,
                                    target_port: undefined,
                                    target_host: undefined,
                                    payment_types: undefined,
                                }}
                                channelId={channelId}
                                goBack={jest.fn()}
                                PSPAssociatedNumber={0}
                            />
                        </ThemeProvider>
                    </Route>
                </MemoryRouter>
            </Provider>
        );

        let noPassword = false;
        try {
            screen.getByTestId('password-value-test');
        } catch (_) {
            noPassword = true;
        }
        expect(noPassword).toBeTruthy();
    });
});
