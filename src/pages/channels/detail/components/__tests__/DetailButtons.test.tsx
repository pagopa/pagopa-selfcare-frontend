import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { mockedPaymentTypes } from '../../../../../services/__mocks__/configurationService';
import { StatusEnum } from '../../../../../api/generated/portal/WrapperChannelDetailsDto';
import { WrapperStatusEnum } from '../../../../../api/generated/portal/ChannelDetailsResource';
import { ROLE } from '../../../../../model/RolePermission';
import { store } from '../../../../../redux/store';
import * as useUserRole from '../../../../../hooks/useUserRole';
import { theme } from '@pagopa/mui-italia';
import { ThemeProvider } from '@mui/system';
import DetailButtons from '../DetailButtons';

describe('<DetailButtons />', () => {
  test('render component DetailButtons', async () => {
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
              <DetailButtons
                channelDetails={channelDetailWrapper}
                goBack={jest.fn()}
                setChannelDetails={jest.fn()}
              />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );
  });

  test('render component DetailButtons should contain modal', async () => {
    jest.spyOn(useUserRole, 'useUserRole').mockReturnValue({
      userRole: ROLE.PAGOPA_OPERATOR,
      userIsPspAdmin: false,
      userIsEcAdmin: false,
      userIsPspDirectAdmin: false,
      userIsPagopaOperator: true,
      userIsAdmin: true,
    });

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
      wrapperStatus: WrapperStatusEnum.TO_CHECK,
    };
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/channels/${channelId}`]}>
          <Route path="/channels/:channelId">
            <ThemeProvider theme={theme}>
              <DetailButtons
                channelDetails={channelDetailWrapper}
                goBack={jest.fn()}
                setChannelDetails={jest.fn()}
              />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.queryByTestId('request-edit-button')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('request-edit-button'));

    await waitFor(() => {
      expect(screen.queryByTestId('confirm-and-send-button')).toBeInTheDocument();
    });
    const confirmButton = screen.getByTestId('confirm-and-send-button');

    expect(confirmButton).toBeDisabled();

    fireEvent.change(screen.getByTestId('requestInput'), { target: { value: 'note' } });

    await waitFor(() => {
      expect(confirmButton).toBeEnabled();
    });

    fireEvent.click(confirmButton);
  });
});
