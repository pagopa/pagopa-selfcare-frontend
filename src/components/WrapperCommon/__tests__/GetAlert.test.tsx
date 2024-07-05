import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { cleanup, render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { WrapperStatusEnum } from '../../../api/generated/portal/ChannelDetailsResource';
import * as useUserRole from '../../../hooks/useUserRole';
import { ROLE } from '../../../model/RolePermission';
import { store } from '../../../redux/store';
import GetAlert from '../GetAlert';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.resetModules();
});
afterEach(cleanup);

describe('<GetAlert />', () => {
  test('render component GetAlert on APPROVED', async () => {
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <GetAlert
            componentPath={'channelDetailValidationPage'}
            wrapperStatus={WrapperStatusEnum.APPROVED}
            note={''}
            pendingUpdate={false}
          />
        </ThemeProvider>
      </Provider>
    );

    expect(screen.queryByTestId('on-validation-alert-test-id')).not.toBeInTheDocument();
    expect(screen.queryByTestId('pendingUpdate-alert-test-id')).not.toBeInTheDocument();
  });

  test('render component GetAlert on APPROVED with pending update', async () => {
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <GetAlert
            componentPath={'channelDetailValidationPage'}
            wrapperStatus={WrapperStatusEnum.APPROVED}
            note={''}
            pendingUpdate={true}
          />
        </ThemeProvider>
      </Provider>
    );

    expect(screen.queryByTestId('on-validation-alert-test-id')).not.toBeInTheDocument();
    expect(screen.getByTestId('pending-update-alert-test-id')).toBeInTheDocument();
  });

  test('render component GetAlert on TO_FIX', async () => {
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <GetAlert
            componentPath={'channelDetailValidationPage'}
            wrapperStatus={WrapperStatusEnum.TO_FIX}
            note={'note'}
            pendingUpdate={false}
          />
        </ThemeProvider>
      </Provider>
    );

    expect(screen.queryByTestId('pending-update-alert-test-id')).not.toBeInTheDocument();
    expect(screen.getByTestId('on-validation-alert-test-id')).toBeInTheDocument();
    expect(screen.getByTestId('to-fix-alert-test-id')).toBeInTheDocument();
    expect(screen.queryByTestId('to-check-alert-test-id')).not.toBeInTheDocument();
    expect(screen.queryByTestId('waiting-for-review-alert-test-id')).not.toBeInTheDocument();
  });

  test('render component GetAlert on TO_CHECK and is operator', async () => {
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
          <GetAlert
            componentPath={'channelDetailValidationPage'}
            wrapperStatus={WrapperStatusEnum.TO_CHECK}
            note={''}
            pendingUpdate={false}
          />
        </ThemeProvider>
      </Provider>
    );

    expect(screen.queryByTestId('pending-update-alert-test-id')).not.toBeInTheDocument();
    expect(screen.getByTestId('on-validation-alert-test-id')).toBeInTheDocument();
    expect(screen.queryByTestId('to-fix-alert-test-id')).not.toBeInTheDocument();
    expect(screen.getByTestId('to-check-alert-test-id')).toBeInTheDocument();
    expect(screen.queryByTestId('waiting-for-review-alert-test-id')).not.toBeInTheDocument();
  });

  test('render component GetAlert on TO_CHECK and not operator', async () => {
    jest.spyOn(useUserRole, 'useUserRole').mockReturnValue({
      userRole: ROLE.PAGOPA_OPERATOR,
      userIsPspAdmin: true,
      userIsEcAdmin: false,
      userIsPspDirectAdmin: true,
      userIsPagopaOperator: false,
      userIsAdmin: true,
    });

    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <GetAlert
            componentPath={'channelDetailValidationPage'}
            wrapperStatus={WrapperStatusEnum.TO_CHECK}
            note={''}
            pendingUpdate={false}
          />
        </ThemeProvider>
      </Provider>
    );

    expect(screen.queryByTestId('pending-update-alert-test-id')).not.toBeInTheDocument();
    expect(screen.getByTestId('on-validation-alert-test-id')).toBeInTheDocument();
    expect(screen.queryByTestId('to-fix-alert-test-id')).not.toBeInTheDocument();
    expect(screen.queryByTestId('to-check-alert-test-id')).not.toBeInTheDocument();
    expect(screen.getByTestId('waiting-for-review-alert-test-id')).toBeInTheDocument();
  });
});
