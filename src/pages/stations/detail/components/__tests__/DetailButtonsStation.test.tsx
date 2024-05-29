import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import DetailButtonsStation from '../DetailButtonsStation';
import React from 'react';
import { mockedFullStation } from '../../../../../services/__mocks__/stationService';
import { ROLE } from '../../../../../model/RolePermission';
import { Provider } from 'react-redux';
import * as useUserRole from '../../../../../hooks/useUserRole';
import { WrapperStatusEnum } from '../../../../../api/generated/portal/StationDetailResource';
import { store } from '../../../../../redux/store';
import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import * as StationService from '../../../../../services/stationService';

const spyOnSendEditRequest = jest.spyOn(StationService, 'updateWrapperStationWithOperatorReview');

describe('Test DetailButtonStation as CI', () => {
  const mockSetStation = jest.fn();
  const history = createMemoryHistory();
  test('Test component station approved', () => {
    jest.spyOn(useUserRole, 'useUserRole').mockReturnValue({
      userRole: ROLE.EC_DIRECT_ADMIN,
      userIsPspAdmin: false,
      userIsEcAdmin: false,
      userIsPspDirectAdmin: false,
      userIsPagopaOperator: false,
      userIsAdmin: true,
    });
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router history={history}>
            <DetailButtonsStation
              stationDetail={{ ...mockedFullStation, wrapperStatus: WrapperStatusEnum.APPROVED }}
              setStationDetail={mockSetStation}
            />
          </Router>
        </ThemeProvider>
      </Provider>
    );

    expect(screen.queryByTestId('edit-button')).toBeInTheDocument();
    expect(screen.queryByTestId('duplicate-button')).toBeInTheDocument();
    expect(screen.queryByTestId('manage-ec-button')).toBeInTheDocument();
    expect(screen.queryByTestId('delete-button')).toBeInTheDocument();
    expect(screen.queryByTestId('request-edit-button')).not.toBeInTheDocument();
  });

  test('Test component station to fix', () => {
    jest.spyOn(useUserRole, 'useUserRole').mockReturnValue({
      userRole: ROLE.EC_DIRECT_ADMIN,
      userIsPspAdmin: false,
      userIsEcAdmin: false,
      userIsPspDirectAdmin: false,
      userIsPagopaOperator: false,
      userIsAdmin: true,
    });
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router history={history}>
            <DetailButtonsStation
              stationDetail={{ ...mockedFullStation, wrapperStatus: WrapperStatusEnum.TO_FIX }}
              setStationDetail={mockSetStation}
            />
          </Router>
        </ThemeProvider>
      </Provider>
    );

    expect(screen.queryByTestId('edit-button')).toBeInTheDocument();
    expect(screen.queryByTestId('duplicate-button')).not.toBeInTheDocument();
    expect(screen.queryByTestId('manage-ec-button')).not.toBeInTheDocument();
    expect(screen.queryByTestId('delete-button')).not.toBeInTheDocument();
    expect(screen.queryByTestId('request-edit-button')).not.toBeInTheDocument();
  });

  test('Test DetailButtonStation as Pagopa operator ', async () => {
    spyOnSendEditRequest.mockReturnValueOnce(Promise.resolve(mockedFullStation));
    jest.spyOn(useUserRole, 'useUserRole').mockReturnValue({
      userRole: ROLE.PAGOPA_OPERATOR,
      userIsPspAdmin: false,
      userIsEcAdmin: false,
      userIsPspDirectAdmin: false,
      userIsPagopaOperator: true,
      userIsAdmin: true,
    });
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router history={history}>
            <DetailButtonsStation
              stationDetail={mockedFullStation}
              setStationDetail={mockSetStation}
            />
          </Router>
        </ThemeProvider>
      </Provider>
    );

    expect(screen.queryByTestId('edit-button')).toBeInTheDocument();
    expect(screen.queryByTestId('duplicate-button')).not.toBeInTheDocument();
    expect(screen.queryByTestId('manage-ec-button')).not.toBeInTheDocument();
    expect(screen.queryByTestId('delete-button')).not.toBeInTheDocument();
    expect(screen.queryByTestId('request-edit-button')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('request-edit-button'));

    await waitFor(() => {
      expect(screen.queryByTestId('confirm-and-send-button')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('confirm-and-send-button'));

    await waitFor(() => {
      expect(spyOnSendEditRequest).toBeCalled();
    });
  });

  test('Test DetailButtonStation as Pagopa operator error sending', async () => {
    spyOnSendEditRequest.mockRejectedValueOnce('error');
    jest.spyOn(useUserRole, 'useUserRole').mockReturnValue({
      userRole: ROLE.PAGOPA_OPERATOR,
      userIsPspAdmin: false,
      userIsEcAdmin: false,
      userIsPspDirectAdmin: false,
      userIsPagopaOperator: true,
      userIsAdmin: true,
    });
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router history={history}>
            <DetailButtonsStation
              stationDetail={mockedFullStation}
              setStationDetail={mockSetStation}
            />
          </Router>
        </ThemeProvider>
      </Provider>
    );

    expect(screen.queryByTestId('edit-button')).toBeInTheDocument();
    expect(screen.queryByTestId('duplicate-button')).not.toBeInTheDocument();
    expect(screen.queryByTestId('manage-ec-button')).not.toBeInTheDocument();
    expect(screen.queryByTestId('delete-button')).not.toBeInTheDocument();
    expect(screen.queryByTestId('request-edit-button')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('request-edit-button'));

    await waitFor(() => {
      expect(screen.queryByTestId('confirm-and-send-button')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('confirm-and-send-button'));

    await waitFor(() => {
      expect(spyOnSendEditRequest).toBeCalled();
    });
  });
});
