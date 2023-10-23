import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { PTResource } from '../../../../model/Node';
import { createStore } from '../../../../redux/store';
import {
  brokerAndEcDetailsResource_ECAndBroker,
  brokerOrPspDetailsResource_Empty,
  brokerOrPspDetailsResource_PSPAndBroker,
  ecBrokerDetails,
  pspBrokerDetails,
} from '../../../../services/__mocks__/nodeService';
import {
  PTUnsigned,
  PTECPSPSigned,
  PTPSPSigned,
  PTECSigned,
} from '../../../../services/__mocks__/partyService';
import NodeSignInPTForm from '../NodeSignInPTForm';
import { createMemoryHistory } from 'history';
import { screen, render } from '@testing-library/react';

let spyOnCreateBrokerPsp: jest.SpyInstance;
let SpyOnCreateEcBroker: jest.SpyInstance;

beforeEach(() => {
  spyOnCreateBrokerPsp = jest.spyOn(require('../../../../services/nodeService'), 'createPspBroker');
  SpyOnCreateEcBroker = jest.spyOn(require('../../../../services/nodeService'), 'createEcBroker');

  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

const renderApp = (
  signInData: PTResource,
  injectedStore?: ReturnType<typeof createStore>,
  injectedHistory?: ReturnType<typeof createMemoryHistory>
) => {
  const store = injectedStore ? injectedStore : createStore();
  const history = injectedHistory ? injectedHistory : createMemoryHistory();
  render(
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <NodeSignInPTForm goBack={jest.fn()} signInData={signInData} />
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  );

  const name = screen.getByTestId('name-test') as HTMLInputElement;
  const businessName = screen.getByTestId('businessName-test') as HTMLInputElement;
  const pspCheckbox = screen
    .getByTestId('psp-checkbox-test')
    .querySelector('input[type="checkbox"]') as HTMLInputElement;
  const ecCheckbox = screen
    .getByTestId('ec-checkbox-test')
    .querySelector('input[type="checkbox"]') as HTMLInputElement;
  const continueBtn = screen.getByTestId('continue-button-test') as HTMLInputElement;

  return { store, history, name, businessName, pspCheckbox, ecCheckbox, continueBtn };
};

test('Test Render NodeSignInPTForm with PT unsigned', async () => {
  const { store, name, businessName, pspCheckbox, ecCheckbox, continueBtn } = renderApp({});
  await waitFor(() =>
    store.dispatch({
      type: 'parties/setPartySelected',
      payload: PTUnsigned,
    })
  );

  expect(name.value).toBe(PTUnsigned.fiscalCode);
  expect(businessName.value).toBe(PTUnsigned.description);
  expect(pspCheckbox).not.toBeChecked();
  expect(ecCheckbox).not.toBeChecked();
  expect(continueBtn).toBeDisabled();
});

test('Test Render NodeSignInPTForm with PT unsigned and submit the form with psp checked', async () => {
  const { store, name, businessName, pspCheckbox, ecCheckbox, continueBtn } = renderApp({});
  await waitFor(() =>
    store.dispatch({
      type: 'parties/setPartySelected',
      payload: PTUnsigned,
    })
  );

  expect(name.value).toBe(PTUnsigned.fiscalCode);
  expect(businessName.value).toBe(PTUnsigned.description);

  expect(pspCheckbox).not.toBeChecked();
  expect(ecCheckbox).not.toBeChecked();

  fireEvent.click(pspCheckbox);

  expect(continueBtn).toBeDisabled();

  expect(pspCheckbox).toBeChecked();

  fireEvent.click(continueBtn);

  await waitFor(() => {
    expect(spyOnCreateBrokerPsp).toHaveBeenCalled();
    expect(SpyOnCreateEcBroker).toHaveBeenCalled();
  });
});

test('Test Render NodeSignInPTForm with EC/PSP signed', async () => {
  const ecAndPspBroker = {
    brokerDetailsResource: { ...ecBrokerDetails },
    brokerPspDetailsResource: { ...pspBrokerDetails },
  };

  const { store, name, businessName, pspCheckbox, ecCheckbox, continueBtn } =
    renderApp(ecAndPspBroker);

  await waitFor(() => {
    store.dispatch({
      type: 'parties/setSigninData',
      payload: ecAndPspBroker,
    });
  });

  await waitFor(() =>
    store.dispatch({
      type: 'parties/setPartySelected',
      payload: PTECPSPSigned,
    })
  );

  expect(name.value).toBe(PTECPSPSigned.fiscalCode);
  expect(businessName.value).toBe(PTECPSPSigned.description);

  expect(pspCheckbox).toBeChecked();
  expect(ecCheckbox).toBeChecked();

  expect(pspCheckbox).toBeDisabled();
  expect(ecCheckbox).toBeDisabled();

  expect(continueBtn).toBeDisabled();
});

test('Test PT - PSP - signed', async () => {
  const { store } = renderApp({});
  await waitFor(() =>
    store.dispatch({
      type: 'parties/setPartySelected',
      payload: PTPSPSigned,
    })
  );

  await waitFor(() => {
    store.dispatch({
      type: 'parties/setSigninData',
      payload: {
        brokerDetailsResource: {},
        brokerPspDetailsResource: brokerOrPspDetailsResource_PSPAndBroker.brokerPspDetailsResource,
      },
    });
  });
});

test('Test PT - EC - signed', async () => {
  const { store } = renderApp({});
  await waitFor(() =>
    store.dispatch({
      type: 'parties/setPartySelected',
      payload: PTECSigned,
    })
  );

  await waitFor(() => {
    store.dispatch({
      type: 'parties/setSigninData',
      payload: {
        brokerDetailsResource: brokerAndEcDetailsResource_ECAndBroker.brokerDetailsResource,
        brokerPspDetailsResource: {},
      },
    });
  });
});
