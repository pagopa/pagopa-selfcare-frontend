import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { store } from '../../../../redux/store';
import NodeSignInPSPForm from '../NodeSignInPSPForm';
import { PortalApi } from '../../../../api/PortalApiClient';
import { CreditorInstitutionDetailsResource } from '../../../../api/generated/portal/CreditorInstitutionDetailsResource';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

describe('NodeSignInPSPForm', (injectedHistory?: ReturnType<typeof createMemoryHistory>) => {
  const history = injectedHistory ? injectedHistory : createMemoryHistory();

  test('Test rendering NodeSignInPSPForm and Sumbit', async () => {
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router history={history}>
            <NodeSignInPSPForm goBack={jest.fn()} />
          </Router>
        </ThemeProvider>
      </Provider>
    );

    const name = screen.getByTestId('name-test') as HTMLInputElement;
    const businessName = screen.getByTestId('businessName-test') as HTMLInputElement;
    const fiscalCode = screen.getByTestId('fiscalCode-test') as HTMLSelectElement;
    const abiCode = screen.getByTestId('abiCode-test') as HTMLInputElement;
    const pspCode = screen.getByTestId('pspCode-test') as HTMLInputElement;
    const bicCode = screen.getByTestId('bicCode-test') as HTMLInputElement;
    const digitalStampRadioTrue = screen.getByTestId('digitalStamp-true-test');

    fireEvent.change(bicCode, { target: { value: '1234' } });
    expect(bicCode.value).toBe('1234');

    fireEvent.click(digitalStampRadioTrue);

    const confirmBtn = await screen.findByTestId('continue-button-test');
    fireEvent.click(confirmBtn);
  });
});
